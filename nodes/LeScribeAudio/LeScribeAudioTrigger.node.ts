import crypto from 'node:crypto';

/**
 * Verifies the `X-LeScribe-Signature: t=<epoch>,v1=<hex>` header signed by Le Scribe Audio.
 */
export function verifyLeScribeSignature(
  signatureHeader: string,
  rawBody: Buffer | string,
  secret: string,
  maxSkewSeconds = 300
): boolean {
  if (!signatureHeader || !secret) return false;
  const parts = Object.fromEntries(
    signatureHeader
      .split(',')
      .map((kv) => kv.trim().split('='))
      .filter((pair) => pair.length === 2)
  );
  const ts = Number(parts.t);
  const v1 = String(parts.v1 || '').toLowerCase();
  if (!Number.isFinite(ts) || !v1 || v1.length !== 64) return false;

  if (maxSkewSeconds > 0) {
    const nowSec = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSec - ts) > maxSkewSeconds) return false;
  }

  const bodyBuf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8');
  const signingInput = Buffer.concat([Buffer.from(`${Math.trunc(ts)}.`, 'utf8'), bodyBuf]);
  const expected = crypto.createHmac('sha256', secret).update(signingInput).digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(v1, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export class LeScribeAudioTrigger {
  description = {
    displayName: 'Le Scribe Audio Trigger',
    name: 'leScribeAudioTrigger',
    icon: 'file:lescribeaudio.svg',
    group: ['trigger'],
    version: 1,
    description:
      'Starts an n8n workflow when a Le Scribe Audio transcription finishes (transcription.completed or transcription.failed) with HMAC-SHA256 verification.',
    defaults: {
      name: 'Le Scribe Audio Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'leScribeAudioApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'lescribeaudio-webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          { name: 'Transcription Completed', value: 'transcription.completed' },
          { name: 'Transcription Failed', value: 'transcription.failed' },
          { name: 'Webhook Test', value: 'webhook.test' },
        ],
        default: ['transcription.completed'],
        required: true,
      },
      {
        displayName: 'Verify HMAC-SHA256 Signature',
        name: 'verifySignature',
        type: 'boolean',
        default: true,
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: any): Promise<boolean> {
        const staticData = this.getWorkflowStaticData('node');
        return Boolean(staticData.webhookId);
      },
      async create(this: any): Promise<boolean> {
        const credentials = await this.getCredentials('leScribeAudioApi');
        const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events', ['transcription.completed']);
        const res = await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/api/v1/public/webhooks`,
          headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: { url: webhookUrl, events },
          json: true,
        });
        const staticData = this.getWorkflowStaticData('node');
        staticData.webhookId = res.id;
        staticData.webhookSecret = res.secret;
        return true;
      },
      async delete(this: any): Promise<boolean> {
        const staticData = this.getWorkflowStaticData('node');
        if (!staticData.webhookId) return true;
        const credentials = await this.getCredentials('leScribeAudioApi');
        const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
        try {
          await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${baseUrl}/api/v1/public/webhooks/${encodeURIComponent(staticData.webhookId)}`,
            headers: { Authorization: `Bearer ${credentials.apiKey}` },
            json: true,
          });
        } catch {
          // Ignore already deleted remote webhook
        }
        delete staticData.webhookId;
        delete staticData.webhookSecret;
        return true;
      },
    },
  };

  async webhook(this: any): Promise<any> {
    const req = this.getRequestObject();
    const verify = this.getNodeParameter('verifySignature', true);
    const staticData = this.getWorkflowStaticData('node');

    if (verify && staticData.webhookSecret) {
      const sig = String(req.headers['x-lescribe-signature'] || '');
      const rawBody = req.rawBody || JSON.stringify(this.getBodyData());
      if (!verifyLeScribeSignature(sig, rawBody, String(staticData.webhookSecret))) {
        return { webhookResponse: 'Invalid X-LeScribe-Signature', workflowData: [] };
      }
    }

    const body = this.getBodyData();
    return {
      workflowData: [this.helpers.returnJsonArray(body)],
    };
  }
}

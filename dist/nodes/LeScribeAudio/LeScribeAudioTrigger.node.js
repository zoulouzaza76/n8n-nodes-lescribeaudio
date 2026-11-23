"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeScribeAudioTrigger = void 0;
exports.verifyLeScribeSignature = verifyLeScribeSignature;
const node_crypto_1 = __importDefault(require("node:crypto"));
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Verifies the `X-LeScribe-Signature: t=<epoch>,v1=<hex>` header signed by Le Scribe Audio.
 */
function verifyLeScribeSignature(signatureHeader, rawBody, secret, maxSkewSeconds = 300) {
    if (!signatureHeader || !secret)
        return false;
    const parts = Object.fromEntries(signatureHeader
        .split(',')
        .map((kv) => kv.trim().split('='))
        .filter((pair) => pair.length === 2));
    const ts = Number(parts.t);
    const v1 = String(parts.v1 || '').toLowerCase();
    if (!Number.isFinite(ts) || !v1 || v1.length !== 64)
        return false;
    if (maxSkewSeconds > 0) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (Math.abs(nowSec - ts) > maxSkewSeconds)
            return false;
    }
    const bodyBuf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8');
    const signingInput = Buffer.concat([Buffer.from(`${Math.trunc(ts)}.`, 'utf8'), bodyBuf]);
    const expected = node_crypto_1.default.createHmac('sha256', secret).update(signingInput).digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(v1, 'hex');
    if (expectedBuf.length !== actualBuf.length)
        return false;
    return node_crypto_1.default.timingSafeEqual(expectedBuf, actualBuf);
}
class LeScribeAudioTrigger {
    constructor() {
        this.description = {
            displayName: 'Le Scribe Audio Trigger',
            name: 'leScribeAudioTrigger',
            icon: {
                light: 'file:lescribeaudio.svg',
                dark: 'file:lescribeaudio.dark.svg',
            },
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Starts an n8n workflow when a Le Scribe Audio transcription finishes (transcription.completed or transcription.failed) with HMAC-SHA256 verification',
            defaults: {
                name: 'Le Scribe Audio Trigger',
            },
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const staticData = this.getWorkflowStaticData('node');
                    return Boolean(staticData.webhookId);
                },
                async create() {
                    const credentials = await this.getCredentials('leScribeAudioApi');
                    const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const events = this.getNodeParameter('events', ['transcription.completed']);
                    const res = (await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                        method: 'POST',
                        url: `${baseUrl}/api/v1/public/webhooks`,
                        body: { url: webhookUrl, events },
                        json: true,
                    }));
                    const staticData = this.getWorkflowStaticData('node');
                    staticData.webhookId = res.id;
                    staticData.webhookSecret = res.secret;
                    return true;
                },
                async delete() {
                    const staticData = this.getWorkflowStaticData('node');
                    if (!staticData.webhookId)
                        return true;
                    const credentials = await this.getCredentials('leScribeAudioApi');
                    const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
                    try {
                        await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                            method: 'DELETE',
                            url: `${baseUrl}/api/v1/public/webhooks/${encodeURIComponent(String(staticData.webhookId))}`,
                            json: true,
                        });
                    }
                    catch (error) {
                        const errObj = error;
                        if ((errObj === null || errObj === void 0 ? void 0 : errObj.statusCode) !== 404 && (errObj === null || errObj === void 0 ? void 0 : errObj.httpCode) !== '404') {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                    }
                    delete staticData.webhookId;
                    delete staticData.webhookSecret;
                    return true;
                },
            },
        };
    }
    async webhook() {
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
exports.LeScribeAudioTrigger = LeScribeAudioTrigger;

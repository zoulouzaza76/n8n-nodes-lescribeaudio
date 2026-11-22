import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { LeScribeAudio, LeScribeAudioTrigger, LeScribeAudioApi, verifyLeScribeSignature } = await import(
  path.join(root, 'dist', 'index.js')
);

test('verifyLeScribeSignature validates HMAC-SHA256 signatures matching backend/app/core/webhook_dispatcher.py', () => {
  const secret = 'whsec_test_1234567890';
  const ts = Math.floor(Date.now() / 1000);
  const rawBody = JSON.stringify({ id: 'evt_1', event: 'transcription.completed', data: { file_id: 'abc123' } });
  const digest = crypto.createHmac('sha256', secret).update(`${ts}.${rawBody}`, 'utf8').digest('hex');
  const header = `t=${ts},v1=${digest}`;

  assert.equal(verifyLeScribeSignature(header, rawBody, secret), true);
  assert.equal(verifyLeScribeSignature(header, rawBody + 'tampered', secret), false);
  assert.equal(verifyLeScribeSignature(header, rawBody, 'wrong_secret'), false);
  assert.equal(verifyLeScribeSignature(`t=${ts - 900},v1=${digest}`, rawBody, secret, 300), false);
});

test('LeScribeAudio node executes submitUrl and list operations cleanly against mocked helpers', async () => {
  const node = new LeScribeAudio();
  const requests = [];
  const ctx = {
    getInputData: () => [{ json: { ok: true } }],
    getCredentials: async () => ({ apiKey: 'lsa_api_test', baseUrl: 'https://lescribeaudio.com/' }),
    getNodeParameter: (name, _idx, fallback) => {
      const map = {
        resource: 'transcription',
        operation: 'submitUrl',
        sourceUrl: 'https://example.org/conseil.mp3',
        verbatimMode: 'clean',
        generateSummary: true,
        contextHints: 'Conseil municipal',
        filename: 'conseil.mp3',
        webhookUrl: '',
      };
      return name in map ? map[name] : fallback;
    },
    helpers: {
      httpRequest: async (opts) => {
        requests.push(opts);
        return { file_id: 'job_42', status: 'queued' };
      },
    },
  };

  const [out] = await node.execute.call(ctx);
  assert.equal(out.length, 1);
  assert.equal(out[0].json.file_id, 'job_42');
  assert.equal(requests[0].url, 'https://lescribeaudio.com/api/v1/public/transcriptions');
  assert.equal(requests[0].headers.Authorization, 'Bearer lsa_api_test');
  assert.equal(requests[0].body.generate_summary, true);
});

test('Credentials, Trigger metadata, and 3 workflow JSON templates are well-formed', () => {
  const creds = new LeScribeAudioApi();
  assert.equal(creds.name, 'leScribeAudioApi');

  const trigger = new LeScribeAudioTrigger();
  assert.equal(trigger.description.name, 'leScribeAudioTrigger');

  const wfDir = path.join(root, 'workflows');
  const files = fs.readdirSync(wfDir).filter((f) => f.endsWith('.json'));
  assert.equal(files.length, 3);
  for (const f of files) {
    const parsed = JSON.parse(fs.readFileSync(path.join(wfDir, f), 'utf8'));
    assert.ok(Array.isArray(parsed.nodes) && parsed.nodes.length >= 3, `Workflow ${f} invalid`);
  }
});

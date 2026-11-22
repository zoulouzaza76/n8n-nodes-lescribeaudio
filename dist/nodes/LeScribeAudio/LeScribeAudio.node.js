"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeScribeAudio = void 0;
class LeScribeAudio {
    description = {
        displayName: 'Le Scribe Audio',
        name: 'leScribeAudio',
        icon: 'file:lescribeaudio.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        description: 'Transcribe long French audio/video files (up to 10h / 10 GB) into modifiable Word (.docx), SRT, VTT, JSON and executive/chrono-thematic summary via Le Scribe Audio Public REST API.',
        defaults: {
            name: 'Le Scribe Audio',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'leScribeAudioApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Transcription', value: 'transcription' },
                    { name: 'Webhook', value: 'webhook' },
                ],
                default: 'transcription',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['transcription'] } },
                options: [
                    { name: 'Submit from Public URL', value: 'submitUrl', action: 'Submit audio or video URL for transcription' },
                    { name: 'Submit Binary File', value: 'submitFile', action: 'Upload binary audio or video file for transcription' },
                    { name: 'Get Status & Transcript', value: 'get', action: 'Get transcription status, segments and summary' },
                    { name: 'Export Deliverable (DOCX / SRT / VTT / TXT / JSON)', value: 'export', action: 'Export transcription file' },
                    { name: 'List Transcriptions', value: 'list', action: 'List recent transcriptions' },
                ],
                default: 'submitUrl',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['webhook'] } },
                options: [
                    { name: 'List Webhooks', value: 'listWebhooks', action: 'List configured webhooks' },
                    { name: 'Create Webhook', value: 'createWebhook', action: 'Create outbound webhook' },
                    { name: 'Test Webhook', value: 'testWebhook', action: 'Send signed test webhook event' },
                    { name: 'Delete Webhook', value: 'deleteWebhook', action: 'Delete outbound webhook' },
                ],
                default: 'listWebhooks',
            },
            {
                displayName: 'Source Media URL',
                name: 'sourceUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl'] } },
                description: 'Public HTTPS URL of the audio or video file (.mp3, .m4a, .wav, .mp4, .ds2, .dss).',
            },
            {
                displayName: 'Binary Property Name',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: { show: { resource: ['transcription'], operation: ['submitFile'] } },
            },
            {
                displayName: 'Filename Override',
                name: 'filename',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl'] } },
            },
            {
                displayName: 'Verbatim Mode',
                name: 'verbatimMode',
                type: 'options',
                options: [
                    { name: 'Clean (Épuré / Rédactionnel)', value: 'clean' },
                    { name: 'Full Verbatim (Intégral)', value: 'full' },
                ],
                default: 'clean',
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
            },
            {
                displayName: 'Generate Executive & Chrono-Thematic Summary',
                name: 'generateSummary',
                type: 'boolean',
                default: false,
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
            },
            {
                displayName: 'Context Hints (Optional, max 400 chars)',
                name: 'contextHints',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
                description: 'Brief context or proper nouns to guide 2-pass transcription (e.g. Conseil municipal de Rennes, PLUi, DOB).',
            },
            {
                displayName: 'Per-Job Webhook Callback URL (Optional)',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
            },
            {
                displayName: 'File ID',
                name: 'fileId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['transcription'], operation: ['get', 'export'] } },
            },
            {
                displayName: 'Export Format',
                name: 'exportFormat',
                type: 'options',
                options: [
                    { name: 'Word (.docx)', value: 'docx' },
                    { name: 'SubRip (.srt)', value: 'srt' },
                    { name: 'WebVTT (.vtt)', value: 'vtt' },
                    { name: 'Plain Text (.txt)', value: 'txt' },
                    { name: 'JSON (.json)', value: 'json' },
                ],
                default: 'docx',
                displayOptions: { show: { resource: ['transcription'], operation: ['export'] } },
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 25,
                displayOptions: { show: { resource: ['transcription'], operation: ['list'] } },
            },
            {
                displayName: 'Webhook HTTPS URL',
                name: 'targetWebhookUrl',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook'] } },
            },
            {
                displayName: 'Webhook ID',
                name: 'webhookId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['webhook'], operation: ['testWebhook', 'deleteWebhook'] } },
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('leScribeAudioApi');
        const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
        const authHeaders = { Authorization: `Bearer ${credentials.apiKey}` };
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            if (resource === 'transcription' && operation === 'list') {
                const limit = this.getNodeParameter('limit', i, 25);
                const res = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/transcriptions`,
                    qs: { limit },
                    headers: authHeaders,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'submitUrl') {
                const body = {
                    source_url: this.getNodeParameter('sourceUrl', i),
                    verbatim_mode: this.getNodeParameter('verbatimMode', i, 'clean'),
                    generate_summary: this.getNodeParameter('generateSummary', i, false),
                };
                const filename = this.getNodeParameter('filename', i, '');
                const contextHints = this.getNodeParameter('contextHints', i, '');
                const webhookUrl = this.getNodeParameter('webhookUrl', i, '');
                if (filename)
                    body.filename = filename;
                if (contextHints)
                    body.context_hints = contextHints;
                if (webhookUrl)
                    body.webhook_url = webhookUrl;
                const res = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/transcriptions`,
                    headers: { ...authHeaders, 'Content-Type': 'application/json' },
                    body,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'submitFile') {
                const binProp = this.getNodeParameter('binaryPropertyName', i, 'data');
                const binMeta = items[i]?.binary?.[binProp];
                if (!binMeta) {
                    throw new Error(`Missing binary property "${binProp}" on input item ${i}.`);
                }
                const buffer = await this.helpers.getBinaryDataBuffer(i, binProp);
                const form = new FormData();
                const blob = new Blob([buffer], { type: binMeta.mimeType || 'audio/mpeg' });
                form.append('file', blob, binMeta.fileName || 'audio.mp3');
                form.append('verbatim_mode', String(this.getNodeParameter('verbatimMode', i, 'clean')));
                form.append('generate_summary', String(this.getNodeParameter('generateSummary', i, false)));
                const contextHints = String(this.getNodeParameter('contextHints', i, ''));
                const webhookUrl = String(this.getNodeParameter('webhookUrl', i, ''));
                if (contextHints)
                    form.append('context_hints', contextHints);
                if (webhookUrl)
                    form.append('webhook_url', webhookUrl);
                const resp = await fetch(`${baseUrl}/api/v1/public/transcriptions`, {
                    method: 'POST',
                    headers: authHeaders,
                    body: form,
                });
                const data = await resp.json();
                if (!resp.ok) {
                    throw new Error(`Le Scribe Audio API error (${resp.status}): ${JSON.stringify(data)}`);
                }
                returnData.push({ json: data, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'get') {
                const fileId = encodeURIComponent(String(this.getNodeParameter('fileId', i)));
                const res = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/transcriptions/${fileId}`,
                    headers: authHeaders,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'export') {
                const fileId = encodeURIComponent(String(this.getNodeParameter('fileId', i)));
                const format = String(this.getNodeParameter('exportFormat', i, 'docx'));
                if (format === 'json') {
                    const res = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/public/transcriptions/${fileId}/export`,
                        qs: { format: 'json' },
                        headers: authHeaders,
                        json: true,
                    });
                    returnData.push({ json: res, pairedItem: i });
                }
                else {
                    const rawBuf = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/api/v1/public/transcriptions/${fileId}/export`,
                        qs: { format },
                        headers: authHeaders,
                        encoding: 'arraybuffer',
                    });
                    const mimeMap = {
                        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        srt: 'application/x-subrip',
                        vtt: 'text/vtt',
                        txt: 'text/plain',
                    };
                    const binaryData = await this.helpers.prepareBinaryData(Buffer.from(rawBuf), `${fileId}.${format}`, mimeMap[format] || 'application/octet-stream');
                    returnData.push({ json: { file_id: fileId, format }, binary: { data: binaryData }, pairedItem: i });
                }
            }
            else if (resource === 'webhook' && operation === 'listWebhooks') {
                const res = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/webhooks`,
                    headers: authHeaders,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'createWebhook') {
                const res = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/webhooks`,
                    headers: { ...authHeaders, 'Content-Type': 'application/json' },
                    body: { url: this.getNodeParameter('targetWebhookUrl', i) },
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'testWebhook') {
                const wid = encodeURIComponent(String(this.getNodeParameter('webhookId', i)));
                const res = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/webhooks/${wid}/test`,
                    headers: authHeaders,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'deleteWebhook') {
                const wid = encodeURIComponent(String(this.getNodeParameter('webhookId', i)));
                const res = await this.helpers.httpRequest({
                    method: 'DELETE',
                    url: `${baseUrl}/api/v1/public/webhooks/${wid}`,
                    headers: authHeaders,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
        }
        return [returnData];
    }
}
exports.LeScribeAudio = LeScribeAudio;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeScribeAudio = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class LeScribeAudio {
    constructor() {
        this.description = {
            displayName: 'Le Scribe Audio',
            name: 'leScribeAudio',
            icon: {
                light: 'file:lescribeaudio.svg',
                dark: 'file:lescribeaudio.dark.svg',
            },
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Transcribe long French audio/video files (up to 10h / 10 GB) into modifiable Word (.docx), SRT, VTT, JSON and executive/chrono-thematic summary via Le Scribe Audio Public REST API',
            defaults: {
                name: 'Le Scribe Audio',
            },
            usableAsTool: true,
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                        {
                            name: 'Export',
                            value: 'export',
                            action: 'Export transcription file',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get a transcription',
                        },
                        {
                            name: 'List',
                            value: 'list',
                            action: 'List recent transcriptions',
                        },
                        {
                            name: 'Submit Binary File',
                            value: 'submitFile',
                            action: 'Upload a binary audio or video file for transcription',
                        },
                        {
                            name: 'Submit From Public URL',
                            value: 'submitUrl',
                            action: 'Submit a public audio or video URL for transcription',
                        },
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
                        { name: 'Create', value: 'createWebhook', action: 'Create an outbound webhook' },
                        { name: 'Delete', value: 'deleteWebhook', action: 'Delete an outbound webhook' },
                        { name: 'List', value: 'listWebhooks', action: 'List configured webhooks' },
                        { name: 'Test', value: 'testWebhook', action: 'Send a signed test webhook event' },
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
                    description: 'Public HTTPS URL of the audio or video file (.mp3, .m4a, .wav, .mp4, .ds2, .dss)',
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
                        { name: 'Clean (Edited)', value: 'clean' },
                        { name: 'Full Verbatim', value: 'full' },
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
                    displayName: 'Context Hints',
                    name: 'contextHints',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
                    description: 'Optional context or proper nouns (max 400 chars) to guide 2-pass transcription (e.g. municipal council, acronyms)',
                },
                {
                    displayName: 'Per-Job Webhook Callback URL',
                    name: 'webhookUrl',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['transcription'], operation: ['submitUrl', 'submitFile'] } },
                    description: 'Optional HTTPS URL notified when this transcription completes',
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
                        { name: 'JSON (.json)', value: 'json' },
                        { name: 'Plain Text (.txt)', value: 'txt' },
                        { name: 'SubRip (.srt)', value: 'srt' },
                        { name: 'WebVTT (.vtt)', value: 'vtt' },
                        { name: 'Word (.docx)', value: 'docx' },
                    ],
                    default: 'docx',
                    displayOptions: { show: { resource: ['transcription'], operation: ['export'] } },
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 50,
                    description: 'Max number of results to return',
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
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('leScribeAudioApi');
        const baseUrl = String(credentials.baseUrl || 'https://lescribeaudio.com').replace(/\/+$/, '');
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            if (resource === 'transcription' && operation === 'list') {
                const limit = this.getNodeParameter('limit', i, 50);
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/transcriptions`,
                    qs: { limit },
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
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/transcriptions`,
                    body,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'submitFile') {
                const binProp = this.getNodeParameter('binaryPropertyName', i, 'data');
                const binMeta = (_b = (_a = items[i]) === null || _a === void 0 ? void 0 : _a.binary) === null || _b === void 0 ? void 0 : _b[binProp];
                if (!binMeta) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing binary property "${binProp}" on input item ${i}`, { itemIndex: i });
                }
                const buffer = await this.helpers.getBinaryDataBuffer(i, binProp);
                const form = new FormData();
                const blob = new Blob([new Uint8Array(buffer)], { type: binMeta.mimeType || 'audio/mpeg' });
                form.append('file', blob, binMeta.fileName || 'audio.mp3');
                form.append('verbatim_mode', String(this.getNodeParameter('verbatimMode', i, 'clean')));
                form.append('generate_summary', String(this.getNodeParameter('generateSummary', i, false)));
                const contextHints = String(this.getNodeParameter('contextHints', i, ''));
                const webhookUrl = String(this.getNodeParameter('webhookUrl', i, ''));
                if (contextHints)
                    form.append('context_hints', contextHints);
                if (webhookUrl)
                    form.append('webhook_url', webhookUrl);
                const data = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/transcriptions`,
                    body: form,
                    json: true,
                });
                returnData.push({ json: data, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'get') {
                const fileId = encodeURIComponent(String(this.getNodeParameter('fileId', i)));
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/transcriptions/${fileId}`,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'transcription' && operation === 'export') {
                const fileId = encodeURIComponent(String(this.getNodeParameter('fileId', i)));
                const format = String(this.getNodeParameter('exportFormat', i, 'docx'));
                if (format === 'json') {
                    const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                        method: 'GET',
                        url: `${baseUrl}/api/v1/public/transcriptions/${fileId}/export`,
                        qs: { format: 'json' },
                        json: true,
                    });
                    returnData.push({ json: res, pairedItem: i });
                }
                else {
                    const rawBuf = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                        method: 'GET',
                        url: `${baseUrl}/api/v1/public/transcriptions/${fileId}/export`,
                        qs: { format },
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
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'GET',
                    url: `${baseUrl}/api/v1/public/webhooks`,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'createWebhook') {
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/webhooks`,
                    body: { url: this.getNodeParameter('targetWebhookUrl', i) },
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'testWebhook') {
                const wid = encodeURIComponent(String(this.getNodeParameter('webhookId', i)));
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'POST',
                    url: `${baseUrl}/api/v1/public/webhooks/${wid}/test`,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
            else if (resource === 'webhook' && operation === 'deleteWebhook') {
                const wid = encodeURIComponent(String(this.getNodeParameter('webhookId', i)));
                const res = await this.helpers.httpRequestWithAuthentication.call(this, 'leScribeAudioApi', {
                    method: 'DELETE',
                    url: `${baseUrl}/api/v1/public/webhooks/${wid}`,
                    json: true,
                });
                returnData.push({ json: res, pairedItem: i });
            }
        }
        return [returnData];
    }
}
exports.LeScribeAudio = LeScribeAudio;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeScribeAudioApi = void 0;
class LeScribeAudioApi {
    name = 'leScribeAudioApi';
    displayName = 'Le Scribe Audio API';
    documentationUrl = 'https://lescribeaudio.com/integrations-mcp';
    properties = [
        {
            displayName: 'Personal API Key (lsa_api_...)',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Generate your Personal API Key (Bearer lsa_api_...) from https://lescribeaudio.com/integrations-mcp or POST /api/v1/public/tokens.',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://lescribeaudio.com',
            required: true,
            description: 'Le Scribe Audio API base URL (default: https://lescribeaudio.com).',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/api/v1/public/transcriptions?limit=1',
            method: 'GET',
        },
    };
}
exports.LeScribeAudioApi = LeScribeAudioApi;

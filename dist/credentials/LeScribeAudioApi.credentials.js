"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeScribeAudioApi = void 0;
class LeScribeAudioApi {
    constructor() {
        this.name = 'leScribeAudioApi';
        this.displayName = 'Le Scribe Audio API';
        this.icon = {
            light: 'file:../nodes/LeScribeAudio/lescribeaudio.svg',
            dark: 'file:../nodes/LeScribeAudio/lescribeaudio.dark.svg',
        };
        this.documentationUrl = 'https://lescribeaudio.com/integrations-mcp';
        this.properties = [
            {
                displayName: 'Personal API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Generate your Personal API Key (lsa_api_...) from https://lescribeaudio.com/integrations-mcp or POST /api/v1/public/tokens',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://lescribeaudio.com',
                required: true,
                description: 'Le Scribe Audio API base URL (default: https://lescribeaudio.com)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials?.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials?.baseUrl}}',
                url: '/api/v1/public/transcriptions',
                qs: { limit: 1 },
                method: 'GET',
            },
        };
    }
}
exports.LeScribeAudioApi = LeScribeAudioApi;

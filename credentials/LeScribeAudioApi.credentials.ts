import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LeScribeAudioApi implements ICredentialType {
  name = 'leScribeAudioApi';

  displayName = 'Le Scribe Audio API';

  icon: Icon = {
    light: 'file:../nodes/LeScribeAudio/lescribeaudio.svg',
    dark: 'file:../nodes/LeScribeAudio/lescribeaudio.dark.svg',
  };

  documentationUrl = 'https://lescribeaudio.com/integrations-mcp';

  properties: INodeProperties[] = [
    {
      displayName: 'Personal API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Generate your Personal API Key (lsa_api_...) from https://lescribeaudio.com/integrations-mcp or POST /api/v1/public/tokens',
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

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials?.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials?.baseUrl}}',
      url: '/api/v1/public/transcriptions',
      qs: { limit: 1 },
      method: 'GET',
    },
  };
}

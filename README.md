# `n8n-nodes-lescribeaudio` — Official n8n Community Node for Le Scribe Audio

Official MIT-licensed **n8n community node** and HMAC-SHA256 webhook trigger for the **Le Scribe Audio** Public REST API (`/api/v1/public`).

Transcribe long French audio and video recordings (`.mp3`, `.m4a`, `.wav`, `.mp4`, `.ds2`, `.dss`, up to 10 hours / 10 GB) into modifiable Microsoft Word (`.docx`), `.SRT`, `.VTT`, `.TXT`, and structured `.JSON`, with speaker diarization and optional executive + chrono-thematic summary.

- **Data storage in France (OVHcloud, AES-256)** with 1-click deletion
- **AI inference via Google Cloud Vertex AI (Europe region, Zero Data Retention)** — no training on user data
- **No intrusive meeting bot** — asynchronous file/URL submission only

## Included Nodes
1. **Le Scribe Audio** (`leScribeAudio`): Submit from URL or binary file, inspect status/segments/summary, export `docx`/`srt`/`vtt`/`txt`/`json`, manage webhooks.
2. **Le Scribe Audio Trigger** (`leScribeAudioTrigger`): Automatically registers an outbound webhook and validates `X-LeScribe-Signature` (`t=<epoch>,v1=<hmac_sha256>`) on `transcription.completed` and `transcription.failed`.

## Ready-to-Import Workflow Templates (`workflows/`)
1. `1-drive-audio-to-word-summary.json` — Google Drive / Nextcloud folder → 2-pass transcription → `.docx` Word deliverable
2. `2-mairie-conseil-rgaa-subtitles.json` — Municipal council video → RGAA 4.1 `.VTT` subtitles + `.docx` minutes draft
3. `3-nextcloud-entretien-shs-iramuteq.json` — Qualitative research interview → full verbatim structured JSON

## Installation in n8n
```bash
npm install n8n-nodes-lescribeaudio
```
Or install directly from **n8n Settings → Community Nodes → `n8n-nodes-lescribeaudio`**.

## Documentation
- API & MCP Integration Hub: https://lescribeaudio.com/integrations-mcp
- OpenAPI 3.1 Specification: https://lescribeaudio.com/docs/openapi-public-v1.json
- RGPD & Security Overview: https://lescribeaudio.com/securite-rgpd

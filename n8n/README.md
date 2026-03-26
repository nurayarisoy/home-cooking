# n8n Social Publish Setup

This folder contains an importable n8n workflow for social publishing:

- `workflows/home-cooking-social-publish.json`
- `workflows/home-cooking-youtube-direct-upload.json`
- `workflows/home-cooking-alerts.json`

Production rollout checklist:

- `PRODUCTION-GO-LIVE.md`

Health/status endpoint:

- `GET /api/integrations/status`
- In production, set `STATUS_API_KEY` and send it via `x-status-key` header.

## What This Workflow Does

1. Receives webhook events from the app (`recipe.publish`)
2. Verifies `x-webhook-secret`
3. Normalizes caption/title payload
4. Publishes to Instagram via Meta Graph API:
	- image flow (`image_url`)
	- reels/video flow (`media_type=REELS`, `video_url`)
5. Publishes to YouTube using relay mode by default
	- set `YOUTUBE_PUBLISH_WEBHOOK_URL` to the second workflow webhook URL for direct upload
6. Responds to webhook with success/fail status

## YouTube Direct Upload Workflow

`workflows/home-cooking-youtube-direct-upload.json` handles:

1. Webhook + secret validation
2. Media download from `mediaUrl`
3. YouTube resumable upload session initialization
4. Binary upload with the returned upload URL
5. Success response with upload result

## Required Environment Variables

Set these in n8n (or in your n8n host environment):

- `N8N_SOCIAL_WEBHOOK_SECRET`: Must match app secret
- `IG_USER_ID`: Instagram Business Account ID
- `IG_ACCESS_TOKEN`: Long-lived Meta Graph token
- `YOUTUBE_DIRECT_ENABLED`: `true` to use direct mode in social workflow
- `YOUTUBE_CLIENT_ID`: Google OAuth client id (required for direct mode)
- `YOUTUBE_CLIENT_SECRET`: Google OAuth client secret (required for direct mode)
- `YOUTUBE_REFRESH_TOKEN`: Google OAuth refresh token (required for direct mode)
- `YOUTUBE_PUBLISH_WEBHOOK_URL`: A service endpoint that handles YouTube upload from URL
- `TELEGRAM_BOT_TOKEN`: Telegram bot token (optional, for alert workflow)
- `TELEGRAM_CHAT_ID`: Telegram chat id (optional, for alert workflow)
- `ALERT_FROM_EMAIL`: From email address (optional, for alert workflow)
- `ALERT_TO_EMAIL`: Recipient email address (optional, for alert workflow)

Set these in your app environment:

- `N8N_SOCIAL_WEBHOOK_URL`: n8n webhook URL (example: `https://your-n8n-host/webhook/home-cooking-social`)
- `N8N_SOCIAL_WEBHOOK_SECRET`: same secret as n8n
- `SITE_URL`: public base URL of your app (for absolute media URLs)

## Import Steps

1. Open n8n UI
2. Go to Workflows -> Import from File
3. Select `n8n/workflows/home-cooking-social-publish.json`
4. Save workflow
5. Import `n8n/workflows/home-cooking-youtube-direct-upload.json`
6. Save workflow
7. Import `n8n/workflows/home-cooking-alerts.json`
8. Save workflow
9. Activate all workflows
10. Set `YOUTUBE_PUBLISH_WEBHOOK_URL` to the direct workflow webhook URL, e.g.:

```text
https://your-n8n-host/webhook/home-cooking-youtube-direct
```

## Google OAuth Refresh Token Setup (YouTube)

1. Open Google Cloud Console and create/select a project.
2. Enable YouTube Data API v3.
3. Create OAuth Client Credentials (Web application).
4. Add your OAuth redirect URL used by your auth tool.
5. Complete consent screen setup and add your Google account as a test user.
6. Run OAuth authorization with scope:

```text
https://www.googleapis.com/auth/youtube.upload
```

7. Exchange authorization code for tokens.
8. Save these values in n8n environment:
	- `YOUTUBE_CLIENT_ID`
	- `YOUTUBE_CLIENT_SECRET`
	- `YOUTUBE_REFRESH_TOKEN`

The direct upload workflow refreshes access token automatically before each upload.

## Alert Workflow Setup

`workflows/home-cooking-alerts.json` listens to n8n execution errors and sends alerts.

1. Import and activate the alert workflow.
2. If you want Telegram alerts, set:
	- `TELEGRAM_BOT_TOKEN`
	- `TELEGRAM_CHAT_ID`
3. If you want Email alerts, set:
	- `ALERT_FROM_EMAIL`
	- `ALERT_TO_EMAIL`
4. Configure SMTP credentials in n8n for the `Send Email Alert` node.

## Notes

- Instagram branch now auto-selects image vs reels from `recipe.mediaType`.
- If your media host blocks downloads from n8n, direct upload workflow will fail at the download step; allowlist your n8n IP or use signed URLs.
- The direct upload workflow refreshes YouTube access token automatically before upload.
- Retry/backoff is enabled on external HTTP steps in direct workflow, and app-side webhook dispatch also retries with exponential backoff.

# Home Cooking Production Go-Live Checklist

Status legend:
- [ ] not done
- [x] done

## Current Local Status (auto-check)

Checked from `.env.local` on 2026-03-25:
Re-checked after user confirmation: all required keys still `missing`.

- [ ] N8N_SOCIAL_WEBHOOK_URL
- [ ] N8N_SOCIAL_WEBHOOK_SECRET
- [ ] SITE_URL
- [ ] MONGODB_URI
- [ ] SESSION_SECRET
- [ ] IG_USER_ID
- [ ] IG_ACCESS_TOKEN
- [ ] YOUTUBE_DIRECT_ENABLED
- [ ] YOUTUBE_CLIENT_ID
- [ ] YOUTUBE_CLIENT_SECRET
- [ ] YOUTUBE_REFRESH_TOKEN
- [ ] YOUTUBE_PUBLISH_WEBHOOK_URL
- [ ] TELEGRAM_BOT_TOKEN (optional)
- [ ] TELEGRAM_CHAT_ID (optional)
- [ ] ALERT_FROM_EMAIL (optional)
- [ ] ALERT_TO_EMAIL (optional)

## 1) Environment Variables

### App environment
- [ ] N8N_SOCIAL_WEBHOOK_URL
- [ ] N8N_SOCIAL_WEBHOOK_SECRET
- [ ] SITE_URL
- [ ] MONGODB_URI (or SQLite strategy confirmed)
- [ ] SESSION_SECRET

### n8n environment
- [ ] N8N_SOCIAL_WEBHOOK_SECRET
- [ ] IG_USER_ID
- [ ] IG_ACCESS_TOKEN
- [ ] YOUTUBE_DIRECT_ENABLED
- [ ] YOUTUBE_CLIENT_ID
- [ ] YOUTUBE_CLIENT_SECRET
- [ ] YOUTUBE_REFRESH_TOKEN
- [ ] YOUTUBE_PUBLISH_WEBHOOK_URL
- [ ] TELEGRAM_BOT_TOKEN (optional)
- [ ] TELEGRAM_CHAT_ID (optional)
- [ ] ALERT_FROM_EMAIL (optional)
- [ ] ALERT_TO_EMAIL (optional)

## 2) n8n Workflow Import and Activation

- [ ] Import workflows/home-cooking-social-publish.json
- [ ] Import workflows/home-cooking-youtube-direct-upload.json
- [ ] Import workflows/home-cooking-alerts.json
- [ ] Activate Home Cooking Alerts
- [ ] Activate Home Cooking YouTube Direct Upload
- [ ] Activate Home Cooking Social Publish

## 3) Wiring

- [ ] Set YOUTUBE_PUBLISH_WEBHOOK_URL to:
  - https://<n8n-host>/webhook/home-cooking-youtube-direct
- [ ] Verify app N8N_SOCIAL_WEBHOOK_URL points to:
  - https://<n8n-host>/webhook/home-cooking-social

## 4) Platform Access Validation

- [ ] Instagram business account linked and publish permission validated
- [ ] Google OAuth refresh token valid for youtube.upload scope
- [ ] n8n SMTP credential configured (if using email alerts)

## 5) Smoke Test

- [ ] Create a published recipe from app
- [ ] Confirm recipes API response contains socialDispatch
- [ ] Confirm n8n social workflow execution is successful
- [ ] Confirm n8n YouTube direct workflow execution is successful
- [ ] Confirm Instagram post/reel appears
- [ ] Confirm YouTube video appears

## 6) Alert Test

- [ ] Trigger controlled error in n8n
- [ ] Confirm Telegram alert delivery (if enabled)
- [ ] Confirm Email alert delivery (if enabled)

## 7) Rollback Plan

- [ ] Emergency stop documented:
  - clear N8N_SOCIAL_WEBHOOK_URL in app env OR
  - deactivate Home Cooking Social Publish workflow
- [ ] Incident owner and communication channel defined

## 8) Post Go-Live Monitoring (24h)

- [ ] Check n8n failed execution count every 2-4 hours
- [ ] Review Instagram/YouTube publish success ratio
- [ ] Confirm no repeated token refresh failures

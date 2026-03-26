const APP_REQUIRED_ENV = [
  "N8N_SOCIAL_WEBHOOK_URL",
  "N8N_SOCIAL_WEBHOOK_SECRET",
  "SITE_URL",
  "SESSION_SECRET",
];

const N8N_REQUIRED_ENV = [
  "N8N_SOCIAL_WEBHOOK_SECRET",
  "IG_USER_ID",
  "IG_ACCESS_TOKEN",
  "YOUTUBE_PUBLISH_WEBHOOK_URL",
  "YOUTUBE_DIRECT_ENABLED",
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
];

const ALERT_OPTIONAL_ENV = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "ALERT_FROM_EMAIL",
  "ALERT_TO_EMAIL",
];

function hasValue(key) {
  return Boolean(String(process.env[key] || "").trim());
}

function collectStatus(keys) {
  const entries = Object.fromEntries(keys.map((key) => [key, hasValue(key)]));
  const missing = keys.filter((key) => !entries[key]);

  return {
    entries,
    missing,
    ready: missing.length === 0,
  };
}

function getStatusKey(req) {
  return String(req.headers?.["x-status-key"] || "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const env = process.env.NODE_ENV || "development";
  const configuredStatusKey = String(process.env.STATUS_API_KEY || "").trim();

  if (env === "production") {
    if (!configuredStatusKey) {
      return res.status(403).json({
        message: "Status endpoint disabled in production. Configure STATUS_API_KEY.",
      });
    }

    const requestStatusKey = getStatusKey(req);
    if (!requestStatusKey || requestStatusKey !== configuredStatusKey) {
      return res.status(401).json({ message: "Unauthorized." });
    }
  }

  const appStatus = collectStatus(APP_REQUIRED_ENV);
  const n8nStatus = collectStatus(N8N_REQUIRED_ENV);
  const alertStatus = collectStatus(ALERT_OPTIONAL_ENV);

  return res.status(200).json({
    ok: appStatus.ready && n8nStatus.ready,
    environment: env,
    checkedAt: new Date().toISOString(),
    app: appStatus,
    n8n: n8nStatus,
    alerting: {
      entries: alertStatus.entries,
      anyConfigured: Object.values(alertStatus.entries).some(Boolean),
      allConfigured: alertStatus.ready,
    },
  });
}

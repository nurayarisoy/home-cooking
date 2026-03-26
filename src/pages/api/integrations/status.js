import { getDb } from "../../../lib/db";
import { getMongoDb, isMongoConfigured } from "../../../lib/mongo";

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

function toPercent(numerator, denominator) {
  if (!denominator) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}

async function getMongoKpis() {
  const db = await getMongoDb();
  const users = db.collection("users");
  const recipes = db.collection("recipes");
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [registrationsTotal, recipesCreatedTotal, recipesPublishedTotal] = await Promise.all([
    users.countDocuments({}),
    recipes.countDocuments({}),
    recipes.countDocuments({ published: 1 }),
  ]);

  const [registrations24h, recipesCreated24h, recipesPublished24h] = await Promise.all([
    users.countDocuments({ created_at: { $gte: since } }),
    recipes.countDocuments({ created_at: { $gte: since } }),
    recipes.countDocuments({ published: 1, created_at: { $gte: since } }),
  ]);

  return {
    source: "mongo",
    totals: {
      registrations: registrationsTotal,
      recipesCreated: recipesCreatedTotal,
      recipesPublished: recipesPublishedTotal,
      publishRate: toPercent(recipesPublishedTotal, recipesCreatedTotal),
    },
    last24h: {
      registrations: registrations24h,
      recipesCreated: recipesCreated24h,
      recipesPublished: recipesPublished24h,
      publishRate: toPercent(recipesPublished24h, recipesCreated24h),
    },
  };
}

async function getSqliteKpis() {
  const db = await getDb();

  const totals = await db.get(
    `
      SELECT
        (SELECT COUNT(*) FROM users) AS registrations,
        (SELECT COUNT(*) FROM recipes) AS recipesCreated,
        (SELECT COUNT(*) FROM recipes WHERE published = 1) AS recipesPublished
    `
  );

  const last24h = await db.get(
    `
      SELECT
        (SELECT COUNT(*) FROM users WHERE datetime(created_at) >= datetime('now', '-1 day')) AS registrations,
        (SELECT COUNT(*) FROM recipes WHERE datetime(created_at) >= datetime('now', '-1 day')) AS recipesCreated,
        (SELECT COUNT(*) FROM recipes WHERE published = 1 AND datetime(created_at) >= datetime('now', '-1 day')) AS recipesPublished
    `
  );

  return {
    source: "sqlite",
    totals: {
      registrations: Number(totals?.registrations || 0),
      recipesCreated: Number(totals?.recipesCreated || 0),
      recipesPublished: Number(totals?.recipesPublished || 0),
      publishRate: toPercent(Number(totals?.recipesPublished || 0), Number(totals?.recipesCreated || 0)),
    },
    last24h: {
      registrations: Number(last24h?.registrations || 0),
      recipesCreated: Number(last24h?.recipesCreated || 0),
      recipesPublished: Number(last24h?.recipesPublished || 0),
      publishRate: toPercent(
        Number(last24h?.recipesPublished || 0),
        Number(last24h?.recipesCreated || 0)
      ),
    },
  };
}

async function getKpiMetrics() {
  try {
    return isMongoConfigured() ? await getMongoKpis() : await getSqliteKpis();
  } catch (error) {
    console.error("Integrations status KPI error:", error);
    return {
      source: "unavailable",
      error: "kpi-read-failed",
      totals: {
        registrations: 0,
        recipesCreated: 0,
        recipesPublished: 0,
        publishRate: 0,
      },
      last24h: {
        registrations: 0,
        recipesCreated: 0,
        recipesPublished: 0,
        publishRate: 0,
      },
    };
  }
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
  const metrics = await getKpiMetrics();

  return res.status(200).json({
    ok: appStatus.ready && n8nStatus.ready,
    environment: env,
    checkedAt: new Date().toISOString(),
    metrics,
    app: appStatus,
    n8n: n8nStatus,
    alerting: {
      entries: alertStatus.entries,
      anyConfigured: Object.values(alertStatus.entries).some(Boolean),
      allConfigured: alertStatus.ready,
    },
  });
}

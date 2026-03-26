const DEFAULT_PLATFORMS = ["instagram", "youtube"];

function normalizePlatforms(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_PLATFORMS;
  }

  const valid = new Set(DEFAULT_PLATFORMS);
  const normalized = [...new Set(value.map((item) => String(item || "").trim().toLowerCase()))].filter(
    (item) => valid.has(item)
  );

  return normalized.length > 0 ? normalized : DEFAULT_PLATFORMS;
}

function toAbsoluteMediaUrl(mediaUrl) {
  const raw = String(mediaUrl || "").trim();
  if (!raw || raw.startsWith("data:")) {
    return null;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  const baseUrl =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "";

  if (!baseUrl) {
    return raw;
  }

  const normalizedBase = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  return `${normalizedBase.replace(/\/$/, "")}/${raw.replace(/^\//, "")}`;
}

function buildPayload({ recipe, action, authorEmail, platforms }) {
  return {
    event: "recipe.publish",
    action,
    occurredAt: new Date().toISOString(),
    source: "home-cooking",
    platforms: normalizePlatforms(platforms),
    recipe: {
      id: recipe.id,
      title: recipe.title,
      ingredientsText: recipe.ingredientsText || "",
      instructionsText: recipe.instructionsText || "",
      mediaUrl: toAbsoluteMediaUrl(recipe.mediaUrl),
      mediaType: recipe.mediaType || null,
      authorEmail: authorEmail || null,
      published: true,
      createdAt: recipe.createdAt || null,
    },
  };
}

export async function dispatchRecipeForSocial({ recipe, action, authorEmail, platforms }) {
  const webhookUrl = String(process.env.N8N_SOCIAL_WEBHOOK_URL || "").trim();
  if (!webhookUrl) {
    return { dispatched: false, reason: "missing-webhook" };
  }

  const payload = buildPayload({ recipe, action, authorEmail, platforms });
  const webhookSecret = String(process.env.N8N_SOCIAL_WEBHOOK_SECRET || "").trim();

  const maxAttempts = 3;
  const baseDelayMs = 1000;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Webhook returned ${response.status}${body ? `: ${body}` : ""}`);
      }

      return { dispatched: true, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const waitMs = baseDelayMs * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Webhook dispatch failed.");
}

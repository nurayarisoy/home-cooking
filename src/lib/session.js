import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "hc_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(normalized + "=".repeat(padLength), "base64").toString("utf8");
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function parseCookies(cookieHeader) {
  const raw = String(cookieHeader || "");
  if (!raw) return {};

  return raw.split(";").reduce((acc, entry) => {
    const [name, ...rest] = entry.trim().split("=");
    if (!name) return acc;
    acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function createSessionToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadJson = JSON.stringify(payload);
  const encoded = base64UrlEncode(payloadJson);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

function verifySessionToken(token) {
  const [encoded, givenSignature] = String(token || "").split(".");
  if (!encoded || !givenSignature) return null;

  const expectedSignature = sign(encoded);
  const a = Buffer.from(givenSignature, "utf8");
  const b = Buffer.from(expectedSignature, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (!payload?.email || !payload?.id || !payload?.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

function buildCookie(token, maxAgeSeconds) {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

export function setSessionCookie(res, user) {
  const token = createSessionToken(user);
  res.setHeader("Set-Cookie", buildCookie(token, SESSION_TTL_SECONDS));
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", buildCookie("", 0));
}

export function getSessionUserFromRequest(req) {
  const cookies = parseCookies(req.headers?.cookie);
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  return verifySessionToken(token);
}

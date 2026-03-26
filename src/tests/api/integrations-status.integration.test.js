function createMockReqRes({ method = "GET", headers = {} } = {}) {
  const req = {
    method,
    headers,
  };

  const res = {
    statusCode: 200,
    jsonBody: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonBody = payload;
      return this;
    },
  };

  return { req, res };
}

describe("Integrations status API", () => {
  let statusHandler;

  const originalEnv = {
    NODE_ENV: process.env.NODE_ENV,
    STATUS_API_KEY: process.env.STATUS_API_KEY,
    N8N_SOCIAL_WEBHOOK_URL: process.env.N8N_SOCIAL_WEBHOOK_URL,
    N8N_SOCIAL_WEBHOOK_SECRET: process.env.N8N_SOCIAL_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    IG_USER_ID: process.env.IG_USER_ID,
    IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
    YOUTUBE_PUBLISH_WEBHOOK_URL: process.env.YOUTUBE_PUBLISH_WEBHOOK_URL,
    YOUTUBE_DIRECT_ENABLED: process.env.YOUTUBE_DIRECT_ENABLED,
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN,
  };

  beforeAll(async () => {
    ({ default: statusHandler } = await import("../../pages/api/integrations/status"));
  });

  afterAll(() => {
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  });

  test("returns readiness in development without auth key", async () => {
    process.env.NODE_ENV = "development";
    process.env.STATUS_API_KEY = "";
    process.env.N8N_SOCIAL_WEBHOOK_URL = "https://example.com/webhook";
    process.env.N8N_SOCIAL_WEBHOOK_SECRET = "secret";
    process.env.SITE_URL = "https://example.com";
    process.env.SESSION_SECRET = "session-secret";
    process.env.IG_USER_ID = "123";
    process.env.IG_ACCESS_TOKEN = "token";
    process.env.YOUTUBE_PUBLISH_WEBHOOK_URL = "https://example.com/yt";
    process.env.YOUTUBE_DIRECT_ENABLED = "true";
    process.env.YOUTUBE_CLIENT_ID = "cid";
    process.env.YOUTUBE_CLIENT_SECRET = "csecret";
    process.env.YOUTUBE_REFRESH_TOKEN = "refresh";

    const { req, res } = createMockReqRes({ method: "GET" });
    await statusHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody?.ok).toBe(true);
    expect(res.jsonBody?.app?.ready).toBe(true);
    expect(res.jsonBody?.n8n?.ready).toBe(true);
  });

  test("blocks production request when STATUS_API_KEY is configured and missing from request", async () => {
    process.env.NODE_ENV = "production";
    process.env.STATUS_API_KEY = "top-secret-key";

    const { req, res } = createMockReqRes({ method: "GET" });
    await statusHandler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.jsonBody).toEqual({ message: "Unauthorized." });
  });

  test("allows production request with matching x-status-key", async () => {
    process.env.NODE_ENV = "production";
    process.env.STATUS_API_KEY = "top-secret-key";

    const { req, res } = createMockReqRes({
      method: "GET",
      headers: { "x-status-key": "top-secret-key" },
    });

    await statusHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(typeof res.jsonBody?.checkedAt).toBe("string");
    expect(res.jsonBody?.environment).toBe("production");
  });
});

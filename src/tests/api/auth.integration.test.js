import fs from "node:fs";
import path from "node:path";

function createMockReqRes({ method = "GET", body = {}, headers = {} } = {}) {
  const req = {
    method,
    body,
    headers,
  };

  const res = {
    statusCode: 200,
    headers: {},
    jsonBody: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonBody = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    getHeader(name) {
      return this.headers[name];
    },
  };

  return { req, res };
}

describe("Auth API integration", () => {
  let dbPath;
  let registerHandler;
  let loginHandler;

  beforeAll(async () => {
    dbPath = path.join(process.cwd(), "database", `test-auth-${Date.now()}.db`);

    process.env.DATABASE_PATH = dbPath;
    process.env.MONGODB_URI = "";
    process.env.NODE_ENV = "test";

    ({ default: registerHandler } = await import("../../pages/api/register"));
    ({ default: loginHandler } = await import("../../pages/api/login"));
  });

  afterAll(async () => {
    const { getDb } = await import("../../lib/db");
    const db = await getDb();
    await db.close();

    if (fs.existsSync(dbPath)) {
      fs.rmSync(dbPath, { force: true });
    }

    delete process.env.DATABASE_PATH;
    delete process.env.MONGODB_URI;
  });

  test("registers a user and allows login", async () => {
    const registerInput = {
      username: "test-user",
      email: "test@example.com",
      password: "supersecret123",
      location: {
        latitude: 41.0082,
        longitude: 28.9784,
      },
    };

    const { req: registerReq, res: registerRes } = createMockReqRes({
      method: "POST",
      body: registerInput,
    });

    await registerHandler(registerReq, registerRes);

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.jsonBody).toEqual({ message: "Registration successful." });

    const { req: loginReq, res: loginRes } = createMockReqRes({
      method: "POST",
      body: {
        email: registerInput.email,
        password: registerInput.password,
      },
    });

    await loginHandler(loginReq, loginRes);

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.jsonBody?.message).toBe("Login successful.");
    expect(loginRes.jsonBody?.user?.email).toBe(registerInput.email);
    expect(loginRes.getHeader("Set-Cookie")).toEqual(expect.stringContaining("hc_session="));
  });

  test("rejects duplicate registration and invalid login", async () => {
    const duplicateInput = {
      username: "test-user-2",
      email: "test@example.com",
      password: "another-secret123",
    };

    const { req: duplicateReq, res: duplicateRes } = createMockReqRes({
      method: "POST",
      body: duplicateInput,
    });

    await registerHandler(duplicateReq, duplicateRes);

    expect(duplicateRes.statusCode).toBe(409);
    expect(duplicateRes.jsonBody).toEqual({ message: "User already exists with this email." });

    const { req: invalidLoginReq, res: invalidLoginRes } = createMockReqRes({
      method: "POST",
      body: {
        email: duplicateInput.email,
        password: "wrong-password",
      },
    });

    await loginHandler(invalidLoginReq, invalidLoginRes);

    expect(invalidLoginRes.statusCode).toBe(401);
    expect(invalidLoginRes.jsonBody).toEqual({ message: "Invalid email or password." });
  });
});

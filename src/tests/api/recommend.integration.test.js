function createMockReqRes({ method = "GET", body = {} } = {}) {
  const req = {
    method,
    body,
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

describe("AI Recommend API integration", () => {
  let recommendHandler;

  beforeAll(async () => {
    ({ default: recommendHandler } = await import("../../pages/api/ai/recommend"));
  });

  test("returns vegetarian and high-protein flavored recipe with serving-aware suggestion", async () => {
    const { req, res } = createMockReqRes({
      method: "POST",
      body: {
        ingredients: ["tomato", "onion"],
        preferences: {
          diets: ["vegetarian", "high-protein"],
          servings: 4,
        },
      },
    });

    await recommendHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody?.recipe?.name).toContain("Garden Protein");
    expect(res.jsonBody?.suggestion).toContain("4-serving");
    expect(res.jsonBody?.recipe?.ingredients).toEqual(
      expect.arrayContaining(["fresh herbs", "chickpeas", "extra onion"])
    );
  });

  test("clamps servings to max and applies quick-meal cooking time", async () => {
    const { req, res } = createMockReqRes({
      method: "POST",
      body: {
        ingredients: ["egg", "garlic"],
        preferences: {
          diets: ["quick-meal"],
          servings: 99,
        },
      },
    });

    await recommendHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody?.suggestion).toContain("6-serving");
    expect(res.jsonBody?.recipe?.instructions).toContain("8-10");
  });

  test("returns 400 for empty ingredient input", async () => {
    const { req, res } = createMockReqRes({
      method: "POST",
      body: {
        ingredients: [],
      },
    });

    await recommendHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.jsonBody).toEqual({ message: "Please provide at least one ingredient." });
  });

  test("excludes avoided ingredients from generated recipe", async () => {
    const { req, res } = createMockReqRes({
      method: "POST",
      body: {
        ingredients: ["egg", "garlic", "mushroom"],
        preferences: {
          diets: ["high-protein"],
          servings: 2,
          avoids: ["chickpeas", "mushroom"],
        },
      },
    });

    await recommendHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody?.suggestion).toContain("without chickpeas, mushroom");
    expect(res.jsonBody?.recipe?.ingredients).not.toEqual(
      expect.arrayContaining(["chickpeas", "mushroom"])
    );
  });
});

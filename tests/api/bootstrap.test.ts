import { api } from "./helpers";

describe("GET /bootstrap", () => {
  it("returns 200 and site payload", async () => {
    const res = await api().get("/bootstrap").expect("Content-Type", /json/);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("settings");
    expect(res.body.data).toHaveProperty("posts");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
  });
});

describe("GET /posts", () => {
  it("returns published posts list", async () => {
    const res = await api().get("/posts").expect(200);

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /ai/status", () => {
  it("returns AI status object", async () => {
    const res = await api().get("/ai/status").expect(200);

    expect(res.body.data).toMatchObject({
      enabled: expect.any(Boolean),
    });
  });
});

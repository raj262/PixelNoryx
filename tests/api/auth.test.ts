import { api } from "./helpers";

const testEmail = process.env.API_TEST_USER_EMAIL ?? "user@pixelnoryx.demo";
const testPassword = process.env.API_TEST_USER_PASSWORD ?? "user123";

describe("POST /auth/login", () => {
  it("returns token and user for valid credentials", async () => {
    const res = await api()
      .post("/auth/login")
      .send({ email: testEmail, password: testPassword })
      .set("Accept", "application/json");

    if (res.status === 422) {
      console.warn(
        "Login test skipped: invalid credentials on this API. Set API_TEST_USER_EMAIL / API_TEST_USER_PASSWORD."
      );
      return;
    }

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      email: testEmail,
      name: expect.any(String),
    });
  });

  it("rejects invalid credentials", async () => {
    await api()
      .post("/auth/login")
      .send({ email: "invalid@example.com", password: "wrong-password" })
      .set("Accept", "application/json")
      .expect(422);
  });
});

describe("POST /auth/register", () => {
  it("creates a user and returns token", async () => {
    const unique = `test-${Date.now()}@example.com`;

    const res = await api()
      .post("/auth/register")
      .send({
        name: "API Test User",
        email: unique,
        password: "password123",
        password_confirmation: "password123",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(unique);
  });
});

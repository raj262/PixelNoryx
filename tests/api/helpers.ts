import request from "supertest";

/** Laravel API base (includes /api/v1). */
export function getApiTestBaseUrl(): string {
  const raw =
    process.env.API_TEST_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://admin.rajeshcodes.in/api/v1";
  return raw.replace(/\/$/, "");
}

export function api() {
  return request(getApiTestBaseUrl());
}

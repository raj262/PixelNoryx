import { getApiBaseUrl } from "@/lib/api-config";

describe("getApiBaseUrl", () => {
  const original = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = original;
    }
  });

  it("strips trailing slash", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://admin.rajeshcodes.in/api/v1/";
    expect(getApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });

  it("uses env when set", () => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:8001/api/v1";
    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8001/api/v1");
  });
});

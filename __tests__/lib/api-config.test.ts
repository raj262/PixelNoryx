import {
  getApiBaseUrl,
  getServerApiBaseUrl,
  shouldUseApiProxy,
} from "@/lib/api-config";

describe("getServerApiBaseUrl", () => {
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
    expect(getServerApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });

  it("uses env when set", () => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:8001/api/v1";
    expect(getServerApiBaseUrl()).toBe("http://127.0.0.1:8001/api/v1");
  });

  it("defaults to production admin API", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getServerApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });
});

describe("shouldUseApiProxy", () => {
  const originalProxy = process.env.NEXT_PUBLIC_USE_API_PROXY;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
  });

  it("is false by default", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    expect(shouldUseApiProxy()).toBe(false);
  });

  it("is true when explicitly enabled", () => {
    process.env.NEXT_PUBLIC_USE_API_PROXY = "true";
    expect(shouldUseApiProxy()).toBe(true);
  });

  it("is false when explicitly disabled", () => {
    process.env.NEXT_PUBLIC_USE_API_PROXY = "false";
    expect(shouldUseApiProxy()).toBe(false);
  });
});

describe("getApiBaseUrl", () => {
  const originalProxy = process.env.NEXT_PUBLIC_USE_API_PROXY;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
  });

  it("uses direct API URL by default", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    process.env.NEXT_PUBLIC_API_URL = "https://admin.rajeshcodes.in/api/v1";
    expect(getApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });

  it("uses proxy when enabled", () => {
    process.env.NEXT_PUBLIC_USE_API_PROXY = "true";
    expect(getApiBaseUrl()).toBe("/api-proxy/v1");
  });
});

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
});

describe("shouldUseApiProxy", () => {
  const originalProxy = process.env.NEXT_PUBLIC_USE_API_PROXY;
  const originalVercel = process.env.VERCEL;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }
  });

  it("is true on Vercel when env not set", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    process.env.VERCEL = "1";
    expect(shouldUseApiProxy()).toBe(true);
  });

  it("is false when explicitly disabled", () => {
    process.env.NEXT_PUBLIC_USE_API_PROXY = "false";
    process.env.VERCEL = "1";
    expect(shouldUseApiProxy()).toBe(false);
  });
});

describe("getApiBaseUrl", () => {
  const originalProxy = process.env.NEXT_PUBLIC_USE_API_PROXY;
  const originalVercel = process.env.VERCEL;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }
  });

  it("uses server URL when proxy is off", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    delete process.env.VERCEL;
    process.env.NEXT_PUBLIC_API_URL = "https://admin.rajeshcodes.in/api/v1";
    expect(getApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });
});

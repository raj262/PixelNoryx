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
  const originalApi = process.env.NEXT_PUBLIC_API_URL;
  const originalWindow = global.window;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
    if (originalApi === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApi;
    }
    Object.defineProperty(global, "window", {
      value: originalWindow,
      configurable: true,
    });
  });

  it("is false on the server by default", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    Object.defineProperty(global, "window", { value: undefined, configurable: true });
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

  it("auto-enables in the browser when API host differs from page", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    process.env.NEXT_PUBLIC_API_URL = "https://admin.rajeshcodes.in/api/v1";

    const originalWindow = global.window;
    Object.defineProperty(global, "window", {
      value: { location: { host: "www.pixelnoryx.com" } },
      configurable: true,
    });

    expect(shouldUseApiProxy()).toBe(true);

    Object.defineProperty(global, "window", {
      value: originalWindow,
      configurable: true,
    });
  });
});

describe("getApiBaseUrl", () => {
  const originalProxy = process.env.NEXT_PUBLIC_USE_API_PROXY;
  const originalWindow = global.window;

  afterEach(() => {
    if (originalProxy === undefined) {
      delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    } else {
      process.env.NEXT_PUBLIC_USE_API_PROXY = originalProxy;
    }
    Object.defineProperty(global, "window", {
      value: originalWindow,
      configurable: true,
    });
  });

  it("uses direct API URL on the server by default", () => {
    delete process.env.NEXT_PUBLIC_USE_API_PROXY;
    process.env.NEXT_PUBLIC_API_URL = "https://admin.rajeshcodes.in/api/v1";
    Object.defineProperty(global, "window", { value: undefined, configurable: true });
    expect(getApiBaseUrl()).toBe("https://admin.rajeshcodes.in/api/v1");
  });

  it("uses proxy when enabled", () => {
    process.env.NEXT_PUBLIC_USE_API_PROXY = "true";
    expect(getApiBaseUrl()).toBe("/api-proxy/v1");
  });
});

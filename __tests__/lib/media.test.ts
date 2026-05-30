import { normalizeMediaUrl, toStoragePath } from "@/lib/media";

describe("toStoragePath", () => {
  it("keeps /storage paths", () => {
    expect(toStoragePath("/storage/posts/a.png")).toBe("/storage/posts/a.png");
  });

  it("extracts path from localhost URL", () => {
    expect(
      toStoragePath("http://127.0.0.1:8001/storage/posts/01KSX.png")
    ).toBe("/storage/posts/01KSX.png");
  });

  it("extracts path from production admin URL", () => {
    expect(
      toStoragePath("https://admin.rajeshcodes.in/storage/posts/01KSX.png")
    ).toBe("/storage/posts/01KSX.png");
  });
});

describe("normalizeMediaUrl", () => {
  it("rewrites localhost storage to same-origin path", () => {
    expect(
      normalizeMediaUrl(
        "http://127.0.0.1:8001/storage/posts/01KSX38T4WYW0T7X060F7VKT4Z.png"
      )
    ).toBe("/storage/posts/01KSX38T4WYW0T7X060F7VKT4Z.png");
  });

  it("leaves external CDN URLs unchanged", () => {
    const url =
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80";
    expect(normalizeMediaUrl(url)).toBe(url);
  });
});

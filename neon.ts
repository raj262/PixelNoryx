import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: false,
  buckets: {
    // Private uploads (admin-only via presigned URLs)
    assets: { access: "private" },
    // Public media for post images / OG assets
    media: { access: "public_read" },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});

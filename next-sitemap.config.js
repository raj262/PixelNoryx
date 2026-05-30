/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pixelnoryx.com").replace(
    /\/$/,
    ""
  ),
  generateRobotsTxt: true,
  exclude: ["/account", "/login", "/register"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/account", "/login", "/register"] },
    ],
  },
  additionalPaths: async () => {
    const paths = [{ loc: "/features", changefreq: "monthly", priority: 0.7 }];

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL || "https://admin.rajeshcodes.in/api/v1"
    ).replace(/\/$/, "");

    try {
      const postsRes = await fetch(`${apiBase}/posts?per_page=100`, {
        signal: AbortSignal.timeout(15000),
      });

      if (postsRes.ok) {
        const { data: posts } = await postsRes.json();

        for (const post of posts ?? []) {
          if (!post?.slug) continue;

          paths.push({
            loc: `/archive/${post.slug}`,
            changefreq: "weekly",
            priority: 0.8,
          });
        }
      }

      const bootstrapRes = await fetch(`${apiBase}/bootstrap`, {
        signal: AbortSignal.timeout(15000),
      });

      if (bootstrapRes.ok) {
        const { data } = await bootstrapRes.json();

        for (const topic of data?.topics ?? []) {
          paths.push({
            loc: `/archive?topic=${encodeURIComponent(topic)}`,
            changefreq: "weekly",
            priority: 0.6,
          });
        }
      }
    } catch (error) {
      console.warn("[next-sitemap] Could not fetch API paths:", error);
    }

    return paths;
  },
};

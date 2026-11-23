import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@pixelnoryx.com" },
    update: { passwordHash, role: "ADMIN", name: "Admin" },
    create: {
      name: "Admin",
      email: "admin@pixelnoryx.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@pixelnoryx.com" },
    update: {},
    create: {
      name: "Editor",
      email: "editor@pixelnoryx.com",
      passwordHash: await bcrypt.hash("editor123", 10),
      role: "EDITOR",
    },
  });

  await prisma.seoSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteUrl: "https://www.pixelnoryx.com",
      googleSiteVerification: "GX6_Nac8vltJ3Q-SCQntnHtu2XeEnvmuKX6dIC5eUBE",
    },
  });

  const sample = await prisma.post.findUnique({
    where: { slug: "laravel-queues-production-guide" },
  });

  if (!sample) {
    await prisma.post.create({
      data: {
        issueNumber: 44,
        slug: "laravel-queues-production-guide",
        title: "Laravel Queues in Production: Retries, Timeouts, and Failed Jobs",
        excerpt:
          "A practical guide to queue workers, retry budgets, timeout tuning, and dead-letter handling so background jobs stay reliable under real traffic.",
        preview:
          "Your jobs work on localhost. Production is where retries, timeouts, and failed-job tables decide whether customers get emails — or silence.",
        content:
          "<p>Seed post — replace with full HTML from the admin editor. Use meta fields for SEO.</p>",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
        topic: "Laravel",
        tags: JSON.stringify(["Laravel", "Queues", "DevOps", "PHP"]),
        readTime: "9 min read",
        status: "PUBLISHED",
        featured: true,
        publishedAt: new Date("2026-11-18"),
        metaTitle: "Laravel Queues in Production: Retries, Timeouts & Failed Jobs",
        metaDescription:
          "Ship reliable Laravel queue workers: retry budgets, timeout settings, failed jobs, Horizon tips, and a production checklist.",
        metaKeywords: "Laravel queues, failed jobs, Horizon, PHP background jobs",
        robots: "index, follow",
        authorId: admin.id,
      },
    });
  }

  console.log("Seeded admin@pixelnoryx.com / admin123");
  console.log("Seeded editor@pixelnoryx.com / editor123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

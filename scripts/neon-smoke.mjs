import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const posts = await prisma.post.count();
  const admin = await prisma.user.findUnique({
    where: { email: "admin@pixelnoryx.com" },
    select: { email: true, role: true },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: "postgresql",
        users,
        posts,
        admin,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(JSON.stringify({ ok: false, error: String(err) }, null, 2));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

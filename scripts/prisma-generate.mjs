import { spawnSync } from "node:child_process";

/** Prisma generate reads schema env() keys; it does not need a live DB. */
if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?sslmode=disable";
  console.warn(
    "[prisma-generate] DATABASE_URL missing — using build placeholder. Set real Neon URL on Vercel for runtime."
  );
}

if (!process.env.DIRECT_URL?.trim()) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
  console.warn(
    "[prisma-generate] DIRECT_URL missing — mirroring DATABASE_URL for generate."
  );
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isStorageConfigured, probeStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: {
    ok: boolean;
    postgres?: { ok: boolean; users?: number; posts?: number; error?: string };
    storage?: Awaited<ReturnType<typeof probeStorage>> | { ok: false; configured: boolean; message: string };
  } = { ok: false };

  try {
    const [users, posts] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
    ]);
    result.postgres = { ok: true, users, posts };
  } catch (err) {
    result.postgres = {
      ok: false,
      error: err instanceof Error ? err.message : "Postgres probe failed",
    };
  }

  try {
    result.storage = await probeStorage();
  } catch (err) {
    result.storage = {
      ok: false,
      configured: isStorageConfigured(),
      message: err instanceof Error ? err.message : "Storage probe failed",
    };
  }

  result.ok = Boolean(result.postgres?.ok) && Boolean(result.storage && "ok" in result.storage && result.storage.ok);

  return NextResponse.json(result, {
    status: result.postgres?.ok ? 200 : 503,
  });
}

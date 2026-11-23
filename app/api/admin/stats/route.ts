import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  const [posts, published, drafts, users] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.user.count(),
  ]);

  return NextResponse.json({
    data: { posts, published, drafts, users, role: session.role },
  });
}

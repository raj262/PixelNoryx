import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canManagePosts, requireAdminApi } from "@/lib/admin-auth";
import { normalizePostInput, toPostDto, type PostInput } from "@/lib/admin-posts";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  const { id } = await ctx.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ data: toPostDto(post) });
}

export async function PUT(req: Request, ctx: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;
  if (!canManagePosts(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  try {
    const body = (await req.json()) as Partial<PostInput>;
    const data = normalizePostInput(body);

    const clash = await prisma.post.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (clash) {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }

    const post = await prisma.post.update({ where: { id }, data });
    return NextResponse.json({ data: toPostDto(post) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update post.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;
  if (!canManagePosts(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

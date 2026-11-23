import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canManagePosts, requireAdminApi } from "@/lib/admin-auth";
import { normalizePostInput, toPostDto, type PostInput } from "@/lib/admin-posts";

export async function GET() {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;

  const posts = await prisma.post.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json({ data: posts.map(toPostDto) });
}

export async function POST(req: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error!;
  if (!canManagePosts(session.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await req.json()) as Partial<PostInput>;
    const data = normalizePostInput(body);

    const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: session.id,
      },
    });

    return NextResponse.json({ data: toPostDto(post) }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create post.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

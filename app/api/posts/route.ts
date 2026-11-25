import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/public-posts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") ?? undefined;
  const posts = await getPublishedPosts(topic || undefined);

  return NextResponse.json({
    data: posts,
    meta: { total: posts.length },
  });
}

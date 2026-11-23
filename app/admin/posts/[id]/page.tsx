import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/admin-posts";
import PostForm from "@/components/admin/PostForm";
import DeletePostButton from "@/components/admin/DeletePostButton";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditPostPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Edit post</h1>
          <p className="mt-1 text-muted">/{post.slug}</p>
        </div>
        <DeletePostButton id={post.id} />
      </div>
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          preview: post.preview,
          content: post.content,
          image: post.image,
          topic: post.topic,
          tags: parseTags(post.tags),
          readTime: post.readTime,
          status: post.status,
          featured: post.featured,
          free: post.free,
          sponsored: post.sponsored,
          issueNumber: post.issueNumber?.toString() ?? "",
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          metaKeywords: post.metaKeywords ?? "",
          ogImage: post.ogImage ?? "",
          canonicalUrl: post.canonicalUrl ?? "",
          robots: post.robots,
        }}
      />
    </div>
  );
}

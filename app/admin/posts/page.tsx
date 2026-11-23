import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export default async function AdminPostsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Posts</h1>
          <p className="mt-1 text-muted">Create, edit, publish — with per-post SEO.</p>
        </div>
        <Link href="/admin/posts/new" className="btn-modern !px-5 !py-2.5 text-xs">
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border/70 bg-surface/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-bold">Title</th>
              <th className="px-4 py-3 font-bold">Topic</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">SEO</th>
              <th className="px-4 py-3 font-bold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-xs text-muted">/{post.slug}</p>
                </td>
                <td className="px-4 py-3">{post.topic}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      post.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {post.metaTitle || post.metaDescription ? "Set" : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-bold text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

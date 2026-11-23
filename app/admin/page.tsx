import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [posts, published, drafts, users] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.user.count(),
  ]);

  const recent = await prisma.post.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, status: true, slug: true, updatedAt: true },
  });

  const cards = [
    { label: "Total posts", value: posts },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Users", value: users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted">
          Welcome back, {session.name}. Manage content and SEO from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border/80 bg-white p-5 shadow-card"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Recent posts</h2>
          <Link href="/admin/posts/new" className="btn-modern !px-5 !py-2 text-xs">
            New post
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border/70">
          {recent.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-muted">/{post.slug}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  post.status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {post.status}
              </span>
            </li>
          ))}
          {recent.length === 0 ? (
            <li className="py-6 text-sm text-muted">No posts yet. Create your first article.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

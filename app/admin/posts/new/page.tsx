import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import PostForm from "@/components/admin/PostForm";

export default async function AdminNewPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">New post</h1>
        <p className="mt-1 text-muted">Write content and fill SEO before publishing.</p>
      </div>
      <PostForm />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import UsersManager from "@/components/admin/UsersManager";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Users & roles</h1>
        <p className="mt-1 text-muted">
          ADMIN = full access · EDITOR = posts + SEO · USER = no admin panel
        </p>
      </div>
      <UsersManager initial={users} currentUserId={session.id} />
    </div>
  );
}

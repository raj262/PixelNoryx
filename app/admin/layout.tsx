import { getAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Login page renders without shell
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
};

export default function UsersManager({
  initial,
  currentUserId,
}: {
  initial: Row[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [error, setError] = useState("");

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const json = (await res.json()) as { message?: string; data?: Row };
    if (!res.ok) {
      setError(json.message ?? "Failed");
      return;
    }
    if (json.data) setUsers((prev) => [json.data!, ...prev]);
    setName("");
    setEmail("");
    setPassword("");
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    }
  }

  async function onRoleChange(id: string, nextRole: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u)));
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-2xl border border-border/80 bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          className="admin-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="admin-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="admin-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <select
          className="admin-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="EDITOR">EDITOR</option>
          <option value="USER">USER</option>
        </select>
        <button type="submit" className="btn-modern !px-4 !py-3 text-xs">
          Add user
        </button>
        {error ? (
          <p className="sm:col-span-2 lg:col-span-5 text-sm font-medium text-primary">{error}</p>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border/70 bg-surface/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-bold">User</th>
              <th className="px-4 py-3 font-bold">Role</th>
              <th className="px-4 py-3 font-bold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="admin-input !py-2"
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    disabled={user.id === currentUserId}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="USER">USER</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  {user.id !== currentUserId ? (
                    <button
                      type="button"
                      onClick={() => onDelete(user.id)}
                      className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-xs text-muted">You</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

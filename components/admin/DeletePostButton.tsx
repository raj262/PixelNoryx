"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this post permanently?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-full border border-primary/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}

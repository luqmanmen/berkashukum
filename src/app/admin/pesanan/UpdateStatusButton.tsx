"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStatusButton({
  id,
  targetStatus,
  label
}: {
  id: string;
  currentStatus: string;
  targetStatus: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!confirm(`Tandai pesanan ini sebagai ${targetStatus}?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pesanan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });

      if (!res.ok) throw new Error("Gagal update status");

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className="text-green-600 hover:text-green-800 font-medium text-xs disabled:opacity-50"
    >
      {loading ? "Menyimpan..." : label}
    </button>
  );
}

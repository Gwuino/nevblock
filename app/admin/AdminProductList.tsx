"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

type CategoryKey = keyof typeof CATEGORY_LABELS;

export function AdminProductList({
  products,
  categoryLabels,
}: {
  products: Product[];
  categoryLabels: Record<CategoryKey, string>;
}) {
  const [filter, setFilter] = useState<CategoryKey | "">("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered =
    filter === ""
      ? products
      : products.filter((p) => p.category === filter);

  async function handleDelete(id: string) {
    if (!confirm("Удалить товар?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Ошибка удаления");
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Категория
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as CategoryKey | "")}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Все</option>
          {(Object.keys(categoryLabels) as CategoryKey[]).map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-3 sm:py-2 rounded-lg bg-gray-50 border border-[var(--nevblock-gray)]"
          >
            <div className="min-w-0">
              <span className="font-medium block sm:inline">{p.name}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                {categoryLabels[p.category]} · {p.price != null ? `${p.price} ₽/${p.unit}` : "по запросу"}
              </span>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href={`/admin/products/${p.id}`}
                className="text-sm text-[var(--nevblock-blue)] hover:underline min-h-[44px] inline-flex items-center"
              >
                Редактировать
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                disabled={deleting === p.id}
                className="text-sm text-red-600 hover:underline disabled:opacity-50 min-h-[44px] inline-flex items-center py-0"
              >
                {deleting === p.id ? "…" : "Удалить"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

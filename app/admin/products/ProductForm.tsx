"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, CategoryKey } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: Record<string, string>;
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<CategoryKey>(product?.category ?? "fbs");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product?.price != null ? String(product.price) : ""
  );
  const [unit, setUnit] = useState(product?.unit ?? "шт");
  const [order, setOrder] = useState(product?.order ?? 0);
  const [image, setImage] = useState(product?.image ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isNew = !product?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = {
        name,
        category,
        description: description || undefined,
        price: price === "" ? null : Number(price),
        unit,
        order: Number(order),
        image: image || undefined,
      };
      if (isNew) {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Ошибка сохранения");
          return;
        }
        router.push("/admin");
        router.refresh();
      } else {
        const res = await fetch(`/api/products/${product!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Ошибка сохранения");
          return;
        }
        router.push("/admin");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Категория *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryKey)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {Object.entries(categories).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Фото (URL или загрузить файл)
        </label>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/products/photo.jpg или https://..."
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2"
          />
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-700">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const form = new FormData();
                  form.append("file", file);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: form,
                  });
                  const data = await res.json().catch(() => ({}));
                  if (res.ok && data.url) setImage(data.url);
                  else setError(data.error ?? "Ошибка загрузки");
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />
            {uploading ? "Загрузка…" : "Загрузить"}
          </label>
        </div>
        {image && (
          <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Цена (пусто = по запросу)
        </label>
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Единица измерения
        </label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="шт, м³, рейс"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Порядок
        </label>
        <input
          type="number"
          min="0"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[var(--nevblock-blue)] text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

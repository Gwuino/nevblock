import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { CATEGORY_LABELS } from "@/lib/types";
import { AdminProductList } from "./AdminProductList";

export const dynamic = 'force-dynamic';

export default async function ManagePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories().catch(() => []),
  ]);
  const categoryLabels: Record<string, string> =
    categories.length > 0
      ? Object.fromEntries(categories.map((c) => [c.key, c.label]))
      : { ...CATEGORY_LABELS };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--nevblock-blue)]">
          Товары
        </h1>
        <Link
          href="/manage/products/new"
          className="px-4 py-2 bg-[var(--nevblock-blue)] text-white font-medium rounded-lg hover:opacity-90"
        >
          Добавить товар
        </Link>
      </div>
      <AdminProductList
        products={products}
        categoryLabels={categoryLabels}
      />
    </>
  );
}

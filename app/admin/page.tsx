import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";
import { AdminProductList } from "./AdminProductList";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await getProducts();
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--nevblock-blue)]">
          Товары
        </h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[var(--nevblock-blue)] text-white font-medium rounded-lg hover:opacity-90"
        >
          Добавить товар
        </Link>
      </div>
      <AdminProductList
        products={products}
        categoryLabels={CATEGORY_LABELS}
      />
    </>
  );
}

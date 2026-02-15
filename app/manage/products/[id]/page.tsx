import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { CATEGORY_LABELS } from "@/lib/types";
import { ProductForm } from "../ProductForm";

export default async function ManageProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const [products, categories] = await Promise.all([
    isNew ? Promise.resolve([]) : getProducts(),
    getCategories().catch(() => []),
  ]);
  const categoryLabels: Record<string, string> =
    categories.length > 0
      ? Object.fromEntries(categories.map((c) => [c.key, c.label]))
      : { ...CATEGORY_LABELS };
  let product = null;
  if (!isNew) {
    product = products.find((p) => p.id === id);
    if (!product) notFound();
  }
  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--nevblock-blue)] mb-6">
        {isNew ? "Добавить товар" : "Редактировать товар"}
      </h1>
      <ProductForm
        product={product}
        categories={categoryLabels}
      />
    </div>
  );
}

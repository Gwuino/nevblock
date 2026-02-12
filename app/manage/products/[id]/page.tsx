import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";
import { ProductForm } from "../ProductForm";

type CategoryKey = keyof typeof CATEGORY_LABELS;

export default async function ManageProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let product = null;
  if (!isNew) {
    const products = await getProducts();
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
        categories={CATEGORY_LABELS as Record<string, string>}
      />
    </div>
  );
}

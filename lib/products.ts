import type { Product } from "./types";
import * as djangoAPI from "./django-api";

/**
 * Преобразует Django Product в формат фронтенда
 */
function adaptDjangoProduct(djangoProduct: djangoAPI.DjangoProduct): Product {
  return {
    id: String(djangoProduct.id),
    category: djangoProduct.category.key as Product["category"],
    name: djangoProduct.name,
    description: djangoProduct.description,
    price: djangoProduct.price,
    unit: djangoProduct.unit,
    order: djangoProduct.order,
    image: djangoProduct.image,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const djangoProducts = await djangoAPI.getProducts();
    return djangoProducts.map(adaptDjangoProduct).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Failed to fetch products from Django API:", error);
    // Fallback: возвращаем пустой массив или можно пробросить ошибку
    throw error;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  // Эта функция больше не используется напрямую, так как сохранение идет через API routes
  // Но оставляем для обратной совместимости
  throw new Error("saveProducts should be called through API routes");
}

export function getNextId(products: Product[]): string {
  const ids = products.map((p) => parseInt(p.id, 10)).filter((n) => !Number.isNaN(n));
  return String((ids.length ? Math.max(...ids) : 0) + 1);
}

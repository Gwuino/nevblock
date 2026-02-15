import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { requireAuth } from "@/lib/auth";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Product } from "@/lib/types";
import * as djangoAPI from "@/lib/django-api";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ok = await requireAuth();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, category, description, price, unit, order, image } = body;
    if (!name || !category) {
      return NextResponse.json(
        { error: "name and category are required" },
        { status: 400 }
      );
    }
    const validCategories = Object.keys(CATEGORY_LABELS) as Product["category"][];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Получаем категорию по key
    const djangoCategory = await djangoAPI.getCategoryByKey(category);
    
    // Создаем товар через Django API
    const djangoProduct = await djangoAPI.createProduct({
      category_id: djangoCategory.id,
      name: String(name),
      description: description != null ? String(description) : undefined,
      price: price != null && price !== "" ? String(price) : null,
      unit: unit ?? "шт",
      order: typeof order === "number" ? order : undefined,
      image: image ? String(image) : undefined,
    });

    // Преобразуем в формат фронтенда
    const product: Product = {
      id: String(djangoProduct.id),
      category: djangoProduct.category.key as Product["category"],
      name: djangoProduct.name,
      description: djangoProduct.description,
      price: djangoProduct.price,
      unit: djangoProduct.unit,
      order: djangoProduct.order,
      image: djangoProduct.image,
    };

    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

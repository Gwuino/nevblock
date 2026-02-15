import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import * as djangoAPI from "@/lib/django-api";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await requireAuth();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, category, description, price, unit, order, image } = body;

    // Получаем текущий товар
    let djangoProduct: djangoAPI.DjangoProduct;
    try {
      djangoProduct = await djangoAPI.getProduct(id);
    } catch (e) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Подготавливаем данные для обновления
    const updateData: Partial<djangoAPI.DjangoProduct> = {};
    if (name != null) updateData.name = String(name);
    if (category != null) {
      const validCategories = Object.keys(CATEGORY_LABELS) as Product["category"][];
      if (!validCategories.includes(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      const djangoCategory = await djangoAPI.getCategoryByKey(category);
      (updateData as any).category_id = djangoCategory.id;
    }
    if (description !== undefined) updateData.description = description ? String(description) : undefined;
    if (price !== undefined) updateData.price = price != null && price !== "" ? String(price) : null;
    if (unit != null) updateData.unit = String(unit);
    if (order !== undefined) updateData.order = Number(order);
    if (image !== undefined) updateData.image = image ? String(image) : undefined;

    // Обновляем через Django API
    const updatedProduct = await djangoAPI.updateProduct(id, updateData);

    // Преобразуем в формат фронтенда
    const product: Product = {
      id: String(updatedProduct.id),
      category: updatedProduct.category.key as Product["category"],
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      unit: updatedProduct.unit,
      order: updatedProduct.order,
      image: updatedProduct.image,
    };

    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await requireAuth();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await djangoAPI.deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

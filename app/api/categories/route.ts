import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories, Category } from "@/lib/categories";
import { cookies } from "next/headers";

async function isAuthed() {
  const c = await cookies();
  return c.get("admin_session")?.value === "1";
}

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const categories: Category[] = body.categories;
  if (!Array.isArray(categories)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  await saveCategories(categories);
  return NextResponse.json({ ok: true });
}

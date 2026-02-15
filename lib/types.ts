export type CategoryKey =
  | "fbs"
  | "manipulator"
  | "rings"
  | "shlakoblock"
  | "polublok"
  | "covers_bottoms";

export interface Product {
  id: string;
  category: CategoryKey;
  name: string;
  description?: string;
  price: string | null; // число как строка или текст (по запросу, договорная и т.д.)
  unit: string;
  order: number;
  image?: string; // path like /products/xxx.jpg or URL
}

export interface ProductsData {
  products: Product[];
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  fbs: "ФБС",
  manipulator: "Услуги манипулятора",
  rings: "Кольца ЖБИ",
  shlakoblock: "Шлакоблок",
  polublok: "Полублок",
  covers_bottoms: "Крышки и Днища ЖБИ",
};

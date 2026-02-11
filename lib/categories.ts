import { CATEGORY_LABELS, CategoryKey } from "./types";
import * as djangoAPI from "./django-api";

export interface Category {
  key: CategoryKey;
  label: string;
  order: number;
}

export interface CategoriesData {
  categories: Category[];
}

/**
 * Преобразует Django Category в формат фронтенда
 */
function adaptDjangoCategory(djangoCategory: djangoAPI.DjangoCategory): Category {
  return {
    key: djangoCategory.key as CategoryKey,
    label: djangoCategory.label,
    order: djangoCategory.order,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const djangoCategories = await djangoAPI.getCategories();
    return djangoCategories.map(adaptDjangoCategory).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Failed to fetch categories from Django API:", error);
    // Fallback: возвращаем категории из types.ts
    return Object.entries(CATEGORY_LABELS).map(([key, label], index) => ({
      key: key as CategoryKey,
      label,
      order: index,
    }));
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    const djangoCategories = categories.map((cat) => ({
      id: 0, // будет проигнорировано при обновлении по key
      key: cat.key,
      label: cat.label,
      order: cat.order,
    }));
    await djangoAPI.updateCategories(djangoCategories);
  } catch (error) {
    console.error("Failed to save categories to Django API:", error);
    throw error;
  }
}

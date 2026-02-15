/**
 * Утилиты для работы с Django REST API
 */

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api';

export interface DjangoCategory {
  id: number;
  key: string;
  label: string;
  order: number;
}

export interface DjangoProduct {
  id: number;
  category: DjangoCategory;
  name: string;
  description?: string;
  price: string | null;
  unit: string;
  order: number;
  image?: string;
}

export interface DjangoProductCreate {
  category_id?: number;
  name: string;
  description?: string;
  price: string | null;
  unit?: string;
  order?: number;
  image?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${DJANGO_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getCategories(): Promise<DjangoCategory[]> {
  return fetchAPI<DjangoCategory[]>('/categories/');
}

export async function getCategoryByKey(key: string): Promise<DjangoCategory> {
  return fetchAPI<DjangoCategory>(`/categories/${key}/`);
}

export async function getProducts(): Promise<DjangoProduct[]> {
  return fetchAPI<DjangoProduct[]>('/products/');
}

export async function getProduct(id: number | string): Promise<DjangoProduct> {
  return fetchAPI<DjangoProduct>(`/products/${id}/`);
}

export async function createProduct(product: DjangoProductCreate): Promise<DjangoProduct> {
  return fetchAPI<DjangoProduct>('/products/', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(
  id: number | string,
  product: Partial<DjangoProductCreate>
): Promise<DjangoProduct> {
  return fetchAPI<DjangoProduct>(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: number | string): Promise<void> {
  await fetchAPI(`/products/${id}/`, {
    method: 'DELETE',
  });
}

export async function updateCategories(categories: DjangoCategory[]): Promise<DjangoCategory[]> {
  // Для обновления категорий делаем PUT запросы к каждой категории
  const results = await Promise.all(
    categories.map((cat) =>
      fetchAPI<DjangoCategory>(`/categories/${cat.key}/`, {
        method: 'PUT',
        body: JSON.stringify(cat),
      })
    )
  );
  return results;
}

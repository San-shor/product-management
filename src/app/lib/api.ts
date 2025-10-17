export const API_BASE_URL = 'https://api.bitechx.com';

export async function postAuth(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error('Authentication failed');
  }

  return res.json(); // should return { token: "..." }
}

import type { Product } from '@/types/product';
import type {
  Category,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/product';

export async function getProducts(
  token: string,
  opts?: { offset?: number; limit?: number; searchedText?: string }
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (opts?.offset !== undefined) params.set('offset', String(opts.offset));
  if (opts?.limit !== undefined) params.set('limit', String(opts.limit));
  if (opts?.searchedText && opts.searchedText.trim().length > 0) {
    params.set('searchedText', opts.searchedText.trim());
  }
  const qs = params.toString();
  const base =
    opts?.searchedText && opts.searchedText.trim().length > 0
      ? `${API_BASE_URL}/products/search`
      : `${API_BASE_URL}/products`;
  const url = qs ? `${base}?${qs}` : base;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = 'Failed to load products';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function deleteProduct(
  token: string,
  productId: string
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = 'Failed to delete product';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function getCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = 'Failed to load categories';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function getProductBySlug(
  token: string,
  productSlug: string
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${productSlug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = 'Failed to load product';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function createProduct(
  token: string,
  payload: CreateProductPayload
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Failed to create product';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function updateProduct(
  token: string,
  productId: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Failed to update product';
    try {
      const err = await res.json();
      if (typeof err?.message === 'string') message = err.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

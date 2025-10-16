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

export async function getProducts(
  token: string,
  opts?: { offset?: number; limit?: number }
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (opts?.offset !== undefined) params.set('offset', String(opts.offset));
  if (opts?.limit !== undefined) params.set('limit', String(opts.limit));
  const qs = params.toString();
  const url = qs
    ? `${API_BASE_URL}/products?${qs}`
    : `${API_BASE_URL}/products`;

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

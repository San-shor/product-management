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

export async function getProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
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

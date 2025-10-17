'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/app/components/ProductForm';
import { getProductBySlug } from '@/app/lib/api';
import { useAppSelector } from '@/app/lib/redux/store';
import type { Product } from '@/types/product';

export default function EditProductPage() {
  const params = useParams<{ slug: string }>();
  const productSlug = params?.slug as string;
  const token = useAppSelector((s) => s.auth.token);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!productSlug || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProductBySlug(token, productSlug);
        if (mounted) setProduct(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [productSlug, token]);

  if (!productSlug)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
        <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
          <div className='text-[var(--color-danger)]'>Invalid product id</div>
        </div>
      </div>
    );
  if (loading)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
        <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
          <div>Loading...</div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
        <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
          <div className='text-[var(--color-danger)]'>{error}</div>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
        <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
          <div>Product not found</div>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            Edit Product
          </h1>
        </div>
        <div className='max-w-2xl'>
          <ProductForm
            mode='edit'
            initialValues={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              categoryId: product.category.id,
              images: product.images,
            }}
          />
        </div>
      </div>
    </div>
  );
}

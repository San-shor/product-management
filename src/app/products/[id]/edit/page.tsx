'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/app/components/ProductForm';
import { getProductById } from '@/app/lib/api';
import { useAppSelector } from '@/app/lib/redux/store';
import type { Product } from '@/types/product';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;
  const token = useAppSelector((s) => s.auth.token);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!productId || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(token, productId);
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
  }, [productId, token]);

  if (!productId) return <div className='p-4'>Invalid product id</div>;
  if (loading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4 text-red-600'>{error}</div>;
  if (!product) return <div className='p-4'>Product not found</div>;

  return (
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
  );
}

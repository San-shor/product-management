'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/lib/redux/store';
import { deleteProduct, getProductBySlug } from '@/app/lib/api';
import type { Product } from '@/types/product';
import ConfirmationModal from '@/app/components/ConfirmationModal';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    product: null,
    isDeleting: false,
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
      isDeleting: false,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product || !token) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteProduct(token, deleteModal.product.id);

      // Close the modal
      setDeleteModal({
        isOpen: false,
        product: null,
        isDeleting: false,
      });

      router.push(`/products`);
    } catch (e: any) {
      setError(e.message ?? 'Failed to delete product');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!slug || !token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProductBySlug(token, slug as string);
        if (mounted) {
          setProduct(data);
          setActiveImageIdx(0);
        }
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
  }, [slug, token]);

  if (!token) return null;

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

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['/window.svg'];

  return (
    <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            {product.name}
          </h1>
          <button
            onClick={() => router.push('/products')}
            className='px-3 py-2 rounded-md bg-[var(--color-accent)] text-white hover:brightness-95'>
            Back to Products
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <div className='relative w-full aspect-square overflow-hidden rounded-lg border border-[color:var(--color-accent)]/30 bg-black/5'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImageIdx]}
                alt={`${product.name} image`}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2'>
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-square overflow-hidden rounded-md border ${
                    idx === activeImageIdx
                      ? 'border-[var(--color-primary)]'
                      : 'border-[color:var(--color-accent)]/30'
                  }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <div className='text-xs uppercase tracking-wide opacity-60'>
                {product.category?.name}
              </div>
              <div className='text-3xl font-semibold text-[var(--color-text)] mt-1'>
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div>
              <h2 className='text-lg font-medium mb-1 text-[var(--color-text)]'>
                Description
              </h2>
              <p className='text-sm leading-6 opacity-80'>
                {product.description}
              </p>
            </div>

            <div className='flex gap-3 pt-2'>
              <button
                onClick={() => handleDeleteClick(product)}
                className='inline-flex items-center justify-center px-4 py-2 rounded-md bg-[var(--color-danger)] text-white text-sm'
                title='Delete product'>
                Delete
              </button>
              <button
                onClick={() => router.push(`/products/${product.slug}/edit`)}
                className='px-4 py-2 rounded-md border border-[color:var(--color-accent)]/40 hover:bg-[color:var(--color-accent)]/5'>
                Edit Product
              </button>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
              <div className='rounded-md border border-[color:var(--color-accent)]/30 p-3'>
                <div className='opacity-60 text-xs'>Category</div>
                <div className='font-medium'>{product.category?.name}</div>
              </div>
              <div className='rounded-md border border-[color:var(--color-accent)]/30 p-3'>
                <div className='opacity-60 text-xs'>Updated</div>
                <div className='font-medium'>
                  {new Date(product.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Product'
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
}

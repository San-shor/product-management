'use client';

import Button from '@/app/components/Button';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import { useAppSelector } from '@/app/lib/redux/store';
import {
  useDeleteProductMutation,
  useGetProductBySlugQuery,
} from '@/services/product';
import type { Product } from '@/types/product';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductBySlugQuery(slug as string, { skip: !slug || !token });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product || !token) return;
    try {
      await deleteProduct(deleteModal.product.id).unwrap();
      setDeleteModal({ isOpen: false, product: null });
      router.push(`/products`);
    } catch (e) {
      // noop; error UI handled by modal loading state
    }
  };

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.id]);

  if (!token) return null;

  if (isLoading)
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
          <div className='text-[var(--color-danger)]'>
            Failed to load product
          </div>
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
          <Button onClick={() => router.push('/products')} variant='secondary'>
            Back to Products
          </Button>
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
                  className={`relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
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
              <Button
                onClick={() => handleDeleteClick(product)}
                variant='danger'
                size='sm'>
                Delete
              </Button>
              <Button
                onClick={() => router.push(`/products/${product.slug}/edit`)}
                size='sm'>
                Edit
              </Button>
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
        isLoading={isDeleting}
      />
    </div>
  );
}

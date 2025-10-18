'use client';

import Button from '@/app/components/Button';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import Header from '@/app/components/Header';
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
    } catch (_) {}
  };

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.id]);

  if (!token) return null;

  if (isLoading)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] py-10'>
        <Header />
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-accent)]/20 overflow-hidden'>
            <div className='p-8'>
              <div className='animate-pulse'>
                <div className='h-8 bg-[var(--color-accent)]/20 rounded-lg w-1/3 mb-6'></div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                  <div>
                    <div className='aspect-square bg-[var(--color-accent)]/20 rounded-xl mb-4'></div>
                    <div className='grid grid-cols-5 gap-2'>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className='aspect-square bg-[var(--color-accent)]/20 rounded-lg'></div>
                      ))}
                    </div>
                  </div>
                  <div className='space-y-6'>
                    <div className='h-6 bg-[var(--color-accent)]/20 rounded w-1/4'></div>
                    <div className='h-12 bg-[var(--color-accent)]/20 rounded w-1/2'></div>
                    <div className='space-y-3'>
                      <div className='h-4 bg-[var(--color-accent)]/20 rounded w-1/3'></div>
                      <div className='h-4 bg-[var(--color-accent)]/20 rounded w-full'></div>
                      <div className='h-4 bg-[var(--color-accent)]/20 rounded w-3/4'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] py-10'>
        <Header />
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-accent)]/20 overflow-hidden'>
            <div className='p-8 text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-[var(--color-danger)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-[var(--color-text)] mb-2'>
                Failed to Load Product
              </h2>
              <p className='text-[var(--color-text)]/70 mb-6'>
                Something went wrong while loading the product details.
              </p>
              <Button
                onClick={() => router.push('/products')}
                variant='secondary'>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className='min-h-screen bg-[var(--color-bg)] py-10'>
        <Header />
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-accent)]/20 overflow-hidden'>
            <div className='p-8 text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-[var(--color-accent)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 9c-2.34 0-4.29-1.009-5.824-2.709'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-[var(--color-text)] mb-2'>
                Product Not Found
              </h2>
              <p className='text-[var(--color-text)]/70 mb-6'>
                The product you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Button
                onClick={() => router.push('/products')}
                variant='secondary'>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['/window.svg'];

  return (
    <div className='min-h-screen bg-[var(--color-bg)] py-10'>
      <Header />
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Breadcrumb */}
        <nav className='mb-6'>
          <div className='flex items-center space-x-2 text-sm text-[var(--color-text)]/60'>
            <button
              onClick={() => router.push('/products')}
              className='hover:text-[var(--color-primary)] transition-colors duration-200'>
              Products
            </button>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
            <span className='text-[var(--color-text)]'>{product.name}</span>
          </div>
        </nav>

        <div className='bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-accent)]/20 overflow-hidden'>
          {/* Header */}
          <div className='px-8 py-6 border-b border-[var(--color-accent)]/10'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-[var(--color-text)] mb-2'>
                  {product.name}
                </h1>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'>
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  <span className='text-sm text-[var(--color-text)]/60'>
                    Updated {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => router.push('/products')}
                variant='secondary'>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Back
              </Button>
            </div>
          </div>

          <div className='p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              {/* Image Gallery */}
              <div>
                <div className='relative group'>
                  <div className='relative w-full aspect-square overflow-hidden rounded-xl border border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-accent)]/10'>
                    <img
                      src={images[activeImageIdx]}
                      alt={`${product.name} image`}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    {images.length > 1 && (
                      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                    )}
                  </div>

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIdx(
                            (prev) => (prev - 1 + images.length) % images.length
                          )
                        }
                        className='absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)]/90 backdrop-blur-sm text-[var(--color-text)] shadow-lg border border-[var(--color-accent)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--color-surface)]'>
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 19l-7-7 7-7'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIdx(
                            (prev) => (prev + 1) % images.length
                          )
                        }
                        className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)]/90 backdrop-blur-sm text-[var(--color-text)] shadow-lg border border-[var(--color-accent)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--color-surface)]'>
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className='mt-6'>
                    <div className='grid grid-cols-5 sm:grid-cols-6 gap-3'>
                      {images.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            idx === activeImageIdx
                              ? 'border-[var(--color-primary)] shadow-md scale-105'
                              : 'border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 hover:scale-105'
                          }`}>
                          <img
                            src={src}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                          {idx === activeImageIdx && (
                            <div className='absolute inset-0 bg-[var(--color-primary)]/20'></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className='space-y-8'>
                {/* Price */}
                <div className='bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-xl p-6 border border-[var(--color-primary)]/10'>
                  <div className='text-sm font-medium text-[var(--color-primary)] mb-1'>
                    Price
                  </div>
                  <div className='text-4xl font-bold text-[var(--color-text)]'>
                    ${product.price.toFixed(2)}
                    <span className='text-lg font-normal text-[var(--color-text)]/60 ml-2'>
                      USD
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className='text-xl font-semibold text-[var(--color-text)] mb-4 flex items-center'>
                    <svg
                      className='w-5 h-5 mr-2 text-[var(--color-primary)]'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    Description
                  </h2>
                  <div className='prose prose-sm max-w-none'>
                    <p className='text-[var(--color-text)]/80 leading-relaxed whitespace-pre-wrap'>
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-4 pt-4'>
                  <Button
                    onClick={() =>
                      router.push(`/products/${product.slug}/edit`)
                    }
                    className='flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-surface)]'>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                    Edit Product
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(product)}
                    variant='danger'
                    className='flex-1'>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                    Delete Product
                  </Button>
                </div>

                {/* Product Details */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--color-accent)]/10'>
                  <div className='bg-[var(--color-bg)]/50 rounded-lg p-4'>
                    <div className='text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wide mb-1'>
                      Category
                    </div>
                    <div className='font-semibold text-[var(--color-text)]'>
                      {product.category?.name || 'Uncategorized'}
                    </div>
                  </div>
                  <div className='bg-[var(--color-bg)]/50 rounded-lg p-4'>
                    <div className='text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wide mb-1'>
                      Last Updated
                    </div>
                    <div className='font-semibold text-[var(--color-text)]'>
                      {new Date(product.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
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

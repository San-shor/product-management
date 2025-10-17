'use client';
import React from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  onDetailsClick?: (product: Product) => void;
  onDeleteClick?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onDetailsClick,
  onDeleteClick,
}: ProductCardProps) {
  return (
    <div className='rounded-xl overflow-hidden border border-[color:var(--color-accent)]/30 bg-white/80 backdrop-blur hover:shadow-sm hover:-translate-y-0.5 transition'>
      <div className='relative aspect-[4/3] bg-[var(--color-bg)]'>
        {Array.isArray(product.images) &&
          product.images.length > 0 &&
          typeof product.images[0] === 'string' &&
          product.images[0].length > 0 && (
            <Image
              src={product.images[0]}
              alt={String(product.name || 'Product image')}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              className='object-cover'
              priority={false}
              unoptimized
            />
          )}
      </div>

      <div className='p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='font-medium text-[var(--color-text)] line-clamp-1'>
            {product.name}
          </div>
          <span className='shrink-0 text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-text)]'>
            {product?.category?.name ?? '—'}
          </span>
        </div>

        <div className='mt-3 flex items-center justify-between'>
          <button
            onClick={() =>
              onDetailsClick
                ? onDetailsClick(product)
                : alert(product.description)
            }
            className='inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-[var(--color-primary)] text-white text-sm hover:brightness-95'>
            Details
          </button>
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-accent)]/20 text-[var(--color-text)] text-sm'>
              {String(product?.price ?? '')}
            </span>
            {onDeleteClick && (
              <button
                onClick={() => onDeleteClick(product)}
                className='inline-flex items-center justify-center p-1.5 rounded-md bg-[var(--color-danger)] text-white text-sm'
                title='Delete product'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='size-6'>
                  <path
                    fillRule='evenodd'
                    d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  onDetailsClick?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onDetailsClick,
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
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-accent)]/20 text-[var(--color-text)] text-sm'>
            {String(product?.price ?? '')}
          </span>
        </div>
      </div>
    </div>
  );
}

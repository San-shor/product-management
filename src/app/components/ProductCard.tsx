'use client';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Button from './Button';

type ProductCardProps = {
  product: Product;
  onDetailsClick?: (product: Product) => void;
  onDeleteClick?: (product: Product) => void;
  onEditClick?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onDetailsClick,
  onDeleteClick,
  onEditClick,
}: ProductCardProps) {
  return (
    <div className='group relative bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-accent)]/20 overflow-hidden hover:shadow-xl hover:shadow-[var(--color-accent)]/10 hover:-translate-y-1 transition-all duration-300 ease-out'>
      {/* Image Container */}
      <div className='relative aspect-[4/3] bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-accent)]/10 overflow-hidden'>
        {Array.isArray(product.images) &&
        product.images.length > 0 &&
        typeof product.images[0] === 'string' &&
        product.images[0].length > 0 ? (
          <Image
            src={product.images[0]}
            alt={String(product.name || 'Product image')}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover group-hover:scale-105 transition-transform duration-300 ease-out'
            priority={false}
            unoptimized
          />
        ) : (
          <div className='flex items-center justify-center h-full text-[var(--color-accent)]/60'>
            <svg
              className='w-12 h-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        <div className='absolute top-3 left-3'>
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)]/95 backdrop-blur-sm text-[var(--color-text)] shadow-sm border border-[var(--color-accent)]/20'>
            {product?.category?.name ?? 'Uncategorized'}
          </span>
        </div>

        {/* Action Buttons Overlay */}
        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <div className='flex gap-1.5'>
            {onEditClick && (
              <button
                onClick={() => onEditClick(product)}
                className='p-1.5 rounded-lg bg-[var(--color-surface)]/95 backdrop-blur-sm text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors duration-200 shadow-lg border border-[var(--color-accent)]/20 ring-1 ring-[var(--color-surface)]/50'>
                <svg
                  className='w-4 h-4'
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
              </button>
            )}
            {onDeleteClick && (
              <button
                onClick={() => onDeleteClick(product)}
                className='p-1.5 rounded-lg bg-[var(--color-surface)]/95 backdrop-blur-sm text-[var(--color-danger)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface)] transition-colors duration-200 shadow-lg border border-[var(--color-accent)]/20 ring-1 ring-[var(--color-surface)]/50'>
                <svg
                  className='w-4 h-4'
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
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-5'>
        {/* Product Name */}
        <h3 className='font-semibold text-[var(--color-text)] text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-200'>
          {product.name}
        </h3>

        {/* Description Preview */}
        {product.description && (
          <p className='text-[var(--color-text)]/70 text-sm leading-relaxed mb-4 line-clamp-2'>
            {product.description}
          </p>
        )}

        {/* Bottom Section */}
        <div className='flex items-center justify-between'>
          {/* Price */}
          <div className='flex items-baseline gap-1'>
            <span className='text-2xl font-bold text-[var(--color-text)]'>
              ${String(product?.price ?? '0')}
            </span>
            <span className='text-sm text-[var(--color-text)]/60'>USD</span>
          </div>

          {/* Details Button */}
          <Button
            size='sm'
            onClick={() =>
              onDetailsClick
                ? onDetailsClick(product)
                : alert(product.description)
            }
            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-surface)] px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md'>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

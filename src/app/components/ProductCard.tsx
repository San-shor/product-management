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
          <Button
            size='sm'
            onClick={() =>
              onDetailsClick
                ? onDetailsClick(product)
                : alert(product.description)
            }>
            Details
          </Button>

          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-accent)]/20 text-[var(--color-text)] text-sm'>
              {String(product?.price ?? '')}
            </span>
            {onEditClick && (
              <Button
                onClick={() => onEditClick(product)}
                size='sm'
                variant='secondary'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='size-6'>
                  <path d='M16.862 4.487a1.5 1.5 0 0 1 2.122 2.122l-1.2 1.2-2.122-2.122 1.2-1.2Z' />
                  <path d='M14.69 6.659 6.5 14.848V17.5h2.652l8.189-8.189-2.652-2.652Z' />
                  <path
                    fillRule='evenodd'
                    d='M5 3.75A2.75 2.75 0 0 0 2.25 6.5v11A2.75 2.75 0 0 0 5 20.25h11A2.75 2.75 0 0 0 18.75 17.5v-5a.75.75 0 0 0-1.5 0v5c0 .69-.56 1.25-1.25 1.25H5c-.69 0-1.25-.56-1.25-1.25v-11C3.75 5.81 4.31 5.25 5 5.25h5a.75.75 0 0 0 0-1.5H5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Button>
            )}
            {onDeleteClick && (
              <Button
                onClick={() => onDeleteClick(product)}
                size='sm'
                variant='danger'>
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
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

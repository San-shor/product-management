'use client';

import React from 'react';
import ProductForm from '../components/ProductForm';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  return (
    <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            Create Product
          </h1>
        </div>

        <div className='max-w-2xl'>
          <ProductForm mode='create' initialValues={null} />
        </div>
      </div>
    </div>
  );
}

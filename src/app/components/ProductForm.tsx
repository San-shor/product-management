'use client';

import { useAppSelector } from '@/app/lib/redux/store';
import { useGetCategoriesQuery } from '@/services/category';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/product';
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from './Button';

type ProductFormMode = 'create' | 'edit';

type ProductFormProps = {
  mode: ProductFormMode;
  initialValues?: {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
  } | null;
};

const urlSchema = z.string().url('Enter a valid URL');

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z
    .number()
    .refine(
      (v) => typeof v === 'number' && !Number.isNaN(v),
      'Price must be a number'
    )
    .positive('Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z
    .array(urlSchema)
    .min(1, 'At least one image URL is required')
    .refine(
      (arr) => arr.every((s) => s.trim().length > 0),
      'Image URL cannot be empty'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({ mode, initialValues }: ProductFormProps) {
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);
  const [createProductMutation] = useCreateProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();

  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useGetCategoriesQuery(undefined, {
    skip: !token,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues: FormValues = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      price: initialValues?.price ?? 0,
      categoryId: initialValues?.categoryId ?? '',
      images: initialValues?.images?.length ? initialValues.images : [''],
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const images = watch('images');

  // Set error if categories fail to load
  useEffect(() => {
    if (categoriesError) {
      setSubmitError('Failed to load categories');
    }
  }, [categoriesError]);

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      setSubmitError('You are not authenticated');
      return;
    }
    setSubmitError(null);
    try {
      if (mode === 'create') {
        const payload: CreateProductPayload = {
          name: values.name.trim(),
          description: values.description.trim(),
          price: values.price,
          categoryId: values.categoryId,
          images: values.images.map((u) => u.trim()),
        };
        await createProductMutation(payload).unwrap();
      } else if (mode === 'edit' && initialValues?.id) {
        const payload: UpdateProductPayload = {
          name: values.name.trim(),
          description: values.description.trim(),
          price: values.price,
          categoryId: values.categoryId,
          images: values.images.map((u) => u.trim()),
        };
        await updateProductMutation({ id: initialValues.id, payload }).unwrap();
      }
      router.push('/products');
      router.refresh();
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong');
    }
  };

  return (
    <div className='space-y-8'>
      {/* Error Alert */}
      {submitError && (
        <div className='relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--color-danger)]/5 to-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 p-4'>
          <div className='flex items-start gap-3'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-[var(--color-danger)]'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-[var(--color-danger)]'>
                Error
              </h3>
              <p className='mt-1 text-sm text-[var(--color-danger)]/80'>
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Basic Information Section */}
        <div className='space-y-6'>
          <div className='border-b border-[var(--color-accent)]/20 pb-2'>
            <h2 className='text-lg font-semibold text-[var(--color-text)] flex items-center gap-2'>
              <svg
                className='h-5 w-5 text-[var(--color-primary)]'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Basic Information
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Product Name */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[var(--color-text)]'>
                Product Name *
              </label>
              <div className='relative'>
                <input
                  type='text'
                  className='w-full rounded-xl border border-[var(--color-accent)]/30 bg-white px-4 py-3 text-[var(--color-text)] placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-sm hover:shadow-md'
                  placeholder='Enter product name'
                  {...register('name')}
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                    />
                  </svg>
                </div>
              </div>
              {errors.name && (
                <p className='text-sm text-[var(--color-danger)] flex items-center gap-1'>
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-[var(--color-text)]'>
                Price *
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <span className='text-gray-500 text-sm'>$</span>
                </div>
                <input
                  type='number'
                  step='0.01'
                  className='w-full rounded-xl border border-[var(--color-accent)]/30 bg-white pl-8 pr-4 py-3 text-[var(--color-text)] placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-sm hover:shadow-md'
                  placeholder='0.00'
                  {...register('price', { valueAsNumber: true })}
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
              </div>
              {errors.price && (
                <p className='text-sm text-[var(--color-danger)] flex items-center gap-1'>
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-[var(--color-text)]'>
              Description *
            </label>
            <textarea
              className='w-full rounded-xl border border-[var(--color-accent)]/30 bg-white px-4 py-3 text-[var(--color-text)] placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-sm hover:shadow-md resize-none'
              rows={4}
              placeholder='Describe your product in detail...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-[var(--color-danger)] flex items-center gap-1'>
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-[var(--color-text)]'>
              Category *
            </label>
            <div className='relative'>
              <select
                className='w-full rounded-xl border border-[var(--color-accent)]/30 bg-white px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer'
                disabled={loadingCategories}
                {...register('categoryId')}>
                <option value=''>Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>
            {errors.categoryId && (
              <p className='text-sm text-[var(--color-danger)] flex items-center gap-1'>
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className='space-y-6'>
          <div className='border-b border-[var(--color-accent)]/20 pb-2'>
            <h2 className='text-lg font-semibold text-[var(--color-text)] flex items-center gap-2'>
              <svg
                className='h-5 w-5 text-[var(--color-primary)]'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              Product Images
            </h2>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-gray-600'>
                Add image URLs for your product
              </p>
              <Button
                type='button'
                size='sm'
                variant='accent'
                onClick={() =>
                  setValue('images', [...(images || []), ''], {
                    shouldValidate: true,
                  })
                }
                className='flex items-center gap-2'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                Add Image
              </Button>
            </div>

            <div className='space-y-3'>
              {(images || []).map((_, index) => (
                <div key={index} className='relative'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <input
                        type='url'
                        className='w-full rounded-xl border border-[var(--color-accent)]/30 bg-white px-4 py-3 text-[var(--color-text)] placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-sm hover:shadow-md'
                        placeholder='https://example.com/image.jpg'
                        {...register(`images.${index}` as const)}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='danger'
                      size='sm'
                      onClick={() =>
                        setValue(
                          'images',
                          (images || []).filter((_, i) => i !== index),
                          { shouldValidate: true }
                        )
                      }
                      className='flex items-center gap-2'>
                      <svg
                        className='h-4 w-4'
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
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {errors.images && (
              <div className='rounded-xl bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 p-3'>
                <p className='text-sm text-[var(--color-danger)] flex items-center gap-2'>
                  <svg
                    className='h-4 w-4 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.images.message as string}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-6 border-t border-[var(--color-accent)]/20'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='min-w-[140px] flex items-center justify-center gap-2'>
            {isSubmitting ? (
              <>
                <svg
                  className='animate-spin h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d={
                      mode === 'create'
                        ? 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                        : 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    }
                  />
                </svg>
                {mode === 'create' ? 'Create Product' : 'Update Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

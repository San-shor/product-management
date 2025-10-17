'use client';

import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/app/lib/redux/store';
import type { Category, Product } from '@/types/product';
import { getCategories } from '@/app/lib/api';
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/product';
import { useRouter } from 'next/navigation';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/product';

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
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
    control,
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

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        if (!token) throw new Error('Missing auth token');
        const data = await getCategories(token);
        if (mounted) setCategories(data);
      } catch (err: any) {
        if (mounted)
          setSubmitError(err?.message || 'Failed to load categories');
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, [token]);

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
    <div>
      {submitError && (
        <div className='mb-4 rounded p-3 text-sm bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20'>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Name</label>
          <input
            type='text'
            className='w-full rounded-md border border-[color:var(--color-accent)]/40 px-3 py-2 focus:outline-none'
            placeholder='Product name'
            {...register('name')}
          />
          {errors.name && (
            <p className='text-[var(--color-danger)] text-sm mt-1'>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Description</label>
          <textarea
            className='w-full rounded-md border border-[color:var(--color-accent)]/40 px-3 py-2 focus:outline-none'
            rows={4}
            placeholder='Product description'
            {...register('description')}
          />
          {errors.description && (
            <p className='text-[var(--color-danger)] text-sm mt-1'>
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Price</label>
          <input
            type='number'
            step='0.01'
            className='w-full rounded-md border border-[color:var(--color-accent)]/40 px-3 py-2 focus:outline-none'
            placeholder='0.00'
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className='text-[var(--color-danger)] text-sm mt-1'>
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Category</label>
          <select
            className='w-full rounded-md border border-[color:var(--color-accent)]/40 px-3 py-2 bg-white focus:outline-none'
            disabled={loadingCategories}
            {...register('categoryId')}>
            <option value=''>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className='text-[var(--color-danger)] text-sm mt-1'>
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <div className='flex items-center justify-between mb-1'>
            <label className='block text-sm font-medium'>Images</label>
            <button
              type='button'
              className='text-sm text-blue-600'
              onClick={() =>
                setValue('images', [...(images || []), ''], {
                  shouldValidate: true,
                })
              }>
              Add
            </button>
          </div>
          <div className='space-y-2'>
            {(images || []).map((_, index) => (
              <div key={index} className='flex gap-2'>
                <input
                  type='url'
                  className='flex-1 rounded-md border border-[color:var(--color-accent)]/40 px-3 py-2 focus:outline-none'
                  placeholder='https://...'
                  {...register(`images.${index}` as const)}
                />
                <button
                  type='button'
                  className='border rounded-md px-2'
                  onClick={() =>
                    setValue(
                      'images',
                      (images || []).filter((_, i) => i !== index),
                      { shouldValidate: true }
                    )
                  }>
                  Remove
                </button>
              </div>
            ))}
          </div>
          {errors.images && (
            <p className='text-[var(--color-danger)] text-sm mt-1'>
              {errors.images.message as string}
            </p>
          )}
        </div>

        <div className='pt-2'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-3 py-2 rounded-md bg-[var(--color-primary)] text-white hover:brightness-95 disabled:opacity-50'>
            {isSubmitting
              ? 'Submitting...'
              : mode === 'create'
              ? 'Create'
              : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../lib/redux/store';

import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from '@/services/product';
import type { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

export default function ProductsPage() {
  const token = useAppSelector((s) => s.auth.token);
  const router = useRouter();
  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
  }, [token, router]);

  const { data, error, isLoading } = useGetProductsQuery({
    offset,
    limit,
    searchedText: debouncedSearch,
  });

  useEffect(() => {
    setProducts(data || []);
  }, [data]);

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product || !token) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteProductMutation(deleteModal.product.id).unwrap();

      // Remove the product from the local state
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteModal.product!.id)
      );

      // Close the modal
      setDeleteModal({
        isOpen: false,
        product: null,
      });
    } catch (_) {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
    });
  };

  if (!token) return null;

  return (
    <div className='min-h-screen  px-6 py-10'>
      <Header />
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            All Products
          </h1>

          <div className='flex w-full sm:w-auto gap-3'>
            <input
              type='text'
              placeholder='Search products...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
              className='px-4 py-2 rounded-md border border-[color:var(--color-accent)]/40 focus:outline-none w-full sm:w-60'
            />
          </div>
        </div>

        {isLoading && <ProductSkeleton count={6} />}
        {/* {error && <p className='text-[var(--color-danger)]'>{error.data}</p>} */}
        {!isLoading && !error && Array.isArray(products) && (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((p: Product, idx: number) => (
              <ProductCard
                key={idx}
                product={p}
                onDetailsClick={(prod) =>
                  router.push(`/products/${prod.slug}/details`)
                }
                onDeleteClick={handleDeleteClick}
                onEditClick={(prod) =>
                  router.push(`/products/${prod.slug}/edit`)
                }
              />
            ))}
            {products.length < 1 && (
              <div className='mt-10 text-center text-sm opacity-70'>
                No products found.
              </div>
            )}
          </div>
        )}

        {!isLoading && error && products?.length === 0 && (
          <div className='mt-10 text-center text-sm opacity-70'>
            No products found.
          </div>
        )}

        {debouncedSearch.trim().length === 0 && (
          <div className='mt-6 flex items-center justify-between'>
            <Button
              disabled={offset === 0 || isLoading}
              onClick={() => setOffset(Math.max(0, offset - limit))}>
              Previous
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => setOffset(offset + limit)}>
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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

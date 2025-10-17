'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../lib/redux/store';
import { logout } from '../lib/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await (debouncedSearch.trim().length > 0
          ? getProducts(token, { searchedText: debouncedSearch })
          : getProducts(token, { offset, limit }));
        setProducts(data);
      } catch (e: any) {
        setError(e.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router, offset, limit, debouncedSearch]);
  console.log(products);
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  if (!token) return null;

  return (
    <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            Products
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
            <button
              onClick={handleLogout}
              className='px-3 py-2 rounded-md bg-[var(--color-accent)] text-white hover:brightness-95 shrink-0'>
              Logout
            </button>
          </div>
        </div>

        {loading && <ProductSkeleton count={6} />}
        {error && <p className='text-[var(--color-danger)]'>{error}</p>}
        {!loading && !error && Array.isArray(products) && (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((p: Product, idx: number) => (
              <ProductCard
                key={idx}
                product={p}
                onDetailsClick={() => alert(String(p.name))}
              />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className='mt-10 text-center text-sm opacity-70'>
            No products found.
          </div>
        )}

        {debouncedSearch.trim().length === 0 && (
          <div className='mt-6 flex items-center justify-between'>
            <button
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className='px-3 py-2 rounded-md border bg-[var(--color-primary)] text-white disabled:opacity-50'>
              Previous
            </button>
            <button
              disabled={loading || products.length < limit}
              onClick={() => setOffset(offset + limit)}
              className='px-3 py-2 rounded-md border bg-[var(--color-primary)] text-white disabled:opacity-50'>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

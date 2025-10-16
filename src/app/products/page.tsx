'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../lib/redux/store';
import { logout } from '../lib/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { getProducts } from '../lib/api';
import ProductCard from './ProductCard';

export default function ProductsPage() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts(token);
        setProducts(data);
      } catch (e: any) {
        setError(e.message ?? 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router]);
  console.log(products);
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  if (!token) return null;

  return (
    <div className='min-h-screen bg-[var(--color-bg)] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-[var(--color-surface)] rounded-xl p-6 shadow border border-[color:var(--color-bg)]'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold text-[var(--color-text)]'>
            Products
          </h1>

          <div className='flex gap-3'>
            <input
              type='text'
              placeholder='Search products...'
              className='px-4 py-2 rounded-md border border-[color:var(--color-accent)]/40 focus:outline-none w-60'
            />
            <button
              onClick={handleLogout}
              className='px-3 py-2 rounded-md bg-[var(--color-accent)] text-white hover:brightness-95'>
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='h-24 rounded-lg bg-[var(--color-bg)] animate-pulse border border-[color:var(--color-accent)]/20'
              />
            ))}
          </div>
        )}
        {error && <p className='text-[var(--color-danger)]'>{error}</p>}
        {!loading && !error && Array.isArray(products) && (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((p: any, idx: number) => (
              <ProductCard
                key={idx}
                product={p}
                onDetailsClick={() =>
                  alert(String(p?.name ?? p?.title ?? 'Product'))
                }
              />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className='mt-10 text-center text-sm opacity-70'>
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

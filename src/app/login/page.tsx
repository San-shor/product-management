'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../lib/redux/store';
import { setToken } from '../lib/redux/features/authSlice';
import { useGetAuthTokenMutation } from '@/services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [getAuthToken, { isLoading, isError, error }] =
    useGetAuthTokenMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await getAuthToken(email).unwrap();
      if (result.token) {
        // Save token to Redux state
        dispatch(setToken(result.token));
        router.push('/products');
      }
    } catch (err) {
      // Error handling is already done by RTK Query
      console.error('Login failed:', err);
    }
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg)]'>
      <form
        onSubmit={handleLogin}
        className='bg-[var(--color-surface)] p-8 rounded-2xl shadow w-80 border border-[color:var(--color-bg)]'>
        <h1 className='text-2xl font-semibold mb-6 text-center text-[var(--color-text)]'>
          Sign in
        </h1>

        <label className='block mb-2 text-sm font-medium text-[var(--color-text)]'>
          Email
        </label>
        <input
          type='email'
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-[color:var(--color-accent)]/40 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
          placeholder='you@example.com'
        />
        {isError && (
          <p className='text-[var(--color-danger)] text-sm mb-3 text-center'>
            Error: {(error as any)?.message || 'Something went wrong.'}
          </p>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:brightness-95 transition disabled:opacity-50'>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

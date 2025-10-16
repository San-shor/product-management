'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../lib/redux/store';
import { loginUser } from '../lib/redux/features/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(email));
    if (loginUser.fulfilled.match(result)) router.push('/products');
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

        {error && (
          <p className='text-[var(--color-danger)] text-sm mb-3 text-center'>
            {error}
          </p>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:brightness-95 transition disabled:opacity-50'>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

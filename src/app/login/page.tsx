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
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleLogin}
        className='bg-white p-8 rounded-2xl shadow-md w-80'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

        <label className='block mb-2 text-sm font-medium'>Email</label>
        <input
          type='email'
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='you@example.com'
        />

        {error && (
          <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50'>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

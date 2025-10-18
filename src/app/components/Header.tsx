'use client';
import { useRouter } from 'next/navigation';
import { logout } from '../lib/redux/features/authSlice';
import { useAppDispatch } from '../lib/redux/store';
import Button from './Button';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };
  return (
    <div className='max-w-7xl mx-auto mb-8'>
      <div className='px-6 '>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl shadow-md'>
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <div>
              <h1 className='text-xl font-bold text-[var(--color-text)]'>
                Product Manager
              </h1>
              <p className='text-xs text-gray-500 hidden sm:block'>
                Manage your inventory
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              onClick={() => router.push('/create')}
              variant='primary'
              icon={
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              }>
              <span className='hidden sm:inline'>Create Product</span>
              <span className='sm:hidden'>Create</span>
            </Button>

            <Button
              onClick={handleLogout}
              variant='accent'
              icon={
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
              }>
              <span className='hidden sm:inline'>Logout</span>
              <span className='sm:hidden'>Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

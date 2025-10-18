'use client';

import Button from './Button';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4'>
        <div className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex-shrink-0'>
              <svg
                className='w-6 h-6 text-red-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {title}
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>
            Are you sure you want to delete this product ? This action cannot be
            undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <Button onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant='danger'
              size='md'>
              {isLoading && (
                <svg
                  className='w-4 h-4 animate-spin'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
              )}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

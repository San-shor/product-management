import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'accent' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'flex items-center gap-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:brightness-110',
    accent: 'bg-[var(--color-accent)] text-white hover:brightness-110',
    danger: 'bg-[var(--color-danger)] text-white hover:brightness-110',
    secondary: 'bg-gray-200 text-[var(--color-text)] hover:bg-gray-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} cursor-pointer`}>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx('btn', `btn-${variant}`, `btn-${size}`, isLoading && 'loading', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="spinner" />}
        {!isLoading && leftIcon && <span className="btn-icon">{leftIcon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

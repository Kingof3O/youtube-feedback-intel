import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={clsx('input-wrapper', className)}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={clsx('input-field', leftIcon && 'has-left-icon', error && 'has-error')}
            {...props}
          />
        </div>
        {helperText && !error && <span className="input-helper">{helperText}</span>}
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

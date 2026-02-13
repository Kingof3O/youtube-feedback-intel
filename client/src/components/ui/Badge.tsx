import clsx from 'clsx';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  );
}

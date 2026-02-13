import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import './Toast.css';
import { ToastContext, type ToastType } from './toast-context';

interface ToastItemData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  const success = (message: string, duration?: number) => toast(message, 'success', duration);
  const error = (message: string, duration?: number) => toast(message, 'error', duration);
  const info = (message: string, duration?: number) => toast(message, 'info', duration);
  const warning = (message: string, duration?: number) => toast(message, 'warning', duration);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div className="toast-container">
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} {...toastItem} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  id,
  message,
  type,
  duration,
  onRemove,
}: ToastItemData & { onRemove: (id: string) => void }) {
  useEffect(() => {
    if (duration === Infinity) return;
    const timer = window.setTimeout(() => onRemove(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onRemove]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    warning: <AlertTriangle size={18} className="text-yellow-400" />,
    info: <Info size={18} className="text-accent-primary" />,
  };

  return (
    <div className={clsx('toast-item slide-in', `toast-${type}`)}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => onRemove(id)}>
        <X size={14} />
      </button>
      {duration !== Infinity && (
        <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
}

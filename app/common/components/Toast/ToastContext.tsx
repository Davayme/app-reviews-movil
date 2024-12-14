import { createContext } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);
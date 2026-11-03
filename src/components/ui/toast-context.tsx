'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = 'info' }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            data-testid="toast-item"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur shadow-2xl text-white transition-all transform animate-in slide-in-from-bottom-5"
          >
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />}
            {t.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />}
            {t.type === 'info' && <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">{t.title}</h4>
              {t.description && <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}


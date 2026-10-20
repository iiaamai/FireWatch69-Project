/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2Icon,
  error: XCircleIcon,
  warning: InfoIcon,
  info: InfoIcon,
};

let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message }) => {
    const id = `toast-${++toastSeq}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(100%-2rem,360px)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type] ?? InfoIcon;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="pointer-events-auto flex items-start gap-2 rounded-md border border-neutral-border bg-neutral-surface p-3 text-sm shadow-lg"
                role="status"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-text-muted" aria-hidden="true" />
                <p className="flex-1 text-neutral-text">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="rounded p-0.5 text-neutral-text-muted hover:bg-neutral-bg"
                  aria-label="Dismiss"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

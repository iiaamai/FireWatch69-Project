import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from '../utils/cn.js';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

export function Dialog({ isOpen, onClose, size = 'md', children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg border border-neutral-border bg-neutral-surface shadow-lg',
          sizes[size] ?? sizes.md,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ children }) {
  return (
    <div className="border-b border-neutral-border px-5 py-4 text-base font-bold text-neutral-text">
      {children}
    </div>
  );
}

export function DialogContent({ children }) {
  return <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>;
}

export function DialogFooter({ children }) {
  return <div className="border-t border-neutral-border px-5 py-3">{children}</div>;
}

export function DialogCloseButton({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-3 top-3 rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg"
      aria-label="Close"
    >
      <XIcon className="h-4 w-4" />
    </button>
  );
}

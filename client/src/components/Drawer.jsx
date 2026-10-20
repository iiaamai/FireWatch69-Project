import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from '../utils/cn.js';

const widths = {
  sm: 'w-[280px]',
  md: 'w-[400px]',
  lg: 'w-[520px] max-w-[100vw]',
};

export function Drawer({ isOpen, onClose, position = 'right', size = 'md', children }) {
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={cn('fixed inset-0 z-50', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
      <button
        type="button"
        className={cn('absolute inset-0 bg-black/40 transition-opacity', isOpen ? 'opacity-100' : 'opacity-0')}
        aria-label="Close drawer"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute inset-y-0 flex max-w-full flex-col bg-neutral-surface shadow-xl transition-transform duration-200',
          widths[size] ?? widths.md,
          position === 'left' ? 'left-0' : 'right-0',
          isOpen
            ? 'translate-x-0'
            : position === 'left'
              ? '-translate-x-full'
              : 'translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg"
          aria-label="Close drawer"
        >
          <XIcon className="h-4 w-4" />
        </button>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

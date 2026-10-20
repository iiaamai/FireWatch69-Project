import { cn } from '../utils/cn.js';

const sizes = {
  small: 'h-8 px-2.5 text-sm',
  md: 'h-9 px-3 text-sm',
  large: 'h-11 px-3.5 text-base',
};

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  startAdornment,
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-text">
          {label}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-neutral-text-muted">
            {startAdornment}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-md border bg-neutral-surface text-neutral-text placeholder:text-neutral-text-muted focus:outline-none focus:ring-2 disabled:bg-neutral-bg disabled:text-neutral-text-muted',
            error
              ? 'border-alert-critical-border focus:border-primary focus:ring-alert-critical-bg'
              : 'border-neutral-border focus:border-neutral-text-muted focus:ring-neutral-border',
            sizes[size] ?? sizes.md,
            startAdornment && 'pl-8',
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-alert-critical-text">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="mt-1 text-xs text-neutral-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

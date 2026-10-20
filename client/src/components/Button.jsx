import { cn } from '../utils/cn.js';

const variants = {
  primary: 'bg-neutral-active text-neutral-on-dark hover:bg-primary-shade-2',
  secondary: 'border border-neutral-border bg-neutral-surface text-neutral-text hover:bg-neutral-bg',
  tertiary: 'text-neutral-text-muted hover:bg-neutral-bg',
  destructive: 'bg-primary text-neutral-on-dark hover:bg-primary-shade-1',
};

const sizes = {
  small: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  large: 'h-11 px-4 text-base',
};

const iconSizes = {
  small: 'p-1.5',
  md: 'p-2',
  large: 'p-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  iconOnly,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
        iconOnly ? (iconSizes[size] ?? iconSizes.md) : (sizes[size] ?? sizes.md),
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        iconOnly ?? leftIcon
      )}
      {!iconOnly && children}
      {!iconOnly && !loading && rightIcon}
    </button>
  );
}

import { cn } from '../utils/cn.js';

export function Checkbox({
  label,
  checked = false,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}) {
  const box = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <label className={cn('inline-flex cursor-pointer items-start gap-2 text-sm text-neutral-text', className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={cn('mt-0.5 accent-neutral-active', box)}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

import { cn } from '../utils/cn.js';

export function Toggle({ checked = false, onChange, label, size = 'md', disabled = false }) {
  const track = size === 'small' ? 'h-5 w-9' : 'h-6 w-11';
  const knob = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-text">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border',
          track,
          checked ? 'bg-neutral-active' : 'bg-neutral-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 rounded-full bg-neutral-surface shadow transition-[left]',
            knob,
            checked ? 'right-0.5 left-auto' : 'left-0.5',
          )}
        />
      </button>
      {label}
    </label>
  );
}

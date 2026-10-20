import { cn } from '../utils/cn.js';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name = '', alt, src, size = 'md', status }) {
  return (
    <span className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          className={cn('rounded-full object-cover', sizes[size] ?? sizes.md)}
        />
      ) : (
        <span
          aria-label={alt ?? name}
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-neutral-active font-semibold text-neutral-on-dark',
            sizes[size] ?? sizes.md,
          )}
        >
          {initials(name) || '?'}
        </span>
      )}
      {status === 'online' && (
        <span
          className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-neutral-active"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export function AvatarGroup({ avatars = [], max = 3, size = 'xs' }) {
  const shown = avatars.slice(0, max);
  const extra = avatars.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((avatar, index) => (
        <Avatar key={`${avatar.name}-${index}`} {...avatar} size={size} />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full border border-white bg-neutral-border font-mono text-[10px] font-semibold text-neutral-text-muted',
            sizes[size] ?? sizes.xs,
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

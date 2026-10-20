import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../utils/cn.js';

export function Select({
  label,
  required,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Select…',
  multiple = false,
  searchable = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : value;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => String(opt.label).toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabels = multiple
    ? options.filter((opt) => selectedValues.includes(opt.value)).map((opt) => opt.label)
    : options.find((opt) => opt.value === value)?.label;

  const toggle = (next) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const updated = current.includes(next)
        ? current.filter((item) => item !== next)
        : [...current, next];
      onChange?.(updated);
    } else {
      onChange?.(next);
      setOpen(false);
    }
  };

  return (
    <div className="w-full" ref={rootRef}>
      {label && (
        <p className="mb-1 text-sm font-medium text-neutral-text">
          {label}
          {required ? <span className="text-primary"> *</span> : null}
        </p>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-neutral-surface px-2.5 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border disabled:bg-neutral-bg',
          error ? 'border-alert-critical-border' : 'border-neutral-border',
          !selectedLabels || (multiple && !selectedLabels.length) ? 'text-neutral-text-muted' : 'text-neutral-text',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">
          {multiple
            ? selectedLabels.length
              ? selectedLabels.join(', ')
              : placeholder
            : selectedLabels ?? placeholder}
        </span>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-neutral-text-muted" />
      </button>
      {open && (
        <div className="relative z-30">
          <div className="absolute mt-1 w-full overflow-hidden rounded-md border border-neutral-border bg-neutral-surface shadow-lg">
            {searchable && (
              <div className="flex items-center gap-2 border-b border-neutral-border px-2 py-1.5">
                <SearchIcon className="h-3.5 w-3.5 text-neutral-text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Search"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                    <XIcon className="h-3.5 w-3.5 text-neutral-text-muted" />
                  </button>
                )}
              </div>
            )}
            <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
              {filtered.length ? (
                filtered.map((opt) => {
                  const selected = multiple
                    ? selectedValues.includes(opt.value)
                    : value === opt.value;
                  return (
                    <li key={String(opt.value)}>
                      <button
                        type="button"
                        onClick={() => toggle(opt.value)}
                        className={cn(
                          'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-bg',
                          selected && 'bg-neutral-bg font-medium',
                        )}
                      >
                        {opt.label}
                        {selected && <CheckIcon className="h-3.5 w-3.5" />}
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-2 text-sm text-neutral-text-muted">No options</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-alert-critical-text">{error}</p>}
    </div>
  );
}

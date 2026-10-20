import { createContext, useContext, useState } from 'react';
import { cn } from '../utils/cn.js';

const TabsContext = createContext(null);

export function Tabs({ defaultTab, children, variant = 'underlined' }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within Tabs');
  return ctx;
}

export function TabList({ children, className = '' }) {
  const { variant } = useTabs();
  return (
    <div
      role="tablist"
      className={cn(
        'flex flex-wrap gap-1',
        variant === 'underlined' ? 'border-b border-neutral-border gap-4' : '',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tab({ id, children, badge }) {
  const { active, setActive, variant } = useTabs();
  const isActive = active === id;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(id)}
      className={cn(
        'inline-flex items-center gap-1.5 px-0.5 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border',
        variant === 'underlined'
          ? isActive
            ? 'border-b-2 border-neutral-active text-neutral-text'
            : 'border-b-2 border-transparent text-neutral-text-muted hover:text-neutral-text'
          : isActive
            ? 'rounded-md bg-neutral-active px-2.5 text-neutral-on-dark'
            : 'rounded-md px-2.5 text-neutral-text-muted hover:bg-neutral-bg',
      )}
    >
      {children}
      {badge}
    </button>
  );
}

export function TabPanel({ id, children, className = '' }) {
  const { active } = useTabs();
  if (active !== id) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

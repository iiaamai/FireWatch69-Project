import { cn } from '../utils/cn.js';

export function Card({ children, className = '' }) {
  return <div className={cn('panel', className)}>{children}</div>;
}

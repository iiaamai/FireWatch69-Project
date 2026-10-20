import { NavLink } from 'react-router-dom';
import { ChevronsLeftIcon, ChevronsRightIcon, LogOutIcon } from 'lucide-react';
import { Avatar } from '../Avatar.jsx';
import { ErrsLogo } from './ErrsLogo.jsx';
import { navItems } from '../../data/navigation.js';
import { useAppData } from '../../contexts/AppDataContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { isActiveIncident } from '../../utils/status.js';

const groups = ['Operations', 'Resources', 'Insights', 'System'];

export function Sidebar({ collapsed, onToggleCollapse, onNavigate }) {
  const { incidents, unreadCount, currentUser } = useAppData();
  const { signOut } = useAuth();
  const activeCount = incidents.filter((i) => isActiveIncident(i.status)).length;

  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col bg-neutral-surface">
      <div className={`flex h-16 items-center border-b border-neutral-border ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        <ErrsLogo collapsed={collapsed} />
        {onToggleCollapse && !collapsed && (
          <button type="button" onClick={onToggleCollapse} className="rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border" aria-label="Collapse sidebar">
            <ChevronsLeftIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            {!collapsed ? <p className="eyebrow mb-1.5 px-2.5">{group}</p> : <div className="mx-auto mb-2 h-px w-6 bg-neutral-border" />}
            <ul className="space-y-0.5">
              {navItems
                .filter((n) => n.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const badge = item.badge === 'activeIncidents' ? activeCount : item.badge === 'unread' ? unreadCount : 0;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          `relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border ${
                            collapsed ? 'justify-center' : ''
                          } ${isActive ? 'bg-neutral-active text-neutral-on-dark' : 'text-neutral-text-muted hover:bg-neutral-bg'}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                            {badge > 0 &&
                              (collapsed ? (
                                <span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${item.badge === 'activeIncidents' ? 'bg-primary' : 'bg-neutral-bg0'}`} aria-label={`${badge} items`} />
                              ) : (
                                <span
                                  className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                                    item.badge === 'activeIncidents' ? 'bg-primary text-neutral-on-dark' : isActive ? 'bg-neutral-on-dark/20 text-neutral-on-dark' : 'bg-neutral-border text-neutral-text-muted'
                                  }`}
                                >
                                  {badge}
                                </span>
                              ))}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-md border border-neutral-border bg-neutral-bg px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-text">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-surface0 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-active" />
              </span>
              All systems online
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-neutral-text-muted">GPS feed live · Hotline linked</p>
          </div>
        )}
        <div className={`flex items-center gap-2.5 ${collapsed ? 'flex-col' : ''}`}>
          <Avatar name={currentUser.name} alt={currentUser.name} src={currentUser.avatar} size="sm" status="online" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-text">{currentUser.name}</p>
              <p className="truncate text-xs text-neutral-text-muted">{currentUser.role}</p>
            </div>
          )}
          <button type="button" onClick={signOut} className="rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border" aria-label="Sign out">
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
        {collapsed && onToggleCollapse && (
          <button type="button" onClick={onToggleCollapse} className="mx-auto mt-3 flex rounded-md p-1.5 text-neutral-text-muted hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border" aria-label="Expand sidebar">
            <ChevronsRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
}

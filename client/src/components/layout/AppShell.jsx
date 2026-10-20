import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { Drawer } from '../Drawer.jsx';

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-canvas">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-neutral-border transition-[width] duration-200 lg:block ${collapsed ? 'w-[72px]' : 'w-[248px]'}`}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      </aside>
      <Drawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} position="left" size="sm">
        <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
      <div className={`flex min-h-screen flex-col transition-[padding] duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[248px]'}`}>
        <TopBar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

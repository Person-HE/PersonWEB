import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PenTool } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/useGsap';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/resources', label: '资源中心' },
  { path: '/navigation', label: 'AI导航' },
  { path: '/services', label: '服务中心' },
  { path: '/enterprise', label: '企业服务' },
  { path: '/about', label: '关于' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const logoRef = useMagnetic<HTMLAnchorElement>(0.2);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[var(--ink)] bg-[var(--paper)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          ref={logoRef}
          className="flex items-center gap-2 font-hand-title"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--crimson)] shadow-[2px_2px_0_var(--ink)]">
            <PenTool className="h-5 w-5 text-[var(--paper-light)]" />
          </div>
          <span className="text-lg font-bold text-[var(--ink)]">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-hand-title transition-all',
                isActive(item.path)
                  ? 'bg-[var(--mustard)] border-2 border-[var(--ink)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-[var(--ink)] bg-[var(--paper-light)] p-2 text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] md:hidden"
          aria-label="菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-hand-title transition-all',
                  isActive(item.path)
                    ? 'bg-[var(--mustard)] border-2 border-[var(--ink)] text-[var(--ink)]'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--paper-deep)]',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

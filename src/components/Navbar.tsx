import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/useGsap';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/portfolio', label: '作品集' },
  { path: '/services', label: '服务' },
  { path: '/resources', label: '资源' },
  { path: '/navigation', label: 'AI导航' },
  { path: '/blog', label: '博客' },
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[var(--ink)] bg-[var(--bg)]/90 backdrop-blur-md">
      {/* 顶部细线：终端风格强调色 */}
      <div className="h-0.5 w-full bg-[var(--accent)]" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo：终端 prompt 风格 */}
        <Link
          to="/"
          ref={logoRef}
          className="flex items-center gap-2 font-display"
        >
          <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--ink)] bg-[var(--accent)] shadow-[2px_2px_0_var(--ink)]">
            <Terminal className="h-5 w-5 text-[var(--bg)]" />
          </div>
          <span className="text-lg font-bold tracking-wide text-[var(--ink)]">
            <span className="text-[var(--accent)]">{'>'}</span>
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav：等宽字体，终端菜单风格 */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'border-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all',
                  active
                    ? 'border-[var(--ink)] bg-[var(--accent)] text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]'
                    : 'border-transparent text-[var(--ink-soft)] hover:border-[var(--ink-mute)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]',
                )}
              >
                <span className={active ? 'text-[var(--bg)]' : 'text-[var(--accent)]'}>{'>'}</span>
                {' '}
                {item.label}
              </Link>
            );
          })}
          {/* 转化 CTA：与菜单项区分 */}
          <Link
            to="/contact"
            className="ml-2 border-2 border-[var(--ink)] bg-[var(--accent-alt)] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[var(--bg)] shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            获取报价
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="border-2 border-[var(--ink)] bg-[var(--bg-elevated)] p-2 text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)] md:hidden"
          aria-label="菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu：终端下拉面板 */}
      {open && (
        <div className="border-t-2 border-[var(--ink)] bg-[var(--bg)] md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block border-2 px-3 py-2 font-mono text-xs uppercase tracking-wider transition-all',
                    active
                      ? 'border-[var(--ink)] bg-[var(--accent)] text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]'
                      : 'border-[var(--ink-mute)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--accent)]',
                  )}
                >
                  <span className="text-[var(--accent)]">{'>'}</span> {item.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block border-2 border-[var(--ink)] bg-[var(--accent-alt)] px-3 py-2 text-center font-mono text-xs uppercase tracking-wider text-[var(--bg)] shadow-[2px_2px_0_var(--ink)]"
            >
              获取报价
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

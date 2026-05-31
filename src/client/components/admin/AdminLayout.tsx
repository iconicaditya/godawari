"use client";
import { useState, useEffect, ReactNode } from 'react';
import { Link, NavLink, useLocation } from '@/client/next-router';
import { useSession } from '@/client/lib/localData';
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Star,
  Quote,
  Mail,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  ExternalLink,
} from 'lucide-react';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/plants', icon: Sprout, label: 'Plants' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/testimonials', icon: Quote, label: 'Testimonials' },
  { to: '/admin/subscribers', icon: Mail, label: 'Subscribers' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

export function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useSession();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-forest font-sans">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-forest-deep/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-forest-deep text-cream transition-transform duration-500 ease-luxe lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-7 py-7 border-b border-cream/10 flex items-center justify-between">
            <Link to="/admin" className="flex flex-col">
              <span className="font-display text-2xl tracking-tight text-cream leading-none">Godawari</span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold mt-1">Admin Console</span>
            </Link>
            <button
              className="lg:hidden text-cream/80"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/40 px-3 mb-3">Manage</p>
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-all duration-300 group ${
                    isActive
                      ? 'bg-gold/15 text-gold border-l-2 border-gold pl-[10px]'
                      : 'text-cream/70 hover:text-cream hover:bg-cream/5 border-l-2 border-transparent'
                  }`
                }
              >
                <n.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <span>{n.label}</span>
              </NavLink>
            ))}

            <div className="pt-6 mt-6 border-t border-cream/10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-cream/40 px-3 mb-3">Shortcuts</p>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-cream/5 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <ExternalLink className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  View Storefront
                </span>
              </a>
              <Link
                to="/signOut"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/70 hover:text-terracotta transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
                Sign Out
              </Link>
            </div>
          </nav>

          {/* User card */}
          <div className="px-5 py-5 border-t border-cream/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/40 to-terracotta/40 flex items-center justify-center font-display text-cream">
                {(user?.handle ?? 'A').slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cream truncate">{user?.handle}</p>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#f6f4ee]/90 backdrop-blur border-b border-stone/40">
          <div className="flex items-center justify-between px-5 md:px-10 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 text-forest"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-forest/50">
                <span>Console</span>
                <span>/</span>
                <span className="text-forest">{title ?? 'Dashboard'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-stone/60 rounded-full bg-ivory/60">
                <Search className="w-3.5 h-3.5 text-forest/50" />
                <input
                  type="text"
                  placeholder="Quick search…"
                  className="bg-transparent text-xs outline-none placeholder:text-forest/40 w-44"
                />
              </div>
              <button className="p-2 text-forest/70 hover:text-forest hover:bg-cream rounded-full transition-colors">
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <div className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-stone/60">
                <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-display">
                  {(user?.handle ?? 'A').slice(0, 1).toUpperCase()}
                </div>
                <ChevronDown className="w-3 h-3 text-forest/50" />
              </div>
            </div>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="px-5 md:px-10 pt-10 pb-2">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div className="animate-fade-up">
                {subtitle && (
                  <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3">{subtitle}</p>
                )}
                <h1 className="font-display text-4xl md:text-5xl text-forest leading-none">{title}</h1>
              </div>
              {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
            </div>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-stone via-stone/40 to-transparent" />
          </div>
        )}

        <main className="px-5 md:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}



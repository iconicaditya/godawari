"use client";
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from '@/client/next-router';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/client/hooks/useCart';
import { useSession } from '@/client/lib/localData';

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=indoor', label: 'Indoor' },
  { to: '/shop?category=flowering', label: 'Flowering' },
  { to: '/shop?category=succulent', label: 'Succulents' },
  { to: '/shop?category=bonsai', label: 'Bonsai' },
  { to: '/care-guide', label: 'Care Guide' },
  { to: '/about', label: 'Our Story' },
  { to: '/locations', label: 'Visit Us' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useSession();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-forest-deep text-cream text-[11px] tracking-[0.3em] uppercase py-2.5 text-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="mx-8">Complimentary delivery within Kathmandu Valley above Rs. 5,000</span>
          <span className="mx-8 text-gold">✦</span>
          <span className="mx-8">New Spring Arrivals — Phalaenopsis & Meyer Lemon</span>
          <span className="mx-8 text-gold">✦</span>
          <span className="mx-8">Free care guide with every order</span>
          <span className="mx-8 text-gold">✦</span>
          <span className="mx-8">Complimentary delivery within Kathmandu Valley above Rs. 5,000</span>
          <span className="mx-8 text-gold">✦</span>
          <span className="mx-8">New Spring Arrivals — Phalaenopsis & Meyer Lemon</span>
          <span className="mx-8 text-gold">✦</span>
          <span className="mx-8">Free care guide with every order</span>
          <span className="mx-8 text-gold">✦</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-ivory/95 backdrop-blur-sm shadow-[0_1px_0_rgba(31,58,46,0.08)]' : 'bg-ivory'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-20">
            <button
              className="lg:hidden text-forest p-2 -ml-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Logo className="lg:flex-1" />

            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              {NAV.slice(0, 6).map((n) => (
                <NavLink
                  key={n.to + n.label}
                  to={n.to}
                  className={({ isActive }) =>
                    `text-[11px] tracking-[0.25em] uppercase font-medium link-underline transition-colors ${
                      isActive ? 'text-forest' : 'text-charcoal/70 hover:text-forest'
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 lg:flex-1 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-forest hover:bg-cream rounded-full transition-colors duration-300"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <Link
                to={user ? '/account' : '/login'}
                aria-label="Account"
                className="p-2 text-forest hover:bg-cream rounded-full transition-colors duration-300 hidden sm:inline-flex"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="p-2 text-forest hover:bg-cream rounded-full transition-colors duration-300 hidden sm:inline-flex"
              >
                <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                aria-label="Cart"
                className="p-2 text-forest hover:bg-cream rounded-full transition-colors duration-300 relative"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-cream text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-forest-deep/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-ivory shadow-2xl transition-transform duration-700 ease-luxe ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-stone/60">
            <Logo />
            <button onClick={() => setMenuOpen(false)} className="p-2 text-forest" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-6 space-y-1">
            {NAV.map((n, i) => (
              <Link
                key={n.to + n.label}
                to={n.to}
                className="block py-3 font-display text-2xl text-forest hover:text-terracotta transition-colors duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-6 mt-6 border-t border-stone/60 space-y-2 text-sm">
              <Link to={user ? '/account' : '/login'} className="block py-2 tracking-widest uppercase text-xs">
                {user ? 'My Account' : 'Sign In'}
              </Link>
              <Link to="/wishlist" className="block py-2 tracking-widest uppercase text-xs">Wishlist</Link>
              <Link to="/contact" className="block py-2 tracking-widest uppercase text-xs">Contact</Link>
            </div>
          </nav>
        </aside>
      </div>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-forest-deep/50 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
        <div className="relative bg-ivory animate-fade-down">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs tracking-[0.3em] uppercase text-forest">Search the Greenhouse</span>
              <button onClick={() => setSearchOpen(false)} className="p-2" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SearchInline onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}

function SearchInline({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          window.location.href = `/shop?search=${encodeURIComponent(q.trim())}`;
          onClose();
        }
      }}
    >
      <div className="border-b border-forest/30 pb-3 flex items-center gap-3">
        <Search className="w-5 h-5 text-forest/60" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search plants, herbs, accessories…"
          className="flex-1 bg-transparent outline-none font-display text-2xl md:text-3xl placeholder:text-forest/30 text-forest"
        />
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {['Monstera', 'Bonsai', 'Orchid', 'Succulents', 'Pothos', 'Lemon Tree', 'Rosemary', 'Snake Plant'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              window.location.href = `/shop?search=${encodeURIComponent(s)}`;
              onClose();
            }}
            className="text-left text-forest/70 hover:text-terracotta link-underline tracking-wide"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}



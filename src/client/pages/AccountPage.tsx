"use client";
import { Link } from '@/client/next-router';
import { useSession } from '@/client/lib/localData';
import { User, Heart, Package, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';

export default function AccountPage() {
  const { user } = useSession();
  const isAdmin = !!user?.hasRole('admin');

  return (
    <Layout>
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 animate-fade-down">Your Account</p>
          <h1 className="font-display text-5xl md:text-6xl text-forest animate-fade-up">Welcome back.</h1>
          {user && <p className="text-forest/60 mt-4 animate-fade-up">{user.handle}</p>}
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="block bg-forest text-cream p-8 mb-10 group hover:bg-forest-deep transition-colors animate-fade-up"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-7 h-7 text-gold" strokeWidth={1.2} />
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-1">Administrator</p>
                  <h3 className="font-display text-2xl">Open the Admin Console</h3>
                </div>
              </div>
              <span className="text-[11px] tracking-[0.3em] uppercase opacity-70 group-hover:translate-x-1 transition-transform">
                Enter →
              </span>
            </div>
          </Link>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Package, title: 'Orders', desc: 'View past and pending orders', to: '/account' },
            { Icon: Heart, title: 'Wishlist', desc: 'Saved plants for later', to: '/wishlist' },
            { Icon: MapPin, title: 'Addresses', desc: 'Delivery destinations', to: '/account' },
            { Icon: User, title: 'Details', desc: 'Profile and preferences', to: '/account' },
          ].map((c, i) => (
            <Link
              key={c.title}
              to={c.to}
              className="border border-stone/80 hover:border-forest p-8 transition-colors duration-500 group animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <c.Icon className="w-7 h-7 text-gold mb-5" strokeWidth={1.2} />
              <h3 className="font-display text-2xl text-forest mb-2">{c.title}</h3>
              <p className="text-sm text-forest/60">{c.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/signOut" className="inline-flex items-center gap-2 link-underline text-[11px] tracking-[0.3em] uppercase text-forest/70 hover:text-terracotta">
            <LogOut className="w-3 h-3" /> Sign Out
          </Link>
        </div>
      </section>
    </Layout>
  );
}



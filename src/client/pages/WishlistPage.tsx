"use client";
import { Link } from '@/client/next-router';
import { Heart } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function WishlistPage() {
  return (
    <Layout>
      <section className="max-w-2xl mx-auto px-6 py-32 text-center">
        <Heart className="w-12 h-12 text-gold mx-auto mb-8 animate-sway" strokeWidth={1.2} />
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">Your Wishlist</p>
        <h1 className="font-display text-5xl md:text-6xl text-forest leading-[1.05] mb-6">
          A garden of intentions.
        </h1>
        <p className="text-forest/70 mb-10 leading-relaxed">
          Sign in to save plants for later — across visits, devices, and seasons.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login"><BotanicalButton size="lg">Sign In</BotanicalButton></Link>
          <Link to="/shop"><BotanicalButton variant="outline" size="lg">Browse Plants</BotanicalButton></Link>
        </div>
      </section>
    </Layout>
  );
}



"use client";
import { Link } from '@/client/next-router';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function NotFoundPage() {
  return (
    <Layout>
      <section className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="font-display text-[10rem] md:text-[14rem] leading-none text-forest/20 -tracking-[0.05em]">404</p>
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 -mt-8">Lost in the Greenhouse</p>
        <h1 className="font-display text-5xl md:text-6xl text-forest mb-6 leading-[1.05]">A leaf out of place.</h1>
        <p className="text-forest/70 mb-10 leading-relaxed">The page you sought no longer grows here. Let us walk you back to the gate.</p>
        <Link to="/"><BotanicalButton size="lg">Return Home</BotanicalButton></Link>
      </section>
    </Layout>
  );
}



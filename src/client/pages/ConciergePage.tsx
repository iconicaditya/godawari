"use client";
import { Link } from '@/client/next-router';
import { ArrowRight, Calendar, MessageCircle, Home } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function ConciergePage() {
  return (
    <Layout>
      <section className="relative h-[70vh] min-h-[480px]">
        <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=2400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-cream px-6">
          <div className="animate-fade-up-slow max-w-3xl">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">Concierge</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] mb-6">Personal botanical service.</h1>
            <p className="text-lg md:text-xl text-cream/80 leading-relaxed">
              From a single windowsill to a complete terrace garden — our concierge plans, sources, delivers, and tends.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { Icon: MessageCircle, title: 'Consultation', body: 'A 30-minute call with a senior cultivator. We discuss your space, your light, your aesthetic, and your patience.', cta: 'Book a Call' },
            { Icon: Home, title: 'Home Visit', body: 'Within Kathmandu Valley, we visit your space — measuring light, recommending species, and planning placement.', cta: 'Request a Visit' },
            { Icon: Calendar, title: 'Care Plan', body: 'A monthly maintenance subscription — pruning, repotting, and seasonal care in your home.', cta: 'Subscribe' },
          ].map((c, i) => (
            <article key={c.title} className="border border-stone/80 hover:border-forest p-10 text-center transition-colors duration-500 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <c.Icon className="w-9 h-9 text-gold mx-auto mb-6" strokeWidth={1.2} />
              <h3 className="font-display text-3xl text-forest mb-4">{c.title}</h3>
              <p className="text-forest/70 text-sm leading-relaxed mb-8">{c.body}</p>
              <Link to="/contact"><BotanicalButton variant="outline" size="sm">{c.cta}<ArrowRight className="w-3 h-3" /></BotanicalButton></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-forest-deep text-cream py-20 text-center px-6">
        <h2 className="font-display text-5xl mb-6">Begin a conversation.</h2>
        <p className="text-cream/70 max-w-md mx-auto mb-10">Tell us a little about your space, and we will be in touch within two working days.</p>
        <Link to="/contact"><BotanicalButton variant="inverse" size="lg">Write to Concierge<ArrowRight className="w-4 h-4" /></BotanicalButton></Link>
      </section>
    </Layout>
  );
}



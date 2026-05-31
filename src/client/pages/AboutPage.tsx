"use client";
import { Link } from '@/client/next-router';
import { ArrowRight, Leaf } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px]">
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=2400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-cream px-6">
          <div className="max-w-3xl animate-fade-up-slow">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-6">Our Story</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] mb-6">Cultivated since 1984.</h1>
            <p className="text-lg md:text-xl text-cream/80 leading-relaxed">
              From a single greenhouse on the slopes of Godawari, three generations of growers have raised
              plants for the gardens, terraces, and quiet rooms of Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-6">A Quiet Beginning</p>
        <p className="font-display text-2xl md:text-3xl leading-[1.4] text-forest italic">
          "We do not sell plants. We pass them on — slowly, deliberately, like books we have loved."
        </p>
        <p className="mt-6 text-sm tracking-widest uppercase text-forest/50">— Krishna Maharjan, Founder</p>
      </section>

      {/* Story timeline */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {[
              { year: '1984', title: 'A single greenhouse.', body: 'Krishna Maharjan plants his first orchids in a borrowed plot in Godawari, Lalitpur. Word travels by foot.' },
              { year: '1996', title: 'The conservatory.', body: 'A second-generation glass house is built. The first bonsai are trained — Ficus, then Juniper.' },
              { year: '2009', title: 'Patan Boutique.', body: 'A small storefront opens beside the durbar square — bringing greenery to the heart of the old city.' },
              { year: '2018', title: 'Sustainability pledge.', body: 'We commit to peat-free substrate, biodegradable pots, and pesticide-free cultivation.' },
              { year: '2022', title: 'Online journal.', body: 'The Conservatory journal launches — letters from our cultivators, sent quarterly.' },
              { year: 'Today', title: 'Three hundred species.', body: 'Across two greenhouses and three boutiques, we tend to over three hundred living species.' },
            ].map((m, i) => (
              <article key={m.year} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="font-display text-5xl text-gold mb-3">{m.year}</p>
                <h3 className="font-display text-2xl text-forest mb-3">{m.title}</h3>
                <p className="text-forest/70 leading-relaxed">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">Our Practice</p>
          <h2 className="font-display text-5xl md:text-6xl text-forest">A quieter way to grow.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: 'Slow Cultivation', body: 'Each species is allowed its own pace — no forced flowering, no chemical acceleration.' },
            { title: 'Local Seedstock', body: 'Where possible, we propagate from heritage Godawari and Himalayan parent plants.' },
            { title: 'Hand Inspection', body: 'Every plant leaving our greenhouse is inspected by a single grower — leaf by leaf.' },
          ].map((v, i) => (
            <div key={v.title} className="text-center animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
              <Leaf className="w-8 h-8 text-gold mx-auto mb-5" strokeWidth={1.2} />
              <h3 className="font-display text-2xl text-forest mb-4">{v.title}</h3>
              <p className="text-forest/70 leading-relaxed text-sm">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team image collage */}
      <section className="grid md:grid-cols-3">
        <div className="aspect-[4/5] img-zoom"><img src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=1200&q=80" alt="" className="w-full h-full object-cover" /></div>
        <div className="aspect-[4/5] img-zoom"><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80" alt="" className="w-full h-full object-cover" /></div>
        <div className="aspect-[4/5] img-zoom"><img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80" alt="" className="w-full h-full object-cover" /></div>
      </section>

      {/* CTA */}
      <section className="bg-forest-deep text-cream py-24 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">Visit Us</p>
        <h2 className="font-display text-5xl md:text-6xl mb-6">Step into the greenhouse.</h2>
        <p className="text-cream/70 max-w-md mx-auto mb-10 leading-relaxed">
          Our Godawari flagship is open to visitors — a quiet hour among living things.
        </p>
        <Link to="/locations">
          <BotanicalButton variant="inverse" size="lg">Plan Your Visit<ArrowRight className="w-4 h-4" /></BotanicalButton>
        </Link>
      </section>
    </Layout>
  );
}



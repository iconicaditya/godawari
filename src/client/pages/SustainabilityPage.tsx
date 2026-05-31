"use client";
import { Layout } from '@/client/components/nursery/Layout';
import { Leaf, Recycle, Droplets, Sprout } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <Layout>
      <section className="relative h-[70vh] min-h-[480px]">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=2400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-cream px-6">
          <div className="animate-fade-up-slow max-w-3xl">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">Sustainability</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] mb-6">A quieter way to nursery.</h1>
            <p className="text-lg text-cream/80 leading-relaxed">
              We commit to a future where everyone — and every soil — can enjoy the same plant quality.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-display text-2xl md:text-3xl italic leading-[1.5] text-forest">
          "What we take from the soil, we owe to the soil."
        </p>
        <p className="mt-6 text-sm tracking-widest uppercase text-forest/50">— Our pledge, since 2018</p>
      </section>

      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-10">
          {[
            { Icon: Leaf, title: 'Peat-Free Substrate', body: 'We use coir, composted bark, and Godawari leaf-mould — never peat. Our standard mix has been peat-free since 2018.' },
            { Icon: Recycle, title: 'Biodegradable Pots', body: 'Nursery pots are crafted from rice husk and natural binders — they break down in soil over 12–18 months.' },
            { Icon: Droplets, title: 'Rain-Fed Irrigation', body: 'Our flagship greenhouse harvests monsoon rain in two underground cisterns, irrigating 80% of stock through the dry season.' },
            { Icon: Sprout, title: 'No Synthetic Pesticides', body: 'We use neem extracts, predatory insects, and integrated pest management — never synthetic chemistry.' },
          ].map((p, i) => (
            <article key={p.title} className="bg-ivory p-10 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p.Icon className="w-9 h-9 text-gold mb-6" strokeWidth={1.2} />
              <h3 className="font-display text-3xl text-forest mb-4">{p.title}</h3>
              <p className="text-forest/70 leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">By the Numbers</p>
        <h2 className="font-display text-4xl md:text-5xl text-forest mb-16">Our 2024 footprint.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '0%', label: 'Peat in our substrate' },
            { num: '80%', label: 'Rainwater irrigation' },
            { num: '14,000', label: 'Plants raised in 2024' },
            { num: '40+', label: 'Years cultivating' },
          ].map((s, i) => (
            <div key={s.label} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="font-display text-6xl text-gold mb-2">{s.num}</p>
              <p className="text-xs tracking-widest uppercase text-forest/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}


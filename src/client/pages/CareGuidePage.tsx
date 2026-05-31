"use client";
import { Link } from '@/client/next-router';
import { Sun, Droplets, Leaf, Sprout, ArrowRight } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

const ARTICLES = [
  {
    cat: 'Light',
    title: 'Reading the light in your home.',
    excerpt: 'A practical guide to identifying north, east, south, and west exposures — and matching them to species.',
    img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=1000&q=80',
    minutes: 6,
  },
  {
    cat: 'Water',
    title: 'How to water (without overwatering).',
    excerpt: 'The two-knuckle test, the lift-the-pot test, and three rules for the dry winter months.',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&q=80',
    minutes: 8,
  },
  {
    cat: 'Soil',
    title: 'A primer on potting mixes.',
    excerpt: 'Why peat-free matters, how to amend coir for tropicals, and our house succulent blend.',
    img: 'https://images.unsplash.com/photo-1599598425947-5fbc56e3d59f?w=1000&q=80',
    minutes: 7,
  },
  {
    cat: 'Pruning',
    title: 'When to prune (and when to leave alone).',
    excerpt: 'A seasonal calendar for indoor and outdoor species, with a short note on bonsai.',
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1000&q=80',
    minutes: 5,
  },
  {
    cat: 'Repotting',
    title: 'Repotting, season by season.',
    excerpt: 'How to know when, what pot to choose, and how to ease the transition.',
    img: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=1000&q=80',
    minutes: 9,
  },
  {
    cat: 'Pests',
    title: 'A gentle approach to pests.',
    excerpt: 'Identifying mealybugs, scale, and spider mites — and treating them without harsh chemistry.',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&q=80',
    minutes: 7,
  },
];

export default function CareGuidePage() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[440px]">
        <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=2400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-cream px-6">
          <div className="animate-fade-up-slow">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">The Care Almanac</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">Tend slowly.</h1>
            <p className="mt-6 text-cream/80 max-w-xl mx-auto leading-relaxed">
              Practical, seasonal guides written by our cultivators. No jargon — just attentive, patient care.
            </p>
          </div>
        </div>
      </section>

      {/* Quick reference cards */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid md:grid-cols-4 gap-6">
        {[
          { Icon: Sun, label: 'Light' },
          { Icon: Droplets, label: 'Water' },
          { Icon: Leaf, label: 'Soil' },
          { Icon: Sprout, label: 'Repotting' },
        ].map(({ Icon, label }, i) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="border border-stone/80 hover:border-forest p-8 text-center transition-colors duration-500 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Icon className="w-8 h-8 text-gold mx-auto mb-4" strokeWidth={1.2} />
            <p className="font-display text-xl text-forest">{label}</p>
          </a>
        ))}
      </section>

      {/* Articles */}
      <section className="bg-cream py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <h2 className="font-display text-4xl md:text-5xl text-forest mb-12 text-center">Articles & Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((a, i) => (
              <article key={a.title} className="group bg-ivory animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="img-zoom aspect-[4/3] overflow-hidden">
                  <img src={a.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{a.cat} · {a.minutes} min read</p>
                  <h3 className="font-display text-2xl text-forest mb-3 leading-tight group-hover:text-terracotta transition-colors">{a.title}</h3>
                  <p className="text-forest/70 text-sm leading-relaxed mb-4">{a.excerpt}</p>
                  <span className="link-underline text-[11px] tracking-[0.3em] uppercase text-forest">Read Article</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">Need More?</p>
        <h2 className="font-display text-4xl md:text-5xl text-forest mb-6">Speak to a cultivator.</h2>
        <p className="text-forest/70 mb-10 leading-relaxed">
          For complex spaces, troubled plants, or the simple pleasure of advice — our concierge is here.
        </p>
        <Link to="/concierge">
          <BotanicalButton size="lg">Book a Concierge Call<ArrowRight className="w-4 h-4" /></BotanicalButton>
        </Link>
      </section>
    </Layout>
  );
}



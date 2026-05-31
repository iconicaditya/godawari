"use client";
import { useEffect, useState } from 'react';
import { Link } from '@/client/next-router';
import { useQuery } from '@tanstack/react-query';
import { localQuery } from '@/client/lib/localData';
import { ArrowRight, Leaf, Sprout, Sun, Truck, ShieldCheck, Award } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { ProductCard, type Plant } from '@/client/components/nursery/ProductCard';
import { BotanicalButton } from '@/client/components/nursery/Button';
import { SectionHeading } from '@/client/components/nursery/SectionHeading';
import { formatPrice } from '@/client/lib/format';

const HEROES = [
  {
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=2000&q=80',
    eyebrow: 'A Sip of Spring',
    title: 'A garden\nof quiet grace.',
    body: 'Heritage plants, raised slowly on the slopes of Godawari, delivered to your home with intention.',
    cta: 'Shop the Collection',
    href: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=2000&q=80',
    eyebrow: 'The Spring Edit',
    title: 'In bloom,\nin season.',
    body: 'Phalaenopsis orchids, Damask roses, and the year\'s first Meyer lemons — newly arrived in our greenhouses.',
    cta: 'Discover Spring',
    href: '/shop?new=true',
  },
  {
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=2000&q=80',
    eyebrow: 'For the Collector',
    title: 'A canopy\nof character.',
    body: 'Ficus bonsai aged seven years, pruned by hand. Each piece a single, unrepeatable composition.',
    cta: 'View Bonsai',
    href: '/shop?category=bonsai',
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HEROES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const { data: featured = [] } = useQuery(
    localQuery<Plant[]>('nursery.listPlants', { featured: true, limit: 8 })
  );
  const { data: newArrivals = [] } = useQuery(
    localQuery<Plant[]>('nursery.listPlants', { newArrival: true, limit: 4 })
  );
  const { data: bestsellers = [] } = useQuery(
    localQuery<Plant[]>('nursery.listPlants', { bestseller: true, limit: 4 })
  );
  const { data: testimonials = [] } = useQuery(
    localQuery<{ _id: string; name: string; location: string; quote: string; rating: number }[]>(
      'nursery.listTestimonials',
      {}
    )
  );

  return (
    <Layout>
      {/* HERO carousel */}
      <section className="relative h-[88vh] min-h-[640px] overflow-hidden">
        {HEROES.map((h, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ${
              i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={h.image}
              alt=""
              className={`w-full h-full object-cover ${i === slide ? 'animate-kenburns' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/65 via-forest-deep/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10">
                <div className={`max-w-2xl text-cream ${i === slide ? 'animate-fade-up-slow' : 'opacity-0'}`}>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-6">{h.eyebrow}</p>
                  <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.95] whitespace-pre-line mb-8">
                    {h.title}
                  </h1>
                  <p className="text-lg md:text-xl text-cream/80 leading-relaxed mb-10 max-w-lg">{h.body}</p>
                  <Link to={h.href}>
                    <BotanicalButton variant="inverse" size="lg">
                      {h.cta}
                      <ArrowRight className="w-4 h-4" />
                    </BotanicalButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-10">
          {HEROES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-px transition-all duration-700 ease-luxe ${
                i === slide ? 'w-16 bg-cream' : 'w-8 bg-cream/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-stone/60">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {[
            { Icon: Truck, label: 'Same-Day Delivery', sub: 'Within Kathmandu Valley' },
            { Icon: ShieldCheck, label: 'Healthy Arrival', sub: '14-day plant guarantee' },
            { Icon: Award, label: '40+ Years', sub: 'Cultivated since 1984' },
            { Icon: Leaf, label: 'Curated Catalogue', sub: '300+ heritage species' },
          ].map(({ Icon, label, sub }, i) => (
            <div key={label} className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <Icon className="w-7 h-7 text-gold flex-shrink-0" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-medium text-forest tracking-wide">{label}</p>
                <p className="text-xs text-forest/60 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <SectionHeading
          eyebrow="The Greenhouses"
          title="A house for every leaf."
          subtitle="Browse our seven curated houses — from the silent succulent room to the cathedral of bonsai."
        />
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { slug: 'indoor', label: 'Indoor', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80' },
            { slug: 'flowering', label: 'Flowering', img: 'https://images.unsplash.com/photo-1567686157466-5a6e6c1b1c20?w=600&q=80' },
            { slug: 'succulent', label: 'Succulents', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80' },
            { slug: 'bonsai', label: 'Bonsai', img: 'https://images.unsplash.com/photo-1599598425947-5fbc56e3d59f?w=600&q=80' },
            { slug: 'herb', label: 'Herbs', img: 'https://images.unsplash.com/photo-1618375569909-3c8616cf663a?w=600&q=80' },
            { slug: 'fruit', label: 'Fruit', img: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=600&q=80' },
          ].map((c, i) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="img-zoom group relative aspect-[3/4] overflow-hidden bg-cream block animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img src={c.img} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display text-2xl text-cream">{c.label}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-cream/70 mt-1 link-underline">Explore</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-cream py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <SectionHeading
              align="left"
              eyebrow="Curator's Selection"
              title={<>The featured edit.</>}
              subtitle="Hand-chosen by our master cultivators each season."
            />
            <Link to="/shop?featured=true" className="hidden md:inline-flex link-underline text-[11px] tracking-[0.3em] uppercase text-forest">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} plant={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="img-zoom relative aspect-[4/3] lg:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=1600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-forest-deep text-cream flex items-center px-8 md:px-16 py-20">
          <div className="max-w-lg animate-fade-up">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">The Spring Edit</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
              In bloom,<br/>by hand.
            </h2>
            <p className="text-cream/80 leading-relaxed mb-8 text-lg">
              From the first cherry of March to the last marigold of October, our spring edit follows the
              quiet calendar of the Godawari hills. A subtle nod to the season — pots, plants, and small rituals.
            </p>
            <Link to="/shop?new=true">
              <BotanicalButton variant="inverse" size="md">
                Shop the Edit
                <ArrowRight className="w-4 h-4" />
              </BotanicalButton>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <SectionHeading eyebrow="Newly Unfurled" title="Fresh from the greenhouse." />
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {newArrivals.map((p, i) => (
            <ProductCard key={p._id} plant={p} index={i} />
          ))}
        </div>
      </section>

      {/* Plant Finder */}
      <section className="bg-forest text-cream py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=2000&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5 animate-fade-down">Plant Finder</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6 animate-fade-up">
            Find the plant<br/>that finds you.
          </h2>
          <p className="text-cream/80 mb-10 leading-relaxed animate-fade-up max-w-xl mx-auto" style={{animationDelay: '120ms'}}>
            Answer four short questions about your light, schedule, and aesthetic. We'll quietly recommend the species best suited to your home.
          </p>
          <Link to="/plant-finder">
            <BotanicalButton variant="inverse" size="lg">Begin the Quiz<ArrowRight className="w-4 h-4"/></BotanicalButton>
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <SectionHeading
            align="left"
            eyebrow="Loved Often"
            title={<>Long-time favourites.</>}
            subtitle="The plants that return to us most — chosen, gifted, and re-bought across seasons."
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {bestsellers.map((p, i) => (
            <ProductCard key={p._id} plant={p} index={i} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <SectionHeading eyebrow="Letters Received" title="From our gardeners." />
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t, i) => (
              <figure
                key={t._id}
                className="bg-ivory p-10 border border-stone/60 animate-fade-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex gap-0.5 mb-6 text-gold">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <span key={k}>✦</span>
                  ))}
                </div>
                <blockquote className="font-display text-xl leading-[1.4] text-forest mb-8 italic">
                  "{t.quote}"
                </blockquote>
                <figcaption>
                  <div className="text-sm font-medium text-forest">{t.name}</div>
                  <div className="text-xs text-forest/50 tracking-widest uppercase mt-1">{t.location}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Triple promo */}
      <section className="grid lg:grid-cols-3 min-h-[420px]">
        <div className="bg-bark text-cream flex items-center px-8 md:px-12 py-16">
          <div>
            <Sun className="w-7 h-7 text-gold-light mb-5" strokeWidth={1.2} />
            <h3 className="font-display text-3xl mb-3">Care Almanac</h3>
            <p className="text-cream/70 text-sm mb-6 leading-relaxed">Seasonal guides written by our cultivators. Light, water, soil — explained simply.</p>
            <Link to="/care-guide" className="text-[11px] tracking-[0.3em] uppercase link-underline text-gold-light">Read the Almanac</Link>
          </div>
        </div>
        <div className="bg-terracotta text-cream flex items-center px-8 md:px-12 py-16">
          <div>
            <Sprout className="w-7 h-7 text-cream mb-5" strokeWidth={1.2} />
            <h3 className="font-display text-3xl mb-3">Concierge</h3>
            <p className="text-cream/85 text-sm mb-6 leading-relaxed">From a single plant to an entire terrace garden — our concierge plans, sources, and installs.</p>
            <Link to="/concierge" className="text-[11px] tracking-[0.3em] uppercase link-underline">Speak to Us</Link>
          </div>
        </div>
        <div className="bg-forest-deep text-cream flex items-center px-8 md:px-12 py-16">
          <div>
            <Leaf className="w-7 h-7 text-gold-light mb-5" strokeWidth={1.2} />
            <h3 className="font-display text-3xl mb-3">Sustainability</h3>
            <p className="text-cream/70 text-sm mb-6 leading-relaxed">Peat-free substrate, biodegradable pots, and Godawari-grown stock. A quieter way to nursery.</p>
            <Link to="/sustainability" className="text-[11px] tracking-[0.3em] uppercase link-underline text-gold-light">Our Pledge</Link>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 text-center">
        <SectionHeading
          eyebrow="Find a Greenhouse"
          title="Visit Godawari Planthub."
          subtitle="Our flagship nursery and two satellite boutiques across the Kathmandu Valley."
        />
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          {[
            { name: 'Godawari Greenhouse', city: 'Lalitpur' },
            { name: 'Patan Boutique', city: 'Patan Durbar Square' },
            { name: 'Thamel Salon', city: 'Kathmandu' },
          ].map((l) => (
            <div key={l.name} className="border border-stone/80 px-8 py-5 text-left min-w-[220px] hover:border-forest transition-colors duration-500">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{l.city}</p>
              <p className="font-display text-xl text-forest">{l.name}</p>
            </div>
          ))}
        </div>
        <Link to="/locations" className="inline-block mt-12">
          <BotanicalButton variant="outline">See All Locations<ArrowRight className="w-4 h-4"/></BotanicalButton>
        </Link>
      </section>

      {/* Story Behind */}
      {featured[0] && (
        <section className="bg-cream py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="img-zoom aspect-square overflow-hidden">
              <img src={featured[0].images[0]} alt={featured[0].name} className="w-full h-full object-cover" />
            </div>
            <div className="animate-fade-up">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">The Story Behind</p>
              <h2 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6 text-forest">
                {featured[0].name}
              </h2>
              <p className="italic text-forest/60 mb-6">{featured[0].botanicalName}</p>
              <p className="text-forest/80 leading-relaxed mb-8 text-lg">{featured[0].description}</p>
              <div className="flex items-center gap-6 mb-8">
                <span className="text-2xl font-display text-forest">{formatPrice(featured[0].price, featured[0].currency)}</span>
              </div>
              <Link to={`/plant/${featured[0].slug}`}>
                <BotanicalButton size="lg">Discover<ArrowRight className="w-4 h-4"/></BotanicalButton>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}



"use client";
import { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';

const LOCATIONS = [
  {
    name: 'Godawari Flagship Greenhouse',
    type: 'Greenhouse & Nursery',
    city: 'Godawari, Lalitpur',
    address: 'Botanical Garden Road, Godawari-9, Lalitpur, Nepal',
    phone: '+977 1 555 1837',
    hours: 'Sun–Fri · 9am–6pm',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
  },
  {
    name: 'Patan Boutique',
    type: 'Boutique',
    city: 'Patan',
    address: 'Sundhara, beside Patan Durbar Square, Lalitpur',
    phone: '+977 1 555 2241',
    hours: 'Daily · 10am–7pm',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80',
  },
  {
    name: 'Thamel Salon',
    type: 'Salon & Tea Bar',
    city: 'Kathmandu',
    address: 'Chaksibari Marg, Thamel, Kathmandu',
    phone: '+977 1 555 4490',
    hours: 'Daily · 10am–9pm',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80',
  },
  {
    name: 'Lakeside Pavilion',
    type: 'Boutique',
    city: 'Pokhara',
    address: 'Lakeside-6, Pokhara, near Phewa Lake',
    phone: '+977 61 555 880',
    hours: 'Daily · 9am–8pm',
    image: 'https://images.unsplash.com/photo-1567686157466-5a6e6c1b1c20?w=1200&q=80',
  },
  {
    name: 'Bhaktapur Atelier',
    type: 'Atelier (by appointment)',
    city: 'Bhaktapur',
    address: 'Taumadhi Square, Bhaktapur',
    phone: '+977 1 555 6133',
    hours: 'By appointment',
    image: 'https://images.unsplash.com/photo-1599598425947-5fbc56e3d59f?w=1200&q=80',
  },
];

const CITIES = ['All Cities', ...Array.from(new Set(LOCATIONS.map((l) => l.city)))];

export default function LocationsPage() {
  const [city, setCity] = useState('All Cities');
  const list = city === 'All Cities' ? LOCATIONS : LOCATIONS.filter((l) => l.city === city);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[440px]">
        <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=2400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-cream px-6">
          <div className="animate-fade-up-slow">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">Our Locations</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">Find a greenhouse.</h1>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-forest/70 leading-relaxed">
            Our flagship greenhouse and four satellite boutiques across Nepal — each with its own character, light, and curated catalogue.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-12">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent border border-stone/80 focus:border-forest px-5 py-3 text-[11px] tracking-[0.25em] uppercase text-forest outline-none cursor-pointer"
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {list.map((l, i) => (
            <article key={l.name} className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="img-zoom aspect-[3/4] overflow-hidden bg-cream">
                <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{l.type}</p>
                <h3 className="font-display text-2xl md:text-3xl text-forest leading-tight mb-4">{l.name}</h3>
                <div className="space-y-2 text-sm text-forest/70">
                  <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" /> {l.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold flex-shrink-0" /> {l.phone}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold flex-shrink-0" /> {l.hours}</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(l.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 link-underline text-[11px] tracking-[0.3em] uppercase text-forest self-start"
                >
                  Get Directions
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}


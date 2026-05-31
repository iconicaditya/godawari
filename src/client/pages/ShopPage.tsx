"use client";
import { useMemo, useState } from 'react';
import { useSearchParams } from '@/client/next-router';
import { useQuery } from '@tanstack/react-query';
import { localQuery } from '@/client/lib/localData';
import { SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { ProductCard, type Plant } from '@/client/components/nursery/ProductCard';

const CATEGORIES = [
  { slug: 'all', label: 'All Plants' },
  { slug: 'indoor', label: 'Indoor' },
  { slug: 'outdoor', label: 'Outdoor' },
  { slug: 'flowering', label: 'Flowering' },
  { slug: 'succulent', label: 'Succulents' },
  { slug: 'bonsai', label: 'Bonsai' },
  { slug: 'herb', label: 'Herbs' },
  { slug: 'fruit', label: 'Fruit' },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
  { value: 'rating', label: 'Best Rated' },
];

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'all';
  const search = params.get('search') ?? '';
  const isNew = params.get('new') === 'true';
  const isFeatured = params.get('featured') === 'true';
  const sort = (params.get('sort') ?? 'featured') as
    | 'featured' | 'price_asc' | 'price_desc' | 'name' | 'rating';

  const [filterOpen, setFilterOpen] = useState(false);

  const { data: plants = [], isLoading } = useQuery(
    localQuery<Plant[]>('nursery.listPlants', {
      category,
      search,
      sort,
      newArrival: isNew || undefined,
      featured: isFeatured || undefined,
    })
  );

  const heading = useMemo(() => {
    if (search) return { eyebrow: 'Search', title: `Results for "${search}"` };
    if (isNew) return { eyebrow: 'New Arrivals', title: 'Newly unfurled.' };
    if (isFeatured) return { eyebrow: "Curator's Selection", title: 'The featured edit.' };
    if (category !== 'all') {
      const c = CATEGORIES.find((c) => c.slug === category);
      return { eyebrow: 'The Greenhouse', title: c?.label ?? 'Plants' };
    }
    return { eyebrow: 'Catalogue', title: 'All plants.' };
  }, [search, isNew, isFeatured, category]);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null || value === '' || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  return (
    <Layout>
      {/* Page header */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 animate-fade-down">{heading.eyebrow}</p>
          <h1 className="font-display text-5xl md:text-7xl text-forest leading-[1.05] animate-fade-up">{heading.title}</h1>
          <p className="text-forest/60 mt-6 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '120ms' }}>
            Browse our living catalogue. Each plant is hand-conditioned in the Godawari greenhouses before it travels.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-20 z-30 bg-ivory/95 backdrop-blur-sm border-y border-stone/60">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-forest hover:text-terracotta transition-colors lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>

          <div className="hidden lg:flex items-center gap-6 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setParam('category', c.slug)}
                className={`text-[11px] tracking-[0.25em] uppercase whitespace-nowrap link-underline transition-colors ${
                  category === c.slug ? 'text-terracotta' : 'text-forest/70 hover:text-forest'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-forest/70">
            <span className="hidden sm:inline">{plants.length} pieces</span>
            <span className="text-forest/30 hidden sm:inline">·</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] tracking-[0.25em] uppercase cursor-pointer focus:text-terracotta"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>Sort: {s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ${
          filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-forest-deep/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
        <aside
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-ivory shadow-2xl transition-transform duration-700 ease-luxe ${
            filterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-stone/60">
            <span className="text-[11px] tracking-[0.3em] uppercase text-forest">Categories</span>
            <button onClick={() => setFilterOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => { setParam('category', c.slug); setFilterOpen(false); }}
                className={`block w-full text-left py-3 font-display text-2xl transition-colors ${
                  category === c.slug ? 'text-terracotta' : 'text-forest hover:text-terracotta'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-cream animate-pulse" />
            ))}
          </div>
        ) : plants.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-3xl text-forest mb-3">Nothing in this corner.</p>
            <p className="text-forest/60">Try a different greenhouse or clear your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {plants.map((p, i) => (
              <ProductCard key={p._id} plant={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}



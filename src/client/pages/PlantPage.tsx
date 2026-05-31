"use client";
import { useState } from 'react';
import { Link, useParams, Navigate } from '@/client/next-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation, createQueryKey } from '@/client/lib/localData';
import { Star, Minus, Plus, Heart, Truck, ShieldCheck, Leaf, Droplets, Sun, Ruler, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';
import { ProductCard, type Plant } from '@/client/components/nursery/ProductCard';
import { formatPrice } from '@/client/lib/format';
import { useCart } from '@/client/hooks/useCart';

type Review = {
  _id: string;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export default function PlantPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'care' | 'shipping'>('description');
  const { addToCart } = useCart();

  const { data: plant, isLoading } = useQuery({
    ...localQuery<Plant | null>('nursery.getPlant', { slug }),
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery({
    ...localQuery<Plant[]>('nursery.relatedPlants', {
      category: plant?.category ?? '',
      excludeSlug: slug ?? '',
    }),
    enabled: !!plant,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-32 grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-cream animate-pulse" />
            <div className="h-6 w-1/2 bg-cream animate-pulse" />
            <div className="h-32 w-full bg-cream animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!plant) return <Navigate to="/shop" replace />;

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 text-[11px] tracking-[0.25em] uppercase text-forest/50">
        <Link to="/" className="hover:text-forest">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-forest">Shop</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${plant.category}`} className="hover:text-forest">{plant.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-forest">{plant.name}</span>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="animate-fade-in">
          <div className="aspect-square bg-cream overflow-hidden mb-4 img-zoom">
            <img
              src={plant.images[mainImg] ?? plant.images[0]}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          </div>
          {plant.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {plant.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`aspect-square overflow-hidden border-2 transition-colors ${
                    i === mainImg ? 'border-forest' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="animate-fade-up">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">{plant.category}</p>
          <h1 className="font-display text-5xl md:text-6xl text-forest leading-[1.02] mb-3">{plant.name}</h1>
          <p className="italic text-forest/60 mb-6">{plant.botanicalName}</p>

          {plant.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(plant.rating) ? 'fill-gold text-gold' : 'text-forest/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-forest/60">{plant.rating.toFixed(1)} · {plant.reviewCount} reviews</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl text-forest">{formatPrice(plant.price, plant.currency)}</span>
            {plant.compareAtPrice && (
              <span className="text-forest/40 line-through">{formatPrice(plant.compareAtPrice, plant.currency)}</span>
            )}
          </div>

          <p className="text-forest/80 leading-relaxed mb-8 text-lg">{plant.shortDescription}</p>

          {/* Care quick-stats */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-stone/60 mb-8">
            <Stat Icon={Sun} label="Light" value={plant.light} />
            <Stat Icon={Droplets} label="Water" value={plant.water} />
            <Stat Icon={Ruler} label="Height" value={plant.height} />
            <Stat Icon={Leaf} label="Care Level" value={plant.careLevel} />
          </div>

          {/* Quantity + CTA */}
          <div className="flex items-stretch gap-4 mb-4">
            <div className="flex items-center border border-forest">
              <button
                className="w-12 h-12 hover:bg-forest hover:text-cream transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease"
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                className="w-12 h-12 hover:bg-forest hover:text-cream transition-colors"
                onClick={() => setQty(Math.min(plant.stockCount, qty + 1))}
                aria-label="Increase"
              >
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>

            <BotanicalButton
              size="lg"
              className="flex-1"
              disabled={!plant.inStock}
              onClick={() => addToCart(plant.slug, qty)}
            >
              {plant.inStock ? 'Add to Bag' : 'Out of Stock'}
            </BotanicalButton>

            <button
              onClick={() => toast.success('Saved to your wishlist')}
              className="w-12 border border-forest hover:bg-forest hover:text-cream transition-colors flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-forest/60 mb-10">
            {plant.inStock ? `${plant.stockCount} in stock — ships within 2 working days` : 'Currently unavailable'}
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 text-xs text-forest/70">
              <Truck className="w-5 h-5 text-gold" strokeWidth={1.2} />
              <span>Free delivery in valley above Rs. 5,000</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-forest/70">
              <ShieldCheck className="w-5 h-5 text-gold" strokeWidth={1.2} />
              <span>14-day healthy-arrival guarantee</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-stone/60">
            {[
              { key: 'description' as const, label: 'Description' },
              { key: 'care' as const, label: 'Care Notes' },
              { key: 'shipping' as const, label: 'Shipping & Returns' },
            ].map((t) => (
              <div key={t.key} className="border-b border-stone/60">
                <button
                  onClick={() => setTab(tab === t.key ? ('description' as any) : t.key)}
                  className="w-full flex items-center justify-between py-5 text-left text-[11px] tracking-[0.3em] uppercase text-forest"
                >
                  {t.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${tab === t.key ? 'rotate-180' : ''}`} />
                </button>
                {tab === t.key && (
                  <div className="pb-6 text-forest/80 leading-relaxed text-sm animate-fade-up">
                    {t.key === 'description' && <p>{plant.description}</p>}
                    {t.key === 'care' && (
                      <ul className="space-y-2">
                        <li><strong className="text-forest">Light:</strong> {plant.light}</li>
                        <li><strong className="text-forest">Water:</strong> {plant.water}</li>
                        <li><strong className="text-forest">Height:</strong> {plant.height}</li>
                        <li><strong className="text-forest">Pot included:</strong> {plant.potIncluded ? 'Yes — hand-thrown stoneware' : 'Plastic nursery pot only'}</li>
                      </ul>
                    )}
                    {t.key === 'shipping' && (
                      <div className="space-y-2">
                        <p>Delivery within Kathmandu Valley in 1–2 working days. Outside the valley, 3–5 working days.</p>
                        <p>Each plant is wrapped in shredded jute and bamboo bracing. If your plant arrives unwell, write to us within 14 days for a replacement.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection plantId={plant._id} />

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">You may also love</p>
              <h2 className="font-display text-4xl md:text-5xl text-forest">From the same greenhouse.</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              {related.map((p, i) => <ProductCard key={p._id} plant={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

function Stat({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.2} />
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-forest/50 mb-0.5">{label}</p>
        <p className="text-sm text-forest capitalize">{value}</p>
      </div>
    </div>
  );
}

function ReviewsSection({ plantId }: { plantId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ authorName: '', location: '', rating: 5, title: '', body: '' });

  const { data: reviews = [] } = useQuery(
    localQuery<Review[]>('nursery.getReviews', { plantId })
  );

  const submit = useMutation({
    ...localMutation('nursery.submitReview'),
    onSuccess: () => {
      toast.success('Thank you for your review.');
      queryClient.invalidateQueries({ queryKey: createQueryKey('nursery.getReviews', { plantId }) });
      setOpen(false);
      setForm({ authorName: '', location: '', rating: 5, title: '', body: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 border-t border-stone/60">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Letters from gardeners</p>
          <h2 className="font-display text-4xl md:text-5xl text-forest">Reviews ({reviews.length})</h2>
        </div>
        <BotanicalButton variant="outline" onClick={() => setOpen(true)}>Write a Review</BotanicalButton>
      </div>

      {reviews.length === 0 ? (
        <p className="text-forest/60 italic">Be the first to write a review.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((r) => (
            <article key={r._id} className="border-t border-stone/60 pt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-forest/20'}`} />
                  ))}
                </div>
                {r.verified && <span className="text-[10px] tracking-[0.25em] uppercase text-forest/50">Verified</span>}
              </div>
              <h3 className="font-display text-xl text-forest mb-2">{r.title}</h3>
              <p className="text-forest/80 leading-relaxed text-sm mb-4">{r.body}</p>
              <p className="text-xs tracking-widest uppercase text-forest/50">— {r.authorName}, {r.location}</p>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-ivory max-w-lg w-full p-10 animate-scale-in">
            <h3 className="font-display text-3xl text-forest mb-2">Share your reflection.</h3>
            <p className="text-sm text-forest/60 mb-6">A few honest words help fellow gardeners choose well.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit.mutate({ plantId, ...form });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="Your Name" value={form.authorName} onChange={(v) => setForm({ ...form, authorName: v })} required />
                <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60">Rating</label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${n <= form.rating ? 'fill-gold text-gold' : 'text-forest/20'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">Your Review</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={4}
                  required
                  className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <BotanicalButton type="submit" className="flex-1" disabled={submit.isPending}>
                  {submit.isPending ? 'Sending…' : 'Submit Review'}
                </BotanicalButton>
                <BotanicalButton type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</BotanicalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm transition-colors"
      />
    </div>
  );
}



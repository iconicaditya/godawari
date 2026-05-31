"use client";
import { Link } from '@/client/next-router';
import { ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '@/client/lib/format';
import { useCart } from '@/client/hooks/useCart';

export type Plant = {
  _id: string;
  slug: string;
  name: string;
  botanicalName: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  shortDescription: string;
  description: string;
  careLevel: string;
  light: string;
  water: string;
  height: string;
  potIncluded: boolean;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  newArrival: boolean;
  bestseller: boolean;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
};

export function ProductCard({ plant, index = 0 }: { plant: Plant; index?: number }) {
  const { addToCart } = useCart();
  const second = plant.images[1] ?? plant.images[0];

  return (
    <article
      className="group flex flex-col animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <Link to={`/plant/${plant.slug}`} className="relative aspect-[4/5] overflow-hidden bg-cream block">
        <img
          src={plant.images[0]}
          alt={plant.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-luxe group-hover:opacity-0 group-hover:scale-105"
        />
        <img
          src={second}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-[1200ms] ease-luxe group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {plant.newArrival && (
            <span className="bg-ivory/95 text-forest text-[10px] tracking-[0.25em] uppercase px-2.5 py-1">New</span>
          )}
          {plant.bestseller && (
            <span className="bg-terracotta text-cream text-[10px] tracking-[0.25em] uppercase px-2.5 py-1">Bestseller</span>
          )}
          {plant.compareAtPrice && (
            <span className="bg-forest text-cream text-[10px] tracking-[0.25em] uppercase px-2.5 py-1">Edit</span>
          )}
        </div>

        {!plant.inStock && (
          <div className="absolute inset-0 bg-ivory/80 flex items-center justify-center">
            <span className="text-xs tracking-[0.3em] uppercase">Out of Stock</span>
          </div>
        )}

        {/* Quick add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(plant.slug, 1);
          }}
          className="absolute bottom-0 left-0 right-0 bg-forest-deep text-cream py-3.5 flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxe btn-shimmer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
      </Link>

      <div className="pt-5 px-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-forest/50 mb-1.5">{plant.category}</p>
        <Link to={`/plant/${plant.slug}`}>
          <h3 className="font-display text-xl text-forest leading-tight group-hover:text-terracotta transition-colors duration-500">
            {plant.name}
          </h3>
        </Link>
        <p className="italic text-xs text-forest/50 mt-0.5">{plant.botanicalName}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base text-forest">{formatPrice(plant.price, plant.currency)}</span>
            {plant.compareAtPrice && (
              <span className="text-xs text-forest/40 line-through">
                {formatPrice(plant.compareAtPrice, plant.currency)}
              </span>
            )}
          </div>
          {plant.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-forest/60">
              <Star className="w-3 h-3 fill-gold text-gold" />
              {plant.rating.toFixed(1)} <span className="text-forest/40">({plant.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}



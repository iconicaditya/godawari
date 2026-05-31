"use client";
import { Link } from '@/client/next-router';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';
import { useCart } from '@/client/hooks/useCart';
import { formatPrice } from '@/client/lib/format';

export default function CartPage() {
  const { cart, updateItem, isLoading } = useCart();

  const shipping = cart.subtotal >= 5000 ? 0 : cart.subtotal > 0 ? 250 : 0;
  const total = cart.subtotal + shipping;

  return (
    <Layout>
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4 animate-fade-down">Shopping Bag</p>
          <h1 className="font-display text-5xl md:text-6xl text-forest animate-fade-up">Your collection.</h1>
        </div>

        {isLoading ? (
          <p className="text-center text-forest/60">Loading…</p>
        ) : cart.items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <p className="font-display text-3xl text-forest mb-4">Your bag is quiet.</p>
            <p className="text-forest/60 mb-8">Begin building your collection from our greenhouses.</p>
            <Link to="/shop"><BotanicalButton size="lg">Browse Plants<ArrowRight className="w-4 h-4"/></BotanicalButton></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Items */}
            <div className="space-y-6">
              {cart.items.map((item, i) => (
                <article
                  key={item.slug}
                  className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-5 md:gap-8 pb-6 border-b border-stone/60 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Link to={`/plant/${item.slug}`} className="img-zoom aspect-square overflow-hidden bg-cream">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex flex-col">
                    <Link to={`/plant/${item.slug}`}>
                      <h3 className="font-display text-2xl text-forest leading-tight hover:text-terracotta transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-forest/60 mt-1 mb-auto">{formatPrice(item.price)}</p>

                    <div className="flex items-end justify-between gap-4 mt-4">
                      <div className="flex items-center border border-stone/80">
                        <button
                          onClick={() => updateItem(item.slug, item.quantity - 1)}
                          className="w-9 h-9 hover:bg-forest hover:text-cream transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3 mx-auto" />
                        </button>
                        <span className="w-9 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.slug, item.quantity + 1)}
                          className="w-9 h-9 hover:bg-forest hover:text-cream transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-display text-xl text-forest">{formatPrice(item.lineTotal)}</span>
                        <button
                          onClick={() => updateItem(item.slug, 0)}
                          className="text-forest/40 hover:text-terracotta transition-colors p-1"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Summary */}
            <aside className="bg-cream p-8 md:p-10 h-fit lg:sticky lg:top-32">
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Order Summary</p>
              <div className="space-y-3 text-sm border-b border-stone/60 pb-5 mb-5">
                <Row label="Subtotal" value={formatPrice(cart.subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Complimentary' : formatPrice(shipping)} />
              </div>
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[11px] tracking-[0.3em] uppercase text-forest/60">Total</span>
                <span className="font-display text-3xl text-forest">{formatPrice(total)}</span>
              </div>

              {cart.subtotal < 5000 && (
                <p className="text-xs text-forest/60 mb-6 leading-relaxed">
                  Add {formatPrice(5000 - cart.subtotal)} more for complimentary delivery within Kathmandu Valley.
                </p>
              )}

              <Link to="/checkout">
                <BotanicalButton size="lg" className="w-full">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </BotanicalButton>
              </Link>

              <Link to="/shop" className="block text-center mt-5 text-[11px] tracking-[0.3em] uppercase text-forest/70 link-underline">
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-forest/80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}



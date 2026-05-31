"use client";
import { useState } from 'react';
import { Link, useNavigate } from '@/client/next-router';
import { useMutation } from '@tanstack/react-query';
import { localMutation } from '@/client/lib/localData';
import toast from 'react-hot-toast';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';
import { useCart } from '@/client/hooks/useCart';
import { formatPrice } from '@/client/lib/format';

export default function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kathmandu',
    notes: '',
  });

  const place = useMutation({
    ...localMutation<{ orderNumber: string; total: number }>('nursery.placeOrder'),
    onSuccess: (data) => {
      toast.success(`Order ${data.orderNumber} placed.`);
      navigate(`/order-confirmation?n=${data.orderNumber}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const shipping = cart.subtotal >= 5000 ? 0 : cart.subtotal > 0 ? 250 : 0;
  const total = cart.subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <Layout>
        <section className="max-w-xl mx-auto px-6 py-32 text-center">
          <p className="font-display text-3xl mb-4 text-forest">Your bag is empty.</p>
          <Link to="/shop"><BotanicalButton>Return to Shop</BotanicalButton></Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4 animate-fade-down">Checkout</p>
          <h1 className="font-display text-5xl md:text-6xl text-forest animate-fade-up">Final touches.</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              place.mutate({ sessionId: cart.sessionId, ...form });
            }}
            className="space-y-8"
          >
            <Section title="Contact">
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </Section>

            <Section title="Delivery">
              <Field label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
              <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} className="md:col-span-2" />
              <div className="md:col-span-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">City</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm"
                >
                  {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Butwal', 'Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </Section>

            <Section title="Care Notes (optional)">
              <div className="md:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Special handling, gift message, or delivery instructions…"
                  className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm"
                />
              </div>
            </Section>

            <BotanicalButton type="submit" size="lg" className="w-full" disabled={place.isPending}>
              {place.isPending ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
            </BotanicalButton>
            <p className="text-xs text-forest/60 text-center">
              Cash on Delivery and Bank Transfer accepted. Online payments coming soon.
            </p>
          </form>

          <aside className="bg-cream p-8 h-fit lg:sticky lg:top-32">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Your Bag</p>
            <ul className="space-y-3 text-sm mb-5 max-h-80 overflow-auto">
              {cart.items.map((i) => (
                <li key={i.slug} className="flex gap-3">
                  <img src={i.image} alt="" className="w-14 h-14 object-cover" />
                  <div className="flex-1">
                    <p className="font-display text-base text-forest leading-tight">{i.name}</p>
                    <p className="text-xs text-forest/60">Qty {i.quantity}</p>
                  </div>
                  <span className="text-sm">{formatPrice(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone/60 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(cart.subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? 'Complimentary' : formatPrice(shipping)} />
            </div>
            <div className="border-t border-stone/60 pt-4 mt-4 flex justify-between items-baseline">
              <span className="text-[11px] tracking-[0.3em] uppercase">Total</span>
              <span className="font-display text-2xl text-forest">{formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm transition-colors"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-forest/80"><span>{label}</span><span>{value}</span></div>;
}



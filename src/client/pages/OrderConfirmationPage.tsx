"use client";
import { Link, useSearchParams } from '@/client/next-router';
import { Check } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const orderNumber = params.get('n');

  return (
    <Layout>
      <section className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="w-20 h-20 rounded-full bg-forest text-cream flex items-center justify-center mx-auto mb-8 animate-scale-in">
          <Check className="w-9 h-9" strokeWidth={1.5} />
        </div>
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 animate-fade-down">Order Confirmed</p>
        <h1 className="font-display text-5xl md:text-6xl text-forest leading-[1.05] mb-6 animate-fade-up">Thank you.</h1>
        <p className="text-forest/70 leading-relaxed mb-3 animate-fade-up" style={{animationDelay: '120ms'}}>
          Your plants are being prepared with care in our Godawari greenhouse.
        </p>
        {orderNumber && (
          <p className="text-sm tracking-widest uppercase text-forest/60 mb-10 animate-fade-up" style={{animationDelay: '180ms'}}>
            Order Number · <span className="text-forest font-medium">{orderNumber}</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/shop"><BotanicalButton>Continue Shopping</BotanicalButton></Link>
          <Link to="/care-guide"><BotanicalButton variant="outline">Read the Care Guide</BotanicalButton></Link>
        </div>
      </section>
    </Layout>
  );
}



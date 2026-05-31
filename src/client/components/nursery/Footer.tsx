"use client";
import { useState } from 'react';
import { Link } from '@/client/next-router';
import { Logo } from './Logo';
import { useMutation } from '@tanstack/react-query';
import { localMutation } from '@/client/lib/localData';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = useMutation({
    ...localMutation('nursery.subscribeNewsletter'),
    onSuccess: () => {
      toast.success('Welcome to the conservatory.');
      setEmail('');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <footer className="bg-forest-deep text-cream/90 mt-32">
      {/* Newsletter */}
      <section className="border-b border-cream/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] tracking-[0.35em] uppercase text-gold mb-4">The Conservatory</div>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mb-4">
              Letters from the<br/>greenhouse.
            </h2>
            <p className="text-cream/70 max-w-md leading-relaxed">
              Seasonal arrivals, care almanacs, and quiet dispatches from the Godawari hills. Delivered with intention.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) subscribe.mutate({ email });
            }}
            className="md:pl-12"
          >
            <label className="text-[11px] tracking-[0.3em] uppercase block mb-3 text-cream/60">
              Your Email
            </label>
            <div className="flex border-b border-cream/30 focus-within:border-gold transition-colors duration-500">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@garden.com"
                className="flex-1 bg-transparent outline-none py-3 text-lg placeholder:text-cream/30"
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="px-4 group disabled:opacity-50"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
            <p className="text-xs text-cream/50 mt-4 leading-relaxed">
              By subscribing, you agree to receive seasonal correspondence. Unsubscribe at any leaf.
            </p>
          </form>
        </div>
      </section>

      {/* Main footer */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Logo tone="cream" />
          <p className="mt-6 text-cream/70 max-w-sm leading-relaxed text-sm">
            Cultivating fine plants on the slopes of Godawari since 1984. A curated greenhouse for collectors,
            designers, and quiet beginners alike.
          </p>
          <div className="mt-8 space-y-3 text-sm text-cream/70">
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold"/> Godawari, Lalitpur, Nepal</div>
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold"/> +977 1 555 1837</div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold"/> hello@godawariplanthub.com</div>
          </div>
        </div>

        <FooterCol title="Shop">
          <FooterLink to="/shop">All Plants</FooterLink>
          <FooterLink to="/shop?category=indoor">Indoor</FooterLink>
          <FooterLink to="/shop?category=outdoor">Outdoor</FooterLink>
          <FooterLink to="/shop?category=succulent">Succulents</FooterLink>
          <FooterLink to="/shop?category=flowering">Flowering</FooterLink>
          <FooterLink to="/shop?category=bonsai">Bonsai</FooterLink>
          <FooterLink to="/shop?category=herb">Herbs</FooterLink>
          <FooterLink to="/shop?category=fruit">Fruit</FooterLink>
        </FooterCol>

        <FooterCol title="The House">
          <FooterLink to="/about">Our Story</FooterLink>
          <FooterLink to="/sustainability">Sustainability</FooterLink>
          <FooterLink to="/care-guide">Care Guide</FooterLink>
          <FooterLink to="/journal">Journal</FooterLink>
          <FooterLink to="/concierge">Concierge</FooterLink>
          <FooterLink to="/locations">Visit Us</FooterLink>
        </FooterCol>

        <FooterCol title="Service">
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/shipping">Shipping</FooterLink>
          <FooterLink to="/returns">Returns</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/terms">Terms</FooterLink>
          <FooterLink to="/privacy">Privacy</FooterLink>
        </FooterCol>
      </section>

      {/* Bottom */}
      <section className="border-t border-cream/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Godawari Planthub Nursery Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Instagram className="w-4 h-4"/></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Facebook className="w-4 h-4"/></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Youtube className="w-4 h-4"/></a>
          </div>
          <p className="tracking-[0.25em] uppercase">Shipping across Nepal · NPR</p>
        </div>
      </section>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">{title}</h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-cream/70 hover:text-gold transition-colors duration-500 link-underline">
        {children}
      </Link>
    </li>
  );
}



"use client";
import React, { useCallback, useState } from 'react';
import { Link } from '@/client/next-router';
import { toast } from 'react-hot-toast';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function SignupPage() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    const confirmPassword = String(fd.get('confirmPassword'));
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Registration failed');
      }
      setSuccess(true);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, []);

  return (
    <Layout>
      <section className="grid lg:grid-cols-2 min-h-[70vh]">
        <div className="hidden lg:block relative">
          <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover animate-kenburns" />
          <div className="absolute inset-0 bg-forest-deep/35" />
          <div className="absolute bottom-12 left-12 text-cream max-w-sm">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-3">Begin a Garden</p>
            <p className="font-display text-3xl italic leading-[1.4]">"Plant a tree under whose shade you do not expect to sit."</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-20">
          {success ? (
            <div className="w-full max-w-sm text-center animate-fade-up">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">Welcome</p>
              <h1 className="font-display text-4xl md:text-5xl text-forest mb-6 leading-[1.05]">Your account is sown.</h1>
              <p className="text-forest/70 mb-10 leading-relaxed">A small garden has been planted in your name. Sign in to begin tending.</p>
              <Link to="/login"><BotanicalButton size="lg" className="w-full">Sign In</BotanicalButton></Link>
            </div>
          ) : (
            <div className="w-full max-w-sm animate-fade-up">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 text-center">Create Account</p>
              <h1 className="font-display text-4xl md:text-5xl text-forest text-center mb-10 leading-[1.05]">Begin your garden.</h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Email" name="email" type="email" />
                <Field label="Password" name="password" type="password" />
                <Field label="Confirm Password" name="confirmPassword" type="password" />

                <label className="flex items-start gap-3 text-xs text-forest/70 pt-2">
                  <input type="checkbox" required className="mt-1 accent-forest" />
                  <span>I accept the <Link to="/terms" className="link-underline text-forest">Terms & Conditions</Link>.</span>
                </label>

                <BotanicalButton type="submit" size="lg" className="w-full">Create Account</BotanicalButton>
              </form>

              <p className="text-center text-sm text-forest/70 mt-8">
                Already a member?{' '}
                <Link to="/login" className="text-forest font-medium link-underline">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        required
        className="w-full bg-transparent border-0 border-b border-stone/80 focus:border-forest focus:ring-0 py-3 outline-none text-forest transition-colors"
      />
    </div>
  );
}



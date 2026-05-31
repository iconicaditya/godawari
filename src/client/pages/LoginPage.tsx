"use client";
import React, { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { Link } from '@/client/next-router';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const defaultDemoEmail = 'customer@godawari.local';
  const defaultDemoPassword = 'password';

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Invalid email or password');
      return;
    }

    window.location.href = '/account';
  }, []);

  return (
    <Layout>
      <section className="grid lg:grid-cols-2 min-h-[70vh]">
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-kenburns"
          />
          <div className="absolute inset-0 bg-forest-deep/35" />
          <div className="absolute bottom-12 left-12 text-cream max-w-sm">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-3">A Quiet Welcome</p>
            <p className="font-display text-3xl italic leading-[1.4]">"To garden is to keep a small calendar of patience."</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-sm animate-fade-up">
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 text-center">Sign In</p>
            <h1 className="font-display text-4xl md:text-5xl text-forest text-center mb-10 leading-[1.05]">Welcome back.</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Email" name="email" type="email" defaultValue={defaultDemoEmail} />
              <Field label="Password" name="password" type="password" defaultValue={defaultDemoPassword} />
              <BotanicalButton type="submit" size="lg" className="w-full">Sign In</BotanicalButton>
            </form>

            <p className="text-center text-sm text-forest/70 mt-8">
              No account yet?{' '}
              <Link to="/signup" className="text-forest font-medium link-underline">Create one</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, name, type, defaultValue }: { label: string; name: string; type: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        required
        defaultValue={defaultValue}
        className="w-full bg-transparent border-0 border-b border-stone/80 focus:border-forest focus:ring-0 py-3 outline-none text-forest transition-colors"
      />
    </div>
  );
}

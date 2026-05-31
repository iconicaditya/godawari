"use client";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { localMutation } from '@/client/lib/localData';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' });

  const send = useMutation({
    ...localMutation('nursery.sendContact'),
    onSuccess: () => {
      toast.success('Message received. We\'ll write back soon.');
      setForm({ name: '', email: '', subject: 'General enquiry', message: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Layout>
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid lg:grid-cols-2 gap-16">
        <div className="animate-fade-up">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">Write to Us</p>
          <h1 className="font-display text-5xl md:text-6xl text-forest leading-[1.05] mb-6">A note in the post.</h1>
          <p className="text-forest/70 leading-relaxed mb-10">
            For care advice, custom orders, wholesale enquiries, or simply to share a photograph of your garden —
            we read every message.
          </p>

          <div className="space-y-5 text-sm">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-gold mt-0.5" strokeWidth={1.2} />
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-forest/60 mb-1">Email</p>
                <a href="mailto:hello@godawariplanthub.com" className="text-forest link-underline">hello@godawariplanthub.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gold mt-0.5" strokeWidth={1.2} />
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-forest/60 mb-1">Telephone</p>
                <p className="text-forest">+977 1 555 1837</p>
                <p className="text-xs text-forest/60 mt-1">Sun–Fri · 9am–6pm NPT</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold mt-0.5" strokeWidth={1.2} />
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-forest/60 mb-1">Visit</p>
                <p className="text-forest">Botanical Garden Road, Godawari-9, Lalitpur</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send.mutate(form);
          }}
          className="bg-cream p-8 md:p-12 animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          <h2 className="font-display text-3xl text-forest mb-8">Send a message</h2>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm"
              >
                {['General enquiry', 'Care advice', 'Custom order', 'Wholesale', 'Press', 'Other'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-forest/60 block mb-2">Message</label>
              <textarea
                rows={6}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border border-stone/80 focus:border-forest p-3 outline-none text-sm transition-colors"
              />
            </div>
            <BotanicalButton type="submit" size="lg" className="w-full" disabled={send.isPending}>
              {send.isPending ? 'Sending…' : 'Send Message'}
            </BotanicalButton>
          </div>
        </form>
      </section>
    </Layout>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
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


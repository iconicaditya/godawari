"use client";
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

/* ---------- Button ---------- */

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    'inline-flex items-center justify-center gap-2 tracking-[0.18em] uppercase text-[11px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes: Record<Size, string> = {
    sm: 'px-3.5 py-2',
    md: 'px-5 py-3',
  };
  const variants: Record<Variant, string> = {
    primary: 'bg-forest text-cream hover:bg-forest-deep btn-shimmer',
    outline: 'border border-forest/30 text-forest hover:bg-forest hover:text-cream',
    ghost: 'text-forest/70 hover:text-forest hover:bg-cream',
    danger: 'bg-terracotta/10 text-terracotta border border-terracotta/30 hover:bg-terracotta hover:text-cream',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Card ---------- */

export function AdminCard({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={`bg-ivory border border-stone/60 ${
        padding ? 'p-6 md:p-7' : ''
      } shadow-[0_1px_0_rgba(31,58,46,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Inputs ---------- */

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] uppercase text-forest/60 mb-2">
        {label} {required && <span className="text-terracotta">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-forest/50 mt-1.5">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full bg-ivory border border-stone/70 px-4 py-2.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors ${className}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full bg-ivory border border-stone/70 px-4 py-2.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest transition-colors min-h-[120px] ${className}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const { className = '', children, ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full bg-ivory border border-stone/70 px-4 py-2.5 text-sm text-forest focus:outline-none focus:border-forest transition-colors ${className}`}
    >
      {children}
    </select>
  );
}

/* ---------- Toggle ---------- */

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full p-4 border border-stone/70 hover:border-forest/40 transition-colors text-left"
    >
      <div>
        <p className="text-sm text-forest">{label}</p>
        {hint && <p className="text-xs text-forest/50 mt-0.5">{hint}</p>}
      </div>
      <span
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-forest' : 'bg-stone'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

/* ---------- Stat tile ---------- */

export function StatTile({
  label,
  value,
  delta,
  Icon,
  accent = 'forest',
}: {
  label: string;
  value: string | number;
  delta?: string;
  Icon: any;
  accent?: 'forest' | 'gold' | 'terracotta';
}) {
  const accentColor =
    accent === 'gold' ? 'text-gold' : accent === 'terracotta' ? 'text-terracotta' : 'text-forest';
  return (
    <AdminCard className="relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-cream to-transparent opacity-60 group-hover:scale-110 transition-transform duration-700" />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-forest/50">{label}</p>
          <Icon className={`w-4 h-4 ${accentColor}`} strokeWidth={1.5} />
        </div>
        <p className="font-display text-4xl text-forest leading-none">{value}</p>
        {delta && <p className="text-xs text-forest/50 mt-3">{delta}</p>}
      </div>
    </AdminCard>
  );
}

/* ---------- Badge ---------- */

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
}) {
  const map: Record<string, string> = {
    neutral: 'bg-stone/40 text-forest/80',
    success: 'bg-forest/10 text-forest',
    warning: 'bg-gold/15 text-gold',
    danger: 'bg-terracotta/15 text-terracotta',
    info: 'bg-forest/10 text-forest',
    gold: 'bg-gold/20 text-gold',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase ${map[tone]}`}>
      {children}
    </span>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({
  Icon,
  title,
  body,
  action,
}: {
  Icon: any;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <AdminCard className="text-center py-16">
      <Icon className="w-10 h-10 text-forest/30 mx-auto mb-5" strokeWidth={1.2} />
      <h3 className="font-display text-2xl text-forest mb-2">{title}</h3>
      <p className="text-sm text-forest/60 max-w-md mx-auto">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </AdminCard>
  );
}


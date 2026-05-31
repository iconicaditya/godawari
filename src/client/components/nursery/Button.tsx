"use client";
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/client/lib/utils';

type Variant = 'primary' | 'inverse' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface BotanicalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-forest-deep text-cream hover:bg-forest active:bg-forest-deep btn-shimmer',
  inverse:
    'bg-cream text-forest hover:bg-ivory border border-cream',
  outline:
    'bg-transparent text-forest border border-forest hover:bg-forest hover:text-cream',
  ghost:
    'bg-transparent text-forest hover:bg-cream',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-5 text-[10px] tracking-[0.3em]',
  md: 'h-12 px-8 text-[11px] tracking-[0.3em]',
  lg: 'h-14 px-12 text-xs tracking-[0.35em]',
};

export const BotanicalButton = forwardRef<HTMLButtonElement, BotanicalButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 uppercase font-medium rounded-none transition-all duration-500 ease-luxe disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
BotanicalButton.displayName = 'BotanicalButton';


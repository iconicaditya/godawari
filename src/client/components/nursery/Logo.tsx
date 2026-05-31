"use client";
import { Link } from '@/client/next-router';

export function Logo({ className = '', tone = 'forest' }: { className?: string; tone?: 'forest' | 'cream' }) {
  const color = tone === 'forest' ? 'text-forest' : 'text-cream';
  return (
    <Link to="/" className={`group flex items-center gap-2 ${color} ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="transition-transform duration-700 ease-luxe group-hover:rotate-12">
        <path d="M16 4 C 9 8, 6 14, 8 22 C 11 20, 14 18, 16 14 C 18 18, 21 20, 24 22 C 26 14, 23 8, 16 4 Z" fill="currentColor" opacity="0.92"/>
        <path d="M16 14 L 16 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      </svg>
      <div className="leading-none">
        <div className="font-display text-lg tracking-wide">Godawari</div>
        <div className="text-[9px] tracking-[0.35em] uppercase opacity-70 -mt-0.5">Planthub Nursery</div>
      </div>
    </Link>
  );
}



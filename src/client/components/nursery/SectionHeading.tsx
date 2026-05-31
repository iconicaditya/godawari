"use client";
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'forest',
}: {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'forest' | 'cream';
}) {
  const color = tone === 'forest' ? 'text-forest' : 'text-cream';
  const sub = tone === 'forest' ? 'text-forest/60' : 'text-cream/70';
  const eyebrowColor = tone === 'forest' ? 'text-gold' : 'text-gold-light';
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${color}`}>
      {eyebrow && (
        <p className={`text-[11px] tracking-[0.35em] uppercase ${eyebrowColor} mb-4 animate-fade-down`}>
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] animate-fade-up">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 leading-relaxed ${sub} animate-fade-up`} style={{ animationDelay: '120ms' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}


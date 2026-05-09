'use client';

interface HeroSlideCounterProps {
  active: number;
  total: number;
}

export default function HeroSlideCounter({
  active,
  total,
}: HeroSlideCounterProps) {
  if (total <= 1) return null;

  return (
    <div className="absolute top-8 right-8 lg:right-12 z-10 hidden md:flex items-center gap-3 font-montserrat text-seu-caption-sm text-pale-gray/85">
      <span className="font-[--font-bodoni] text-seu-heading text-pale-gray tabular-nums">
        {String(active + 1).padStart(2, '0')}
      </span>
      <span className="text-pale-gray/40">/</span>
      <span className="text-pale-gray/60 tabular-nums">
        {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

import { cn } from '@/lib/utils';

interface StatPillProps {
  label: string;
  value: React.ReactNode;
  accent?: 'emerald' | 'amber' | 'rose';
}

export default function StatPill({ label, value, accent }: StatPillProps) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'rose'
          ? 'text-rose-300'
          : 'text-admin-fg';
  return (
    <div className="rounded-xl border border-admin-border bg-admin-card-gradient shadow-admin px-4 py-3">
      <div className="text-seu-caption-sm font-montserrat text-admin-fg-muted uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-heading leading-none mt-1 tabular-nums',
          accentClass
        )}
      >
        {value}
      </div>
    </div>
  );
}

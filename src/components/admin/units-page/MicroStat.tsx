import { cn } from '@/lib/utils';

export default function MicroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'amber' | 'rose';
}) {
  const text =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'rose'
          ? 'text-rose-300'
          : 'text-admin-fg';
  return (
    <div className="rounded-lg border border-admin-border bg-admin-card/50 px-3 py-2 min-w-[3.5rem]">
      <div className="font-montserrat text-[0.65rem] text-admin-fg-muted uppercase tracking-wider">
        {label}
      </div>
      <div
        className={cn(
          'font-[--font-bodoni] text-seu-subheading leading-none mt-0.5 tabular-nums',
          text
        )}
      >
        {value}
      </div>
    </div>
  );
}

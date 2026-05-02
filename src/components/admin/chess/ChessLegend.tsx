import type { UnitStatus } from '@/model/types/api';

interface ChessLegendProps {
  counts: Record<UnitStatus, number>;
}

const items: Array<{ status: UnitStatus; swatch: string; label: string }> = [
  {
    status: 'available',
    swatch: 'bg-emerald-500/30 border border-emerald-500/60',
    label: 'Available',
  },
  {
    status: 'reserved',
    swatch: 'bg-amber-500/30 border border-amber-500/60',
    label: 'Booked',
  },
  {
    status: 'sold',
    swatch: 'bg-admin-deep border border-admin-border',
    label: 'Sold',
  },
  {
    status: 'not_for_sale',
    swatch: 'bg-slate-500/30 border border-admin-border-soft',
    label: 'Not for sale',
  },
];

export default function ChessLegend({ counts }: ChessLegendProps) {
  return (
    <div className="flex gap-5 flex-wrap font-montserrat text-seu-caption-sm">
      {items.map(({ status, swatch, label }) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`size-3.5 rounded ${swatch}`} />
          <span className="text-admin-fg-muted">
            {label}:{' '}
            <span className="text-admin-fg font-medium">
              {counts[status] ?? 0}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

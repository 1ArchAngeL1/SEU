import type { ApartmentStatus } from '@prisma/client';

interface ChessLegendProps {
  counts: Record<ApartmentStatus, number>;
}

const items: Array<{
  status: ApartmentStatus;
  color: string;
  label: string;
}> = [
  { status: 'AVAILABLE', color: 'bg-navy-green/60', label: 'Available' },
  { status: 'RESERVED', color: 'bg-[#c9a962]/40', label: 'Reserved' },
  { status: 'SOLD', color: 'bg-red/30', label: 'Sold' },
];

export default function ChessLegend({ counts }: ChessLegendProps) {
  return (
    <div className="flex gap-5 font-montserrat text-seu-caption-sm">
      {items.map(({ status, color, label }) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`size-3 rounded-sm ${color}`} />
          <span className="text-secondary-grey">
            {label}: {counts[status] ?? 0}
          </span>
        </div>
      ))}
    </div>
  );
}

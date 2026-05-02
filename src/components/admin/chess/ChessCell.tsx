import { cn } from '@/lib/utils';
import type { UnitStatus, UnitType } from '@/model/types/api';

type StyleConfig = {
  bg: string;
  border: string;
  hover: string;
  text: string;
  centerText: string;
  centerColor: string;
};

const statusStyle: Record<UnitStatus, StyleConfig> = {
  available: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/50',
    hover: 'hover:bg-emerald-500/20 hover:border-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-100',
    centerText: '',
    centerColor: 'text-emerald-600/80 dark:text-emerald-300/70',
  },
  reserved: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/50',
    hover: 'hover:bg-amber-500/20 hover:border-amber-400',
    text: 'text-amber-700 dark:text-amber-50',
    centerText: 'BOOKED',
    centerColor: 'text-amber-700 dark:text-amber-300',
  },
  sold: {
    bg: 'bg-admin-deep',
    border: 'border-admin-border',
    hover: 'hover:bg-admin-hover hover:border-admin-border-strong',
    text: 'text-admin-fg-muted',
    centerText: 'SOLD',
    centerColor: 'text-admin-fg-muted font-bold',
  },
  not_for_sale: {
    bg: 'bg-slate-500/10',
    border: 'border-admin-border-soft',
    hover: 'hover:bg-slate-500/20 hover:border-admin-border',
    text: 'text-admin-fg-muted',
    centerText: 'N/A',
    centerColor: 'text-admin-fg-muted',
  },
};

function topLeftLabel(type: UnitType, bedrooms?: number): string {
  if (type === 'parking') return 'P';
  if (type === 'storage') return 'ST';
  if (type === 'commerce') return 'C';
  // living
  if (typeof bedrooms === 'number' && bedrooms > 0) return `${bedrooms}BR`;
  return 'LV';
}

interface ChessCellProps {
  label: string;
  fullUnitNumber: string;
  totalSize: number;
  bedrooms?: number;
  type: UnitType;
  status: UnitStatus;
  onClick: () => void;
}

export default function ChessCell({
  label,
  fullUnitNumber,
  totalSize,
  bedrooms,
  type,
  status,
  onClick,
}: ChessCellProps) {
  const style = statusStyle[status];

  return (
    <button
      onClick={onClick}
      title={`#${fullUnitNumber} · ${totalSize}m²`}
      className={cn(
        'relative rounded-md border transition-all hover:scale-[1.04] hover:shadow-lg hover:z-10 cursor-pointer h-[4.75rem] w-full',
        style.bg,
        style.border,
        style.hover
      )}
    >
      {/* Top-left: rooms / type */}
      <span
        className={cn(
          'absolute top-1.5 left-2 font-montserrat font-semibold text-[0.65rem] leading-none tracking-tight opacity-80',
          style.text
        )}
      >
        {topLeftLabel(type, bedrooms)}
      </span>

      {/* Top-right: simple position label */}
      <span
        className={cn(
          'absolute top-1.5 right-2 font-montserrat font-bold text-[0.75rem] leading-none tabular-nums',
          style.text
        )}
      >
        {label}
      </span>

      {/* Middle: status label */}
      {style.centerText && (
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-montserrat tracking-wider text-[0.65rem] uppercase',
            style.centerColor
          )}
        >
          {style.centerText}
        </span>
      )}

      {/* Bottom-left: total size */}
      <span
        className={cn(
          'absolute bottom-1.5 left-2 font-montserrat text-[0.65rem] leading-none tabular-nums opacity-75',
          style.text
        )}
      >
        {totalSize}m²
      </span>
    </button>
  );
}

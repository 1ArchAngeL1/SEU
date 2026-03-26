import { cn } from '@/lib/utils';
import type { ApartmentStatus } from '@prisma/client';

const statusBg: Record<ApartmentStatus, string> = {
  AVAILABLE: 'bg-navy-green/40 border-navy-green/60',
  RESERVED: 'bg-[#c9a962]/20 border-[#c9a962]/40',
  SOLD: 'bg-red/15 border-red/30',
};

interface ChessCellProps {
  apartmentNo: number;
  totalSize: number;
  price: number;
  status: ApartmentStatus;
  onClick: () => void;
}

export default function ChessCell({
  apartmentNo,
  totalSize,
  price,
  status,
  onClick,
}: ChessCellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded border transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer min-h-[4.5rem]',
        statusBg[status]
      )}
    >
      <span className="font-montserrat font-semibold text-seu-caption text-pale-gray">
        #{apartmentNo}
      </span>
      <span className="font-montserrat text-[0.65rem] text-pale-gray/70">
        {totalSize} m²
      </span>
      <span className="font-montserrat text-[0.65rem] text-pale-gray/60">
        ${price.toLocaleString()}
      </span>
    </button>
  );
}

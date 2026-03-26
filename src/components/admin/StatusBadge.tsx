import { cn } from '@/lib/utils';
import type { ApartmentStatus } from '@prisma/client';

const statusConfig: Record<
  ApartmentStatus,
  { bg: string; text: string; label: string }
> = {
  AVAILABLE: {
    bg: 'bg-navy-green/40',
    text: 'text-[#4ade80]',
    label: 'Available',
  },
  RESERVED: {
    bg: 'bg-[#c9a962]/20',
    text: 'text-[#c9a962]',
    label: 'Reserved',
  },
  SOLD: {
    bg: 'bg-red/20',
    text: 'text-red',
    label: 'Sold',
  },
};

interface StatusBadgeProps {
  status: ApartmentStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-seu-caption-sm font-montserrat font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}

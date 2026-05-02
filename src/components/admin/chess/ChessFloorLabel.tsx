import { cn } from '@/lib/utils';

interface ChessFloorLabelProps {
  floor: number;
  basement?: boolean;
}

export default function ChessFloorLabel({
  floor,
  basement,
}: ChessFloorLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-montserrat font-medium text-[0.65rem] tabular-nums',
        basement ? 'text-amber-300/70' : 'text-admin-fg-muted'
      )}
      title={basement ? `Basement ${Math.abs(floor)}` : `Floor ${floor}`}
    >
      {floor}
    </div>
  );
}

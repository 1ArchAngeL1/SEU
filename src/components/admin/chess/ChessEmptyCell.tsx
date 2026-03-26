import { Plus } from 'lucide-react';

interface ChessEmptyCellProps {
  onClick: () => void;
}

export default function ChessEmptyCell({ onClick }: ChessEmptyCellProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded border border-dashed border-secondary-black/60 hover:border-pale-gray/40 transition-colors cursor-pointer min-h-[4.5rem] group"
    >
      <Plus className="size-4 text-secondary-grey/40 group-hover:text-pale-gray/50 transition-colors" />
    </button>
  );
}

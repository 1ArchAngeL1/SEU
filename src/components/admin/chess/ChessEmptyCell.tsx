import { Plus } from 'lucide-react';

interface ChessEmptyCellProps {
  onClick: () => void;
}

export default function ChessEmptyCell({ onClick }: ChessEmptyCellProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded border border-dashed border-admin-border-soft hover:border-admin-border-strong transition-colors cursor-pointer h-[4.75rem] w-full group"
    >
      <Plus className="size-4 text-admin-fg-dim group-hover:text-admin-fg-muted transition-colors" />
    </button>
  );
}

import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'chess' | 'story';

interface UnitsViewToggleProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

const btnToggle = (active: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm transition-colors',
    active
      ? 'bg-primary-orange/15 text-admin-fg border border-primary-orange/30'
      : 'text-admin-fg-muted hover:text-admin-fg border border-transparent'
  );

export default function UnitsViewToggle({
  view,
  setView,
}: UnitsViewToggleProps) {
  return (
    <div className="flex gap-1 p-1 bg-admin-hover rounded-lg border border-admin-border-soft">
      <button
        onClick={() => setView('chess')}
        className={btnToggle(view === 'chess')}
      >
        <Grid3X3 className="size-3.5" />
        Chess
      </button>
      <button
        onClick={() => setView('story')}
        className={btnToggle(view === 'story')}
      >
        <List className="size-3.5" />
        Storey
      </button>
    </div>
  );
}

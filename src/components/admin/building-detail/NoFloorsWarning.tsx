import { Building2 } from 'lucide-react';

interface NoFloorsWarningProps {
  onAddFloor: () => void;
}

export default function NoFloorsWarning({ onAddFloor }: NoFloorsWarningProps) {
  return (
    <div
      className="rounded-xl border p-4 flex items-start gap-3"
      style={{
        borderColor: 'var(--admin-warning-border)',
        background: 'var(--admin-warning-shell)',
      }}
    >
      <Building2
        className="size-4 mt-0.5 shrink-0"
        style={{ color: 'var(--admin-warning-text)' }}
      />
      <div
        className="font-montserrat text-seu-caption"
        style={{ color: 'var(--admin-warning-text)' }}
      >
        No floors registered yet — add a floor on the left to start placing
        units there.
        <button
          onClick={onAddFloor}
          className="block mt-2 text-primary-orange hover:text-primary-orange/80 transition-colors text-seu-caption-sm"
        >
          + Add first floor
        </button>
      </div>
    </div>
  );
}

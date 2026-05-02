import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import type {
  UnitStatus,
  BuildingStatus,
  ProjectStatus,
} from '@/model/types/api';

type AnyStatus = UnitStatus | BuildingStatus | ProjectStatus | string;

type Family = 'emerald' | 'amber' | 'rose' | 'sky' | 'neutral';

interface StatusConfig {
  family: Family;
  label: string;
}

const config: Record<string, StatusConfig> = {
  // Unit statuses
  available: { family: 'emerald', label: 'Available' },
  reserved: { family: 'amber', label: 'Reserved' },
  sold: { family: 'rose', label: 'Sold' },
  not_for_sale: { family: 'neutral', label: 'Not for sale' },
  // Building statuses
  planning: { family: 'sky', label: 'Planning' },
  foundation: { family: 'sky', label: 'Foundation' },
  under_construction: { family: 'amber', label: 'Under construction' },
  finishing: { family: 'amber', label: 'Finishing' },
  completed: { family: 'emerald', label: 'Completed' },
  occupied: { family: 'emerald', label: 'Occupied' },
  // Project statuses
  presale: { family: 'amber', label: 'Pre-sale' },
  sold_out: { family: 'rose', label: 'Sold out' },
  archived: { family: 'neutral', label: 'Archived' },
};

interface FamilyStyle {
  shell: CSSProperties;
  text: CSSProperties;
  dot: CSSProperties;
}

function familyToStyle(family: Family): FamilyStyle {
  if (family === 'neutral') {
    return {
      shell: {
        background: 'transparent',
        borderColor: 'var(--admin-border)',
      },
      text: { color: 'var(--admin-fg-muted)' },
      dot: { background: 'var(--admin-fg-muted)' },
    };
  }
  const prefix = `--admin-${family}` as const;
  return {
    shell: {
      background: `var(${prefix}-bg)`,
      borderColor: `var(${prefix}-border)`,
    },
    text: { color: `var(${prefix}-text)` },
    dot: {
      background: `var(${prefix}-dot)`,
      boxShadow: `0 0 8px var(${prefix}-dot)`,
    },
  };
}

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const c =
    config[status] ?? {
      family: 'neutral' as Family,
      label: String(status).replace(/_/g, ' '),
    };
  const styles = familyToStyle(c.family);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border',
        'font-montserrat font-semibold text-[0.65rem] uppercase tracking-wider',
        className
      )}
      style={{ ...styles.shell, ...styles.text }}
    >
      <span className="size-1.5 rounded-full" style={styles.dot} />
      {c.label}
    </span>
  );
}

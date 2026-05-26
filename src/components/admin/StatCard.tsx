import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: 'green' | 'amber' | 'rose' | 'sky' | 'default';
  className?: string;
}

const accentMap = {
  green: {
    icon: 'bg-emerald-500 text-white',
    stripe: 'bg-emerald-500',
    value: 'text-emerald-300',
  },
  amber: {
    icon: 'bg-amber-500 text-white',
    stripe: 'bg-amber-500',
    value: 'text-amber-300',
  },
  rose: {
    icon: 'bg-rose-500 text-white',
    stripe: 'bg-rose-500',
    value: 'text-rose-300',
  },
  sky: {
    icon: 'bg-sky-500 text-white',
    stripe: 'bg-sky-500',
    value: 'text-sky-300',
  },
  default: {
    icon: 'bg-primary-green text-white',
    stripe: 'bg-primary-green',
    value: 'text-admin-fg',
  },
};

export default function StatCard({
  label,
  value,
  hint,
  icon,
  accent = 'default',
  className,
}: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-admin-card-gradient border border-admin-border p-5 overflow-hidden',
        'shadow-admin hover:border-admin-border-strong hover:shadow-admin-lg transition-all',
        className
      )}
    >
      <span
        className={cn(
          'absolute left-0 top-3 bottom-3 w-1 rounded-r shadow-[0_0_10px]',
          a.stripe,
          accent === 'green'
            ? 'shadow-emerald-500/50'
            : accent === 'amber'
              ? 'shadow-amber-500/50'
              : accent === 'rose'
                ? 'shadow-rose-500/50'
                : accent === 'sky'
                  ? 'shadow-sky-500/50'
                  : 'shadow-primary-green/50'
        )}
      />
      <div className="flex items-start justify-between mb-3 pl-2">
        <span className="text-seu-caption-sm font-montserrat text-admin-fg-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              'size-8 rounded-lg grid place-items-center shrink-0',
              a.icon
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div
        className={cn(
          'pl-2 font-[--font-bodoni] text-seu-heading-lg leading-none tabular-nums',
          a.value
        )}
      >
        {value}
      </div>
      {hint && (
        <div className="pl-2 text-seu-caption-sm font-montserrat text-admin-fg-muted mt-2">
          {hint}
        </div>
      )}
    </div>
  );
}

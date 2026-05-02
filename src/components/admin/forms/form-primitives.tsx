'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Style classes preserved for places that style their own elements (e.g.,
// chess views with custom inputs); but new code should prefer the shadcn
// Input/Textarea components.
export const inputClass =
  'flex w-full min-w-0 rounded-lg h-10 px-3 font-montserrat font-medium text-seu-caption text-admin-fg border border-admin-border bg-admin-input-gradient shadow-admin placeholder:text-admin-fg-dim transition-[color,border-color,background,box-shadow] hover:border-admin-border-strong focus:outline-none focus-visible:border-[color:var(--admin-accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-ring)] disabled:cursor-not-allowed disabled:opacity-50';
export const selectClass = inputClass + ' appearance-none cursor-pointer';
export const textareaClass = inputClass + ' min-h-[5rem] py-2 resize-y h-auto';
export const labelClass =
  'text-seu-caption-sm text-admin-fg-muted font-montserrat font-medium';
export const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 hover:from-primary-green hover:to-primary-green transition-all disabled:opacity-50';
export const btnGhost =
  'text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover font-montserrat text-seu-caption transition-colors px-3 py-2 rounded-md';

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && (
        <span className="text-seu-caption-sm text-admin-fg-dim font-montserrat">
          {hint}
        </span>
      )}
    </div>
  );
}

export function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg cursor-pointer select-none',
        'border border-admin-border bg-admin-input-gradient',
        'transition-colors hover:border-admin-border-strong'
      )}
    >
      <span className="font-montserrat text-seu-caption text-admin-fg">
        {label}
      </span>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className={cn(
            'w-9 h-5 rounded-full transition-colors',
            'bg-admin-deep peer-checked:bg-primary-green',
            'after:content-[""] after:absolute after:top-0.5 after:left-0.5',
            'after:bg-white after:rounded-full after:size-4',
            'after:shadow-md after:transition-transform',
            'peer-checked:after:translate-x-4'
          )}
        />
      </span>
    </label>
  );
}

export interface TabDef {
  id: string;
  label: string;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-admin-deep rounded-lg border border-admin-border mb-5 overflow-x-auto shadow-inner shadow-black/40">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'px-3.5 py-1.5 rounded-md font-montserrat font-medium text-seu-caption-sm whitespace-nowrap transition-all',
            active === t.id
              ? 'bg-admin-elevated-gradient text-admin-fg border border-primary-green/30 shadow-sm shadow-primary-green/10'
              : 'text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover border border-transparent'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function useTabs(initial: string) {
  const [active, setActive] = useState(initial);
  return { active, setActive } as const;
}

export function Section({
  title,
  children,
  cols = 2,
}: {
  title?: string;
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}) {
  const grid =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-4';
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-montserrat text-seu-caption text-admin-fg-muted uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className={cn('grid gap-3', grid)}>{children}</div>
    </div>
  );
}

export function FormFooter({
  onCancel,
  loading,
  submitLabel,
  error,
  extra,
}: {
  onCancel: () => void;
  loading: boolean;
  submitLabel: string;
  error?: string;
  extra?: ReactNode;
}) {
  return (
    <>
      {error && (
        <div
          className="mt-4 rounded-lg border px-3 py-2 text-seu-caption-sm font-montserrat"
          style={{
            borderColor: 'var(--admin-danger-border)',
            background: 'var(--admin-danger-shell)',
            color: 'var(--admin-danger-text)',
          }}
        >
          {error}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 pt-4 mt-2 border-t border-admin-border">
        <div>{extra}</div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export function StringListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const text = value.join('\n');
  return (
    <Textarea
      value={text}
      onChange={(e) =>
        onChange(
          e.target.value
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        )
      }
      placeholder={placeholder ?? 'One per line'}
    />
  );
}

/**
 * A wrapped shadcn Select tuned for our admin forms.
 * Pass `options` with `{value, label}`; uppercase/underscored values are
 * humanised for display when no label is provided.
 */
export function FormSelect({
  value,
  onChange,
  options,
  placeholder,
  size = 'default',
  triggerClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label?: ReactNode; hint?: string }>;
  placeholder?: string;
  size?: 'sm' | 'default';
  triggerClassName?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger size={size} className={triggerClassName}>
        <SelectValue placeholder={placeholder ?? 'Select…'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label ?? humanise(o.value)}
            {o.hint && (
              <span className="ml-1.5 text-admin-fg-dim text-seu-caption-sm">
                · {o.hint}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function humanise(value: string): string {
  return value.replace(/_/g, ' ');
}

export { Input, Textarea };

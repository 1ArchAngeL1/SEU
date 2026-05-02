'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

interface ThemeToggleProps {
  /** Compact icon-only button (good for headers / sidebars). */
  compact?: boolean;
  className?: string;
}

export default function ThemeToggle({
  compact = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know the active theme until after hydration — render
  // a neutral placeholder until then so there's no SSR/CSR mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-9 rounded-lg border border-admin-border bg-admin-card-gradient',
          compact ? 'w-9' : 'w-full',
          className
        )}
        aria-hidden
      />
    );
  }

  if (compact) {
    const isDark = (resolvedTheme ?? theme) === 'dark';
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'size-9 rounded-lg border border-admin-border bg-admin-card-gradient',
          'text-admin-fg hover:border-admin-border-strong hover:bg-admin-hover',
          'transition-colors flex items-center justify-center shadow-admin',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-ring)]',
          className
        )}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>
    );
  }

  const ActiveIcon = themes.find((t) => t.value === theme)?.icon ?? Monitor;
  const activeLabel =
    themes.find((t) => t.value === theme)?.label ?? 'System';

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className={cn('w-full h-9 px-3', className)}>
        <span className="flex items-center gap-2 font-montserrat font-medium text-seu-caption-sm">
          <ActiveIcon className="size-4 text-admin-fg-muted" />
          {activeLabel}
        </span>
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon className="size-3.5" />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

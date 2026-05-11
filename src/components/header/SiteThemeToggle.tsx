'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import type { HeaderVariant } from './SeuHeader';

export function SiteThemeToggle({ variant = 'dark' }: { variant?: HeaderVariant }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`size-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        variant === 'light'
          ? 'border-dark-green/20 text-dark-green hover:bg-dark-green/5'
          : 'border-site-border-soft text-site-fg hover:bg-site-bg-hover'
      }`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

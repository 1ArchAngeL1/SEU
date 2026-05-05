'use client';

import type { ReactNode } from 'react';

interface FormBlockProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function FormBlock({ title, subtitle, children }: FormBlockProps) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-card-gradient shadow-admin overflow-hidden">
      <header className="px-5 py-3 border-b border-admin-border-soft flex items-center gap-3">
        <span className="size-1.5 rounded-full bg-primary-orange shadow-[0_0_6px] shadow-primary-orange/60" />
        <h3 className="font-[--font-bodoni] text-seu-subheading text-admin-fg leading-none">
          {title}
        </h3>
        {subtitle && (
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted truncate">
            · {subtitle}
          </span>
        )}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

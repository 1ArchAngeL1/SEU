import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout
        'flex w-full min-w-0 rounded-lg h-10 px-3',
        'font-montserrat font-medium text-seu-caption text-admin-fg',
        // Surface — gradient flips with theme via custom utility
        'bg-admin-input-gradient border border-admin-border shadow-admin',
        // Placeholder
        'placeholder:text-admin-fg-dim placeholder:font-normal',
        // File input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-seu-caption-sm file:font-medium file:text-admin-fg',
        // Selection
        'selection:bg-[color:var(--admin-accent-soft)] selection:text-admin-fg',
        // Interactive
        'transition-[color,border-color,background,box-shadow]',
        'hover:border-admin-border-strong',
        'focus:outline-none focus-visible:border-[color:var(--admin-accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Validation
        'aria-invalid:border-rose-500/60 aria-invalid:ring-2 aria-invalid:ring-rose-500/25',
        className
      )}
      {...props}
    />
  );
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex w-full min-w-0 rounded-lg min-h-[5rem] px-3 py-2 resize-y',
        'font-montserrat text-seu-caption text-admin-fg',
        'bg-admin-input-gradient border border-admin-border shadow-admin',
        'placeholder:text-admin-fg-dim',
        'transition-[color,border-color,background,box-shadow]',
        'hover:border-admin-border-strong',
        'focus:outline-none focus-visible:border-[color:var(--admin-accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--admin-accent-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input, Textarea };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center gap-1 shrink-0 whitespace-nowrap',
    'rounded-full border px-2 py-0.5',
    'font-montserrat text-[0.65rem] font-semibold uppercase tracking-wider',
    'transition-[color,box-shadow]',
    'overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border-slate-600/80 bg-slate-800/60 text-pale-gray/85 backdrop-blur-sm',
        primary:
          'border-primary-green/40 bg-primary-green/15 text-primary-green shadow-sm shadow-primary-green/10',
        success:
          'border-emerald-400/40 bg-emerald-500/15 text-emerald-200 shadow-sm shadow-emerald-500/10',
        warning:
          'border-amber-400/40 bg-amber-500/15 text-amber-200 shadow-sm shadow-amber-500/10',
        danger:
          'border-rose-400/40 bg-rose-500/15 text-rose-200 shadow-sm shadow-rose-500/10',
        info: 'border-sky-400/40 bg-sky-500/15 text-sky-200 shadow-sm shadow-sky-500/10',
        neutral:
          'border-slate-500/50 bg-slate-700/40 text-secondary-grey',
        outline: 'border-slate-700/70 bg-transparent text-pale-gray/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

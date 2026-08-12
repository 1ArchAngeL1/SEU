import { cn } from '@/lib/utils';

const SIZES = {
  sm: { box: 'size-12', logo: 'w-8', track: 'w-16' },
  md: { box: 'size-20', logo: 'w-14', track: 'w-24' },
  lg: { box: 'size-28', logo: 'w-20', track: 'w-32' },
} as const;

type SeuLoaderProps = {
  size?: keyof typeof SIZES;
  /** Optional caption under the mark. */
  label?: string;
  /**
   * Absolutely fill the nearest positioned ancestor and dim what is behind it.
   * Use over a render that is still decoding; omit for in-flow placement.
   */
  overlay?: boolean;
  className?: string;
};

/**
 * Brand loader — the SEU mark breathing over a soft green halo, with a sweeping
 * track underneath. Animation is pure CSS and there are no hooks, so it drops
 * into server and client trees alike.
 */
export default function SeuLoader({
  size = 'md',
  label,
  overlay = false,
  className,
}: SeuLoaderProps) {
  const s = SIZES[size];

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label ?? 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        overlay &&
          'absolute inset-0 z-20 bg-site-bg/70 backdrop-blur-sm rounded-2xl',
        className
      )}
    >
      <div className={cn('relative flex items-center justify-center', s.box)}>
        {/* Halo — expands and fades out behind the mark. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--site-glow-green)_0%,transparent_70%)] animate-seu-halo"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/common/svgs/seu-logo.svg"
          alt=""
          aria-hidden="true"
          className={cn('relative object-contain animate-seu-breathe', s.logo)}
        />
      </div>

      {/* Sweeping track — gives the wait a sense of direction the pulse alone lacks. */}
      <span
        aria-hidden="true"
        className={cn(
          'h-px overflow-hidden rounded-full bg-site-border-soft',
          s.track
        )}
      >
        <span className="block h-full w-1/3 bg-primary-green animate-seu-sweep" />
      </span>

      {label && (
        <p className="font-montserrat text-seu-caption text-site-fg-muted">
          {label}
        </p>
      )}
    </div>
  );
}

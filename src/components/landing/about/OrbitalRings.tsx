export default function OrbitalRings() {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Outer orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full animate-[spin_120s_linear_infinite]">
          <div className="absolute inset-0 border border-dashed border-secondary-grey/40 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-primary-green/80 shadow-[0_0_12px_2px] shadow-primary-green/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 rounded-full bg-pale-gray/50" />
        </div>
        {/* Middle orbit — counter-rotate */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[730px] h-[730px] rounded-full animate-[spin_90s_linear_infinite_reverse]">
          <div className="absolute inset-0 border border-dashed border-secondary-grey/30 rounded-full" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary-green/60 shadow-[0_0_10px_2px] shadow-primary-green/30" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-pale-gray/40" />
        </div>
        {/* Inner orbit */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full animate-[spin_70s_linear_infinite]">
          <div className="absolute inset-0 border border-dashed border-secondary-grey/20 rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-2 rounded-full bg-primary-green/50 shadow-[0_0_8px_2px] shadow-primary-green/25" />
        </div>
        {/* Radial glow behind video */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] h-[660px] rounded-full bg-primary-green/[0.03] blur-3xl" />
      </div>
    </div>
  );
}

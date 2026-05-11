'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Layers, DoorOpen, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/FadeIn';

const STEPS = [
  { icon: MousePointerClick, screenKey: 'project' as const },
  { icon: Building2, screenKey: 'building' as const },
  { icon: Layers, screenKey: 'floor' as const },
  { icon: DoorOpen, screenKey: 'apartment' as const },
];

function PhoneScreen({ step }: { step: (typeof STEPS)[number]['screenKey'] }) {
  const t = useTranslations('howItWorks');

  return (
    <div className="w-full h-full bg-[#0d141d] flex flex-col overflow-hidden">
      {/* Mini status bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <span className="text-[9px] text-white/60 font-montserrat">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-1.5 rounded-sm border border-white/40 relative">
            <div className="absolute inset-[1px] right-[2px] bg-white/60 rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* Mini nav bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-[10px] font-bold text-white font-montserrat tracking-wider">SEU</span>
        <div className="flex gap-2">
          <div className="w-4 h-[2px] bg-white/40 rounded" />
          <div className="w-4 h-[2px] bg-white/40 rounded" />
        </div>
      </div>

      {/* Screen content based on step */}
      <div className="flex-1 flex flex-col p-3 gap-2 overflow-hidden">
        {step === 'project' && (
          <>
            <span className="text-[9px] text-white/50 font-montserrat uppercase tracking-wider">{t('screenProjectLabel')}</span>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-[#1a2a3a] to-[#0a1520] border border-white/10 flex flex-col justify-end p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full border border-primary-orange/50 bg-primary-orange/20 flex items-center justify-center">
                <MousePointerClick className="size-2.5 text-primary-orange" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-[3px] bg-primary-orange/60 rounded mb-1.5" />
                <div className="w-16 h-[3px] bg-white/40 rounded mb-1" />
                <div className="w-12 h-[2px] bg-white/20 rounded" />
              </div>
            </div>
            <div className="h-12 rounded-lg bg-gradient-to-br from-[#1a2a3a] to-[#0a1520] border border-white/10 flex items-center px-3 gap-2">
              <div className="w-8 h-6 rounded bg-white/10" />
              <div className="flex-1">
                <div className="w-14 h-[2px] bg-white/30 rounded mb-1" />
                <div className="w-10 h-[2px] bg-white/15 rounded" />
              </div>
            </div>
          </>
        )}

        {step === 'building' && (
          <>
            <span className="text-[9px] text-white/50 font-montserrat uppercase tracking-wider">{t('screenBuildingLabel')}</span>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-[#15222f] to-[#0a1520] border border-white/10 relative overflow-hidden flex items-center justify-center">
              {/* Building silhouettes */}
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-14 bg-white/8 rounded-t border border-white/10 border-b-0 relative">
                  <div className="absolute inset-1 flex flex-col gap-[2px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-full h-[2px] bg-white/10 rounded" />
                    ))}
                  </div>
                </div>
                <div className="w-8 h-20 bg-primary-orange/15 rounded-t border-2 border-primary-orange/50 border-b-0 relative">
                  <div className="absolute inset-1 flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="w-full h-[2px] bg-primary-orange/20 rounded" />
                    ))}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-orange flex items-center justify-center">
                    <span className="text-[5px] text-white font-bold">B</span>
                  </div>
                </div>
                <div className="w-7 h-16 bg-white/8 rounded-t border border-white/10 border-b-0 relative">
                  <div className="absolute inset-1 flex flex-col gap-[2px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="w-full h-[2px] bg-white/10 rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#0a1520] to-transparent" />
            </div>
          </>
        )}

        {step === 'floor' && (
          <>
            <span className="text-[9px] text-white/50 font-montserrat uppercase tracking-wider">{t('screenFloorLabel')}</span>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-[#15222f] to-[#0a1520] border border-white/10 relative overflow-hidden flex items-center justify-center">
              {/* Floor stack */}
              <div className="flex flex-col gap-[3px] w-20">
                {Array.from({ length: 6 }).map((_, i) => {
                  const isActive = i === 2;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'h-4 rounded-sm border flex items-center px-1.5 justify-between',
                        isActive
                          ? 'bg-primary-orange/20 border-primary-orange/50'
                          : 'bg-white/5 border-white/10'
                      )}
                    >
                      <span className={cn('text-[6px] font-montserrat', isActive ? 'text-primary-orange' : 'text-white/40')}>
                        F{6 - i}
                      </span>
                      {isActive && <div className="w-1 h-1 rounded-full bg-primary-orange" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === 'apartment' && (
          <>
            <span className="text-[9px] text-white/50 font-montserrat uppercase tracking-wider">{t('screenApartmentLabel')}</span>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-[#15222f] to-[#0a1520] border border-white/10 relative overflow-hidden p-3 flex flex-col">
              {/* Floor plan wireframe */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px]">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const isSelected = i === 1;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'rounded-sm border flex items-center justify-center',
                          isSelected
                            ? 'bg-primary-orange/20 border-primary-orange/50'
                            : 'bg-white/5 border-white/10'
                        )}
                      >
                        <span className={cn('text-[6px] font-montserrat', isSelected ? 'text-primary-orange' : 'text-white/30')}>
                          {101 + i}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Info bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-5 rounded bg-primary-orange/15 border border-primary-orange/30 flex items-center px-1.5">
                  <span className="text-[6px] text-primary-orange font-montserrat">#102 — 65m²</span>
                </div>
                <div className="h-5 px-2 rounded bg-primary-orange flex items-center">
                  <span className="text-[6px] text-white font-montserrat font-medium">View</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-8 pb-1.5 pt-1">
        <div className="w-full h-[3px] bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-site-bg-alt py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Header */}
        <FadeIn className="mb-12 lg:mb-20">
          <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg mb-4">
            {t('title')}
          </h2>
          <p className="font-montserrat text-seu-body-sm lg:text-seu-body text-site-fg-muted max-w-2xl">
            {t('subtitle')}
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — Phone mockup */}
          <FadeIn direction="left" className="shrink-0">
            <div className="relative mx-auto">
              {/* Phone frame */}
              <div className="relative w-[240px] h-[490px] lg:w-[280px] lg:h-[572px] rounded-[2.5rem] lg:rounded-[3rem] border-[6px] border-site-fg/15 bg-black shadow-[0_0_80px_20px_var(--site-fg-dim)] overflow-hidden">
                {/* Dynamic notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 lg:w-28 h-5 lg:h-6 bg-black rounded-b-2xl z-20" />

                {/* Screen content */}
                <div className="w-full h-full">
                  <PhoneScreen step={STEPS[activeStep].screenKey} />
                </div>
              </div>

              {/* Glow under phone */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-8 bg-primary-orange/15 blur-2xl rounded-full" />
            </div>
          </FadeIn>

          {/* Right — Steps */}
          <FadeIn direction="right" delay={200} className="flex-1 w-full">
            <div className="flex flex-col gap-4 lg:gap-5">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      'group flex items-start gap-4 lg:gap-5 p-4 lg:p-6 rounded-xl lg:rounded-2xl border text-left transition-all duration-300',
                      isActive
                        ? 'bg-site-bg border-primary-orange/40 shadow-lg shadow-primary-orange/5'
                        : 'bg-transparent border-site-border-soft hover:bg-site-bg hover:border-site-border-strong'
                    )}
                  >
                    {/* Step number + icon */}
                    <div
                      className={cn(
                        'size-12 lg:size-14 rounded-xl shrink-0 flex items-center justify-center transition-all duration-300',
                        isActive
                          ? 'bg-primary-orange text-white shadow-md shadow-primary-orange/30'
                          : 'bg-site-bg-hover text-site-fg-dim group-hover:text-site-fg'
                      )}
                    >
                      <Icon className="size-5 lg:size-6" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'font-montserrat text-seu-caption-sm uppercase tracking-wider transition-colors',
                            isActive ? 'text-primary-orange' : 'text-site-fg-dim'
                          )}
                        >
                          {t('step', { n: i + 1 })}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          'font-bodoni text-seu-subheading lg:text-seu-heading transition-colors leading-tight',
                          isActive ? 'text-site-fg-strong' : 'text-site-fg'
                        )}
                      >
                        {t(`steps.${i}.title`)}
                      </h3>
                      <p
                        className={cn(
                          'font-montserrat text-seu-caption lg:text-seu-body-sm mt-1 lg:mt-2 leading-relaxed transition-all duration-300',
                          isActive
                            ? 'text-site-fg-muted max-h-24 opacity-100'
                            : 'text-site-fg-dim max-h-0 lg:max-h-24 opacity-0 lg:opacity-100 overflow-hidden'
                        )}
                      >
                        {t(`steps.${i}.description`)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <FadeIn delay={400} className="mt-8 lg:mt-10">
              <Link
                href="/visual-search"
                className="inline-block bg-primary-orange text-white font-montserrat font-medium text-seu-body px-10 py-3 rounded-xl hover:bg-primary-orange/85 transition-colors"
              >
                {t('cta')}
              </Link>
            </FadeIn>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

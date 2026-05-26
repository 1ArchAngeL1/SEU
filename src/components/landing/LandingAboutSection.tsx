'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/FadeIn';
import OrbitalRings from '@/components/landing/about/OrbitalRings';
import { SeuGreenlogo } from '../common/SeuGreenlogo';

export default function LandingAboutSection() {
  const t = useTranslations('landing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only load video when section scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative bg-site-bg py-16 lg:py-40 site-noise site-glow-center">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Top Row */}
        <FadeIn className="flex items-start justify-between mb-8 lg:mb-16">
          {/* Title - Left */}
          <h2 className="font-bodoni text-seu-heading lg:text-seu-title text-site-fg-strong">
            {t('aboutCompany')}
          </h2>

          <div className="hidden lg:block">
            <SeuGreenlogo />
          </div>
        </FadeIn>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <FadeIn
            direction="left"
            delay={150}
            className="hidden lg:block flex-1 max-w-xs"
          >
            <p className="text-seu-body-sm lg:text-seu-body text-site-fg-strong leading-relaxed">
              {t('realEstateSince')}
            </p>
          </FadeIn>

          {/* Center — Video + Orbits wrapper */}
          <div className="relative flex items-center justify-center w-full lg:w-auto">
            <div
              ref={containerRef}
              className="relative z-10 w-full lg:w-[928px] h-[16rem] lg:h-[600px] rounded-xl overflow-hidden bg-secondary-black ring-1 ring-site-border-soft shadow-[0_0_30px_8px_var(--site-bg)]"
            >
              {isVisible && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="/video/SEU%20VARKETILI.mp4" type="video/mp4" />
                </video>
              )}

              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-primary-green flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Orbits — positioned from the flex row, centered on the video */}
          <OrbitalRings />

          <FadeIn
            direction="right"
            delay={150}
            className="lg:flex-1 lg:max-w-xs lg:text-right"
          >
            <p className="text-seu-body-sm lg:text-seu-body text-site-fg-strong leading-relaxed">
              {t('companyDescription')}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export default function LandingAboutSection() {
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
    <section className="relative bg-dark-green py-80 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-16">
          {/* Title - Left */}
          <h2 className="font-bodoni text-seu-title text-white">
            About company.
          </h2>

          <div className="w-16 h-16 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-primary-orange rounded-lg relative shadow-[0_0_20px_-4px] shadow-primary-orange/30">
              <div className="absolute -top-1.5 -right-1.5 w-12 h-12 border-2 border-primary-orange/50 rounded-lg" />
              <div className="absolute -top-3 -right-3 w-12 h-12 border-2 border-primary-orange/20 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-8">
          {/* Left Text */}
          <div className="flex-1 max-w-xs">
            <p className="font-bodoni text-seu-body-lg text-white">
              Real estate market since 2014.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Outer orbit */}
            <div className="absolute w-[1085px] h-[1085px] rounded-full animate-[spin_120s_linear_infinite]">
              <div className="absolute inset-0 border border-dashed border-secondary-grey/40 rounded-full" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-primary-orange/80 shadow-[0_0_12px_2px] shadow-primary-orange/40" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 rounded-full bg-pale-gray/50" />
            </div>
            {/* Middle orbit — counter-rotate */}
            <div className="absolute w-[903px] h-[903px] rounded-full animate-[spin_90s_linear_infinite_reverse]">
              <div className="absolute inset-0 border border-dashed border-secondary-grey/30 rounded-full" />
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary-orange/60 shadow-[0_0_10px_2px] shadow-primary-orange/30" />
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-pale-gray/40" />
            </div>
            {/* Inner orbit */}
            <div className="absolute w-[695px] h-[695px] rounded-full animate-[spin_70s_linear_infinite]">
              <div className="absolute inset-0 border border-dashed border-secondary-grey/20 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-2 rounded-full bg-primary-orange/50 shadow-[0_0_8px_2px] shadow-primary-orange/25" />
            </div>

            {/* Radial glow behind video */}
            <div className="absolute w-[750px] h-[750px] rounded-full bg-primary-orange/[0.03] blur-3xl pointer-events-none" />

            <div
              ref={containerRef}
              className="relative w-[928px] h-[600px] rounded-xl overflow-hidden bg-secondary-black ring-1 ring-white/10"
            >
              {isVisible && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="video/seu_video.mp4" type="video/mp4" />
                </video>
              )}

              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-primary-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-xs text-right">
            <p className="text-seu-body text-white leading-relaxed">
              The company&#39;s team, consisting of experienced professionals, cares
              about continuous development, adheres to high construction
              standards and uses innovative technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function ProjectVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy-load only when the section scrolls into view
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

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  }

  return (
    <section className="relative bg-site-bg py-16 lg:py-28 site-noise">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-center">
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
                <source src="/video/seu_video.mp4" type="video/mp4" />
              </video>
            )}

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
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
      </div>
    </section>
  );
}

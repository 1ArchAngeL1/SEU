'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export default function LandingAboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
            <div className="w-12 h-12 border-2 border-primary-green rounded-lg relative">
              <div className="absolute -top-1 -right-1 w-12 h-12 border-2 border-primary-green/60 rounded-lg" />
              <div className="absolute -top-2 -right-2 w-12 h-12 border-2 border-primary-green/30 rounded-lg" />
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
            <div className="absolute w-[1085px] h-[1085px] border border-dashed border-secondary-grey rounded-full" />
            <div className="absolute w-[903px] h-[903px] border border-dashed border-secondary-grey rounded-full" />
            <div className="absolute w-[695px] h-[695px] border border-dashed border-secondary-grey rounded-full" />

            <div className="relative w-[928px] h-[600px] rounded-xl overflow-hidden bg-secondary-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster=""
                onEnded={() => setIsPlaying(false)}
              >
                <source src="" type="video/mp4" />
              </video>

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

          <div className="flex-1 max-w-xs text-right">
            <p className="text-seu-body text-white leading-relaxed">
              The company's team, consisting of experienced professionals, cares
              about continuous development, adheres to high construction
              standards and uses innovative technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

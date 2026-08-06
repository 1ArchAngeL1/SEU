'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface NewsVideoProps {
  src: string;
  /** Still image shown before playback (usually the article hero). */
  poster?: string;
  title?: string;
}

/**
 * Elegant article video block: shows a poster with a centered play button,
 * then swaps to a native `<video>` (with controls) on click.
 */
export default function NewsVideo({ src, poster, title }: NewsVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-dark-green ring-1 ring-dark-green/10 shadow-xl">
      {playing ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full bg-black object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={title ? `Play video: ${title}` : 'Play video'}
          className="group absolute inset-0 w-full h-full cursor-pointer"
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={title ?? ''}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 bg-gradient-to-br from-dark-green to-secondary-black" />
          )}

          {/* Darkening veil for contrast */}
          <span className="absolute inset-0 bg-dark-green/35 transition-colors duration-300 group-hover:bg-dark-green/20" />

          {/* Play button */}
          <span className="absolute inset-0 grid place-items-center">
            <span className="size-16 lg:size-20 rounded-full bg-white/90 backdrop-blur grid place-items-center text-dark-green shadow-2xl transition-transform duration-300 group-hover:scale-110">
              <Play className="size-7 lg:size-8 translate-x-0.5 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

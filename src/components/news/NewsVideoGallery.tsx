'use client';

import { useEffect, useState } from 'react';
import { Play, X, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/FadeIn';
import {
  CHANNEL_VIDEOS,
  YOUTUBE_CHANNEL_URL,
  type ChannelVideo,
} from '@/lib/youtube-videos';

/**
 * Gallery of the SEU YouTube channel's videos, shown under the news feed.
 * Cards are lightweight thumbnail facades — the actual YouTube iframe is only
 * mounted (in a lightbox) once a video is clicked, so the page stays fast.
 */
export default function NewsVideoGallery() {
  const t = useTranslations('news');
  const [activeId, setActiveId] = useState<string | null>(null);

  // While the lightbox is open, lock body scroll and close on Escape.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId]);

  if (CHANNEL_VIDEOS.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 border-t border-site-border">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        {/* Heading + channel link */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 lg:mb-8">
          <h2 className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-heading-lg text-site-fg leading-none">
            {t('videosTitle')}
          </h2>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-site-fg-muted hover:text-site-fg transition-colors"
          >
            <Youtube className="size-5 text-[#ff0033]" />
            {t('visitChannel')}
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {CHANNEL_VIDEOS.map((video, i) => (
            <FadeIn key={video.id} delay={(i % 3) * 70} duration={500}>
              <VideoCard video={video} onPlay={() => setActiveId(video.id)} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Lightbox player */}
      {activeId && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveId(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveId(null)}
              aria-label="Close"
              className="absolute -top-11 right-0 inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="size-6" />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&rel=0`}
                title={t('videosTitle')}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function VideoCard({
  video,
  onPlay,
}: {
  video: ChannelVideo;
  onPlay: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group block w-full text-left focus:outline-none"
      aria-label={video.title}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border border-site-border-soft bg-secondary-black">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt={video.title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-secondary-black">
            <Youtube className="size-10 text-pale-gray/15" />
          </div>
        )}

        {/* Depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Play button */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary-green/90 shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-110">
            <Play className="size-6 translate-x-0.5 text-white" fill="currentColor" />
          </span>
        </span>
      </div>

      <h3 className="mt-3 font-montserrat font-medium text-seu-body-sm text-site-fg leading-snug line-clamp-2 group-hover:text-primary-green transition-colors">
        {video.title}
      </h3>
    </button>
  );
}

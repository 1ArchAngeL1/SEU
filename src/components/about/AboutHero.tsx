'use client';

import Image from 'next/image';

export default function AboutHero() {
  return (
    <div className="relative h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-10rem)] overflow-hidden">
      {/* Banner image */}
      <Image
        src="/about/README.jpg"
        alt="SEU Development office"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-secondary-black/60" />

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-site-bg to-transparent" />
      {/* Fade gradient on bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-site-bg to-transparent" />
    </div>
  );
}

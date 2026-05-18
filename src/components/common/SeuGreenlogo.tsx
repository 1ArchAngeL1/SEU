'use client';

import Image from 'next/image';

export const SeuGreenlogo = () => {
  return (
    <div className="relative w-28 h-28 mr-20 group group-hover:h-14.5 transition-all duration-500 ease-in-out cursor-pointer">
      <Image
        src="/common/pngs/seu-logo-green.png"
        alt="SEU Development Logo"
        fill
        className={`object-contain absolute top-0 left-0 transition-all duration-500 ease-in-out group-hover:opacity-0`}
      />
    </div>
  );
};

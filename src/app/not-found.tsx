import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div className="min-h-dvh bg-secondary-black flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Large 404 — subtle embossed text, just darker than bg */}
      <h1
        className="font-[--font-bodoni] font-normal text-[10rem] sm:text-[14rem] lg:text-[20rem] leading-none select-none text-black/30"
      >
        404
      </h1>

      {/* Message */}
      <div className="flex flex-col items-center gap-4 -mt-6 lg:-mt-12 relative z-10">
        <p className="font-montserrat text-seu-body-sm lg:text-seu-body text-secondary-grey text-center">
          Something Unexpected Happened
        </p>
        <Link
          href="/"
          className="font-montserrat font-medium text-seu-body-sm lg:text-seu-body text-pale-gray hover:text-primary-orange transition-colors"
        >
          To home page
        </Link>
      </div>
    </div>
  );
}

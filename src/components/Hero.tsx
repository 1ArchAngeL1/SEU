import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0c1829] pt-16 overflow-hidden">
      {/* Moon/Planet Image - Left Side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
        <Image
          src="/moon.png"
          alt="Moon"
          fill
          className="object-contain opacity-80"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          {/* Left side - Spacer for moon */}
          <div className="flex-1 hidden lg:block" />

          {/* Right side - Text Content */}
          <div className="flex-1 text-center lg:text-left lg:pl-20">
            <p className="text-[#c9a962] text-xs uppercase tracking-[0.3em] mb-4">
              The company&apos;s team
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2">
              SEU VARKETILI
            </h1>

            {/* Slider dots */}
            <div className="flex items-center gap-2 justify-center lg:justify-start mt-8">
              <button className="w-2 h-2 rounded-full bg-[#c9a962]" />
              <button className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors" />
              <button className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

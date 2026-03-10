import Image from 'next/image';
import { User } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: 'Kate Asyeladze', position: 'Marketing Lead' },
  { name: 'Kate Asyeladze', position: 'Marketing Lead' },
];

export default function AboutTeam() {
  return (
    <div className="relative py-20 lg:py-28 overflow-hidden">
      {/* PLACEHOLDER: IMAGE - Team section background */}
      <div className="absolute inset-x-0 top-0 bottom-16 bg-secondary-black/60 flex items-center justify-center">
        <Image
          src="/common/svgs/SEUcolored.svg"
          alt="Team background"
          width={120}
          height={120}
          className="opacity-30"
        />
      </div>

      {/* Fade gradient on top */}
      <div className="absolute inset-x-0 top-0 h-10 z-[1] bg-gradient-to-b from-dark-green to-transparent" />
      {/* Fade gradient on bottom */}
      <div className="absolute inset-x-0 bottom-16 h-10 z-[1] bg-gradient-to-t from-dark-green to-transparent" />

      <div className="relative z-10 h-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left - Text */}
          <div className="flex-1 max-w-xl">
            <h2 className="font-[--font-bodoni] font-normal text-seu-title text-white uppercase mb-4">
              Our Team.
            </h2>
            <p className="font-[--font-bodoni] font-normal text-seu-body-lg text-pale-gray/70 italic">
              Meet Our Leaders
            </p>
          </div>

          {/* Right - Team Members */}
          <div className="flex-1 flex gap-6 justify-center lg:justify-end">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="w-56 rounded-lg bg-dark-green overflow-hidden">
                {/* PLACEHOLDER: IMAGE - Team member photo */}
                <div className="w-full h-64 bg-secondary-black/40 flex items-center justify-center">
                  <User className="w-12 h-12 text-secondary-grey/50" />
                </div>
                <div className="px-4 py-4 text-center">
                  <p className="font-montserrat font-semibold text-seu-caption text-pale-gray uppercase tracking-wider">
                    {member.name}
                  </p>
                  <p className="font-montserrat font-normal text-seu-caption-sm text-pale-gray/60 mt-1">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="font-montserrat font-semibold text-seu-caption text-secondary-grey leading-relaxed mt-6 mb-16 max-w-xl">
          Successfully completed projects by SEU Development include the old
          and new buildings of the Georgian National University, which house
          modern educational and exhibition facilities, as well as a business
          center in the suburbs of Tbilisi.
        </p>
      </div>
    </div>
  );
}

'use client';

import UpcomingProjectCard from './UpcomingProjectCard';

const UPCOMING_PROJECTS = [
  {
    name: 'SEU VARKETILI',
    startDate: '01.02.2028',
  },
  {
    name: 'SEU VARKETILI',
    startDate: '01.02.2028',
  },
];

export default function UpcomingSection() {
  return (
    <section className="bg-dark-green py-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Title */}
        <h2 className="font-bodoni text-seu-title text-white mb-12">
          Upcoming .
        </h2>

        {/* Project Cards - Staggered Layout */}
        <div className="flex flex-col gap-12">
          {UPCOMING_PROJECTS.map((project, index) => (
            <div
              key={index}
              className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <UpcomingProjectCard
                name={project.name}
                startDate={project.startDate}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { OngoingProjectCard } from '@/components/landing/OngoingProjectCard';

const ONGOING_PROJECTS = [
  {
    name: 'SEU VAJA',
    projectId: 'TVAVADETS: ID12345',
    location: 'Saburtalo',
    sizeFrom: 64,
    sizeTo: 250,
    badge: 'EFF',
  },
  {
    name: 'SEU VARKETILI',
    projectId: 'TVAVADETS: ID12346',
    location: 'Varketili',
    sizeFrom: 45,
    sizeTo: 180,
    badge: 'NEW',
  },
  {
    name: 'SEU DIDI DIGHOMI',
    projectId: 'TVAVADETS: ID12347',
    location: 'Didi Dighomi',
    sizeFrom: 55,
    sizeTo: 200,
    badge: 'RACXA',
  },
];

export default function OngoingSection() {
  return (
    <section className="bg-dark-green py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        {/* Title */}
        <h2 className="font-bodoni text-seu-title text-white mb-12">
          Ongoing .
        </h2>

        {/* Project Cards */}
        <div className="flex flex-col gap-8">
          {ONGOING_PROJECTS.map((project, index) => (
            <OngoingProjectCard
              key={index}
              name={project.name}
              projectId={project.projectId}
              location={project.location}
              sizeFrom={project.sizeFrom}
              sizeTo={project.sizeTo}
              badge={project.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

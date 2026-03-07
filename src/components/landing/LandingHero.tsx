'use client';

import { useState } from 'react';
import ChooseApartment from '../ChooseApartment';

const PROJECTS = [
  { name: 'SEU VARKETILI' },
  { name: 'SEU DIDI DIGHOMI' },
  { name: 'SEU ISANI' },
];

export default function LandingHero() {
  const [selectedProject, setSelectedProject] = useState(0);

  return (
    <section className="relative h-180 bg-dark-green overflow-hidden">
      {/* PLACEHOLDER: IMAGE - Aerial/3D map background of the city */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-green to-secondary-black/50">
        {/* Map marker placeholder */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 bg-primary-green rounded-full border-2 border-white shadow-lg" />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-end justify-between gap-8">
          {/* Project Selector - Left */}
          <div className="flex flex-col gap-4">
            <p className="text-seu-caption text-secondary-grey">
              Choose, Register
            </p>
            <h1 className="font-bodoni text-seu-title lg:text-seu-title-xl text-white">
              {PROJECTS[selectedProject].name}
            </h1>
            {/* Pagination dots */}
            <div className="flex items-center gap-2 mt-2">
              {PROJECTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProject(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedProject
                      ? 'bg-primary-green'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Select project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-8 lg:p-12">
        <ChooseApartment
          onSearch={(filters) => console.log('Search:', filters)}
          onReset={() => console.log('Reset')}
        />
      </div>
    </section>
  );
}

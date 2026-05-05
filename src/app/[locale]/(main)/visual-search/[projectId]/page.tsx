'use client';

import { use, useState } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useProject } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import { pickLocale, type Locale } from '@/lib/i18n-helpers';
import { fileUrl } from '@/lib/file-url';
import type { Building, PolygonPoint } from '@/model/types/api';

/** Convert percentage-based polygon points (0-100) directly to SVG points string. */
function toSvgPoints(polygon: PolygonPoint[]): string {
  return polygon.map((pt) => `${pt.x},${pt.y}`).join(' ');
}


export default function VisualSearchProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const locale = useLocale() as Locale;
  const router = useRouter();

  const projectQ = useProject(projectId);
  const buildingsQ = useBuildingsByProject(projectId);

  const project = projectQ.data;
  const buildings = buildingsQ.data ?? [];
  const isLoading = projectQ.isLoading || buildingsQ.isLoading;

  const renderImage = fileUrl(project?.renderImage);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const buildingsWithPolygons = buildings.filter(
    (b) => b.polygon && b.polygon.length >= 3
  );

  function handleBuildingClick(building: Building) {
    router.push(`/visual-search/${projectId}/${building.id}`);
  }

  // Fallback: no render image → show grid cards
  if (!isLoading && !renderImage) {
    return (
      <main className="bg-dark-green min-h-dvh py-20">
        <div className="max-w-[1920px] mx-auto px-10">
          <Link
            href="/visual-search"
            className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
          {project && (
            <h1 className="font-bodoni text-seu-title text-white mb-16">
              {pickLocale(project.name, locale)}
            </h1>
          )}
          <p className="text-secondary-grey font-montserrat text-seu-body text-center py-32">
            No render image available for this project.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-dark-green min-h-dvh py-20">
      <div className="max-w-[1920px] mx-auto px-10">
        {/* Back link */}
        <Link
          href="/visual-search"
          className="inline-flex items-center gap-2 font-montserrat text-seu-caption text-secondary-grey hover:text-pale-gray transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        {/* Project header */}
        {project && (
          <div className="mb-10">
            <h1 className="font-bodoni text-seu-title text-white mb-2">
              {pickLocale(project.name, locale)}
            </h1>
            {project.location?.address && (
              <p className="font-montserrat text-seu-body text-secondary-grey">
                {project.location.address}
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-8 text-primary-orange animate-spin" />
          </div>
        )}

        {/* Render image with polygon overlays */}
        {renderImage && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-pale-gray/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={renderImage}
              alt={project ? pickLocale(project.name, locale) : 'Project render'}
              className="w-full h-auto block"
            />

            {/*
              SVG overlay — uses viewBox 0-100 matching the percentage-based
              polygon coordinates from the backend. preserveAspectRatio="none"
              stretches the SVG to fill the container exactly like the image,
              so polygons stay aligned at any screen size.
            */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {buildingsWithPolygons.map((building) => {
                const isHovered = hoveredId === building.id;
                return (
                  <g
                    key={building.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredId(building.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleBuildingClick(building)}
                  >
                    <polygon
                      points={toSvgPoints(building.polygon!)}
                      fill={isHovered ? 'rgba(255,107,53,0.2)' : 'transparent'}
                      stroke={isHovered ? '#FF6B35' : 'transparent'}
                      strokeWidth={isHovered ? 1.5 : 0}
                      vectorEffect="non-scaling-stroke"
                      filter={isHovered ? 'url(#glow)' : undefined}
                      className="transition-all duration-300 ease-out"
                    />
                    {isHovered && (
                      <polygon
                        points={toSvgPoints(building.polygon!)}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth={0.5}
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="2 2"
                        className="animate-[dash_8s_linear_infinite]"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </main>
  );
}

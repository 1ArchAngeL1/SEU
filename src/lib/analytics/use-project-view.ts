'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/model/types/api';
import { type ProjectPlacement, trackViewProject } from './events';

/**
 * Report a project impression once per project, from a page or a hero that
 * shows one.
 *
 * The guard is a ref rather than an effect dependency on purpose: the query
 * hands back a new object on every refetch, React calls effects twice in
 * development, and a hero re-renders on every slide — none of which is a new
 * impression. One event per project id, for as long as the component lives.
 */
export function useProjectView(
  project: Project | null | undefined,
  placement: ProjectPlacement
): void {
  const reported = useRef<string | null>(null);

  useEffect(() => {
    if (!project?.id || reported.current === project.id) return;
    reported.current = project.id;
    trackViewProject(project, placement);
  }, [project, placement]);
}

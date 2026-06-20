import { Link } from '@/i18n/navigation';
import { ChevronLeft } from 'lucide-react';

interface BuildingDetailBreadcrumbsProps {
  projectId?: string;
  projectName: string;
  buildingBlock: string;
}

export default function BuildingDetailBreadcrumbs({
  projectId,
  projectName,
  buildingBlock,
}: BuildingDetailBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 font-montserrat text-seu-caption-sm">
      <Link
        href="/admin/buildings"
        className="text-admin-fg-muted hover:text-admin-fg transition-colors flex items-center gap-1"
      >
        <ChevronLeft className="size-3.5" />
        Buildings
      </Link>
      <span className="text-admin-fg-dim">/</span>
      {projectId ? (
        <Link
          href={`/admin/projects/${projectId}`}
          className="text-admin-fg-muted hover:text-admin-fg transition-colors"
        >
          {projectName}
        </Link>
      ) : (
        <span className="text-admin-fg-muted">{projectName}</span>
      )}
      <span className="text-admin-fg-dim">/</span>
      <span className="text-admin-fg">Block {buildingBlock}</span>
    </div>
  );
}

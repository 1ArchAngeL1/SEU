import ProjectDetailClient from '@/components/admin/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  return <ProjectDetailClient projectId={projectId} />;
}

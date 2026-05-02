import BuildingDetailClient from '@/components/admin/BuildingDetailClient';

interface BuildingDetailPageProps {
  params: Promise<{ buildingId: string }>;
}

export default async function BuildingDetailPage({
  params,
}: BuildingDetailPageProps) {
  const { buildingId } = await params;
  return <BuildingDetailClient buildingId={buildingId} />;
}

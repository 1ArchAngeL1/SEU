import { notFound } from 'next/navigation';
import { getBuildingById } from '@/prisma/building';
import { getApartmentsByBuildingId } from '@/prisma/apartment';
import BuildingDetailClient from '@/components/admin/BuildingDetailClient';

interface BuildingDetailPageProps {
  params: Promise<{ buildingId: string }>;
}

export default async function BuildingDetailPage({
  params,
}: BuildingDetailPageProps) {
  const { buildingId } = await params;

  const building = await getBuildingById(buildingId);
  if (!building || !building.project) notFound();

  const apartments = await getApartmentsByBuildingId(buildingId);

  return (
    <BuildingDetailClient
      building={{
        id: building.id,
        block: building.block,
        floorCount: building.floorCount,
        project: {
          id: building.project.id,
          name: building.project.name,
        },
      }}
      initialApartments={apartments}
    />
  );
}

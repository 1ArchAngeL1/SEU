'use server';

import prisma from '@/lib/prisma';
import {
  BuildingDTO,
  CreateBuildingDTO,
  UpdateBuildingDTO,
} from '@/model/dto/building.dto';
import { PageableDTO } from '@/model/dto/pageable.dto';

export async function createBuilding(data: CreateBuildingDTO) {
  await prisma.building.create({ data });
}

export async function updateBuilding(id: string, data: UpdateBuildingDTO) {
  await prisma.building.update({ where: { id }, data });
}

export async function getBuildingById(id: string) {
  return prisma.building.findUnique({
    where: { id },
    include: { project: true },
  });
}

export async function getAllBuildingsByProjectId(
  projectId: string
): Promise<BuildingDTO[]> {
  return prisma.building.findMany({ where: { projectId } });
}

export async function getBuildingsPaged({ page, pageSize }: PageableDTO) {
  const [items, total] = await Promise.all([
    prisma.building.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    }),
    prisma.building.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function removeBuilding(id: string) {
  await prisma.building.delete({ where: { id } });
}

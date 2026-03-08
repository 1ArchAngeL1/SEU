'use server';

import prisma from '@/lib/prisma'

export async function addBuilding(data: { projectId: string; block: string; floorCount: number }) {
  await prisma.building.create({ data })
}

export async function getBuildings(page: number = 1, pageSize: number = 10) {
  const [items, total] = await Promise.all([
    prisma.building.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    }),
    prisma.building.count(),
  ])

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function removeBuilding(id: string) {
  await prisma.building.delete({ where: { id } })
}
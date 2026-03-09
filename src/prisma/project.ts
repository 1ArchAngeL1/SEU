'use server';

import prisma from '@/lib/prisma';
import { ProjectDTO } from '@/model/dto/project.dto';

export async function addProject(data: { name: string; address: string }) {
  await prisma.project.create({ data });
}

export async function getAllProjects(): Promise<ProjectDTO[]> {
  try {
    return prisma.project.findMany();
  } catch (error) {
    console.error(error);
  }

  return [];
}

export async function getProjectsPaged(
  page: number = 1,
  pageSize: number = 10
) {
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function removeProject(id: string) {
  await prisma.project.delete({ where: { id } });
}

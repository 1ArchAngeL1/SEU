'use server';

import prisma from '@/lib/prisma'

export async function addProject(data: { name: string; address: string }) {
  await prisma.project.create({ data })
}

export async function getProjects(page: number = 1, pageSize: number = 10) {
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count(),
  ])

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function removeProject(id: string) {
  await prisma.project.delete({ where: { id } })
}
'use server';

import prisma from '@/lib/prisma'

export async function addContactRequest(data: {email: string, phone: string, name: string}) {
  await prisma.contactRequest.create({data})
}

export async function removeContactRequest(id: string) {
  await prisma.contactRequest.delete({ where: { id } })
}

export async function getContactRequests(page: number = 1, pageSize: number = 10) {
  const [items, total] = await Promise.all([
    prisma.contactRequest.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactRequest.count(),
  ])

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}
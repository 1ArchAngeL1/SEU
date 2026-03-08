'use server';

import prisma from '@/lib/prisma'
import type { RoomType } from '@prisma/client'

type RoomSpec = {
  roomType: RoomType
  size: number
}

export async function addApartment(data: {
  buildingId: string
  floor: number
  apartmentNo: string
  totalSize: number
  mainSize: number
  openSpaceSize: number
  bedroomCount: number
  rooms: RoomSpec[]
}) {
  await prisma.apartment.create({ data })
}

export async function getApartments(page: number = 1, pageSize: number = 10) {
  const [items, total] = await Promise.all([
    prisma.apartment.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { building: true },
    }),
    prisma.apartment.count(),
  ])

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function removeApartment(id: string) {
  await prisma.apartment.delete({ where: { id } })
}
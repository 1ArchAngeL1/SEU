'use server';

import prisma from '@/lib/prisma';
import type { RoomType } from '@prisma/client';
import { ApartmentDTO, ApartmentFilterDTO } from '@/model/dto/apartment.dto';
import type { PageableDTO, PageableResult } from '@/model/dto/pageable.dto';

type RoomSpec = {
  roomType: RoomType;
  size: number;
};

export async function addApartment(data: {
  buildingId: string;
  floor: number;
  apartmentNo: number;
  totalSize: number;
  mainSize: number;
  openSpaceSize: number;
  bedroomCount: number;
  rooms: RoomSpec[];
  price: number;
}) {
  await prisma.apartment.create({ data });
}

export async function getAllApartmentsByBuildingId(buildingId: string): Promise<ApartmentDTO[]> {
  return prisma.apartment.findMany({ where: { buildingId } });
}

export async function getAllApartmentsFiltered(
  filter: ApartmentFilterDTO,
  pageable: PageableDTO = { page: 1, pageSize: 10 }
): Promise<PageableResult<ApartmentDTO>> {
  const where: Record<string, unknown> = {
    buildingId: filter.buildingId,
  };

  if (filter.sizeFrom !== undefined || filter.sizeTo !== undefined) {
    where.totalSize = {
      ...(filter.sizeFrom !== undefined && { gte: filter.sizeFrom }),
      ...(filter.sizeTo !== undefined && { lte: filter.sizeTo }),
    };
  }

  if (filter.selectedRooms !== null && filter.selectedRooms.length > 0) {
    where.bedroomCount = { in: filter.selectedRooms };
  }

  if (filter.priceFrom !== undefined || filter.priceTo !== undefined) {
    where.price = {
      ...(filter.priceFrom !== undefined && { gte: filter.priceFrom }),
      ...(filter.priceTo !== undefined && { lte: filter.priceTo }),
    };
  }

  const [items, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      skip: (pageable.page - 1) * pageable.pageSize,
      take: pageable.pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.apartment.count({ where }),
  ]);

  return {
    items,
    total,
    page: pageable.page,
    pageSize: pageable.pageSize,
    totalPages: Math.ceil(total / pageable.pageSize),
  };
}

export async function getApartmentsPaged(page: number = 1, pageSize: number = 10) {
  const [items, total] = await Promise.all([
    prisma.apartment.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { building: true },
    }),
    prisma.apartment.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function removeApartment(id: string) {
  await prisma.apartment.delete({ where: { id } });
}

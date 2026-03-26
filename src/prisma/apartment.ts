'use server';

import prisma from '@/lib/prisma';
import {
  ApartmentDTO,
  ApartmentFilterDTO,
  CreateApartmentDTO,
  UpdateApartmentDTO,
} from '@/model/dto/apartment.dto';
import type { PageableDTO, PageableResult } from '@/model/dto/pageable.dto';

export async function createApartment(data: CreateApartmentDTO): Promise<void> {
  await prisma.apartment.create({ data });
}

export async function updateApartment(
  id: string,
  data: UpdateApartmentDTO
): Promise<void> {
  await prisma.apartment.update({ where: { id }, data });
}

export async function getApartmentById(
  id: string
): Promise<ApartmentDTO | null> {
  return prisma.apartment.findUnique({
    where: { id },
    include: {
      building: {
        include: {
          project: true,
        },
      },
    },
  });
}

export async function getApartmentsByBuildingId(
  buildingId: string
): Promise<ApartmentDTO[]> {
  return prisma.apartment.findMany({
    where: { buildingId },
    orderBy: [{ floor: 'asc' }, { position: 'asc' }],
    include: {
      building: {
        include: {
          project: true,
        },
      },
    },
  });
}

export async function getAllApartmentsFiltered(
  filter: ApartmentFilterDTO,
  pageable: PageableDTO = { page: 1, pageSize: 10 }
): Promise<PageableResult<ApartmentDTO>> {
  const where: Record<string, unknown> = {};

  if (filter.buildingId) {
    where.buildingId = filter.buildingId;
  }

  if (filter.sizeFrom !== undefined || filter.sizeTo !== undefined) {
    where.totalSize = {
      ...(filter.sizeFrom !== undefined && { gte: filter.sizeFrom }),
      ...(filter.sizeTo !== undefined && { lte: filter.sizeTo }),
    };
  }

  if (
    filter.selectedRooms !== null &&
    filter.selectedRooms !== undefined &&
    filter.selectedRooms.length > 0
  ) {
    where.bedroomCount = { in: filter.selectedRooms };
  }

  if (filter.priceFrom !== undefined || filter.priceTo !== undefined) {
    where.price = {
      ...(filter.priceFrom !== undefined && { gte: filter.priceFrom }),
      ...(filter.priceTo !== undefined && { lte: filter.priceTo }),
    };
  }

  if (filter.status) {
    where.status = filter.status;
  }

  const [items, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      skip: (pageable.page - 1) * pageable.pageSize,
      take: pageable.pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        building: {
          include: {
            project: true,
          },
        },
      },
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

export async function removeApartment(id: string) {
  await prisma.apartment.delete({ where: { id } });
}

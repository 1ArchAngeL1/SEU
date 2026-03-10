'use server';

import prisma from '@/lib/prisma';
import { ContactDTO } from '@/model/dto/common.dto';
import { PageableDTO } from '@/model/dto/pageable.dto';

export async function addContactRequest(data: ContactDTO) {
  await prisma.contactRequest.create({ data });
}

export async function removeContactRequest(id: string) {
  await prisma.contactRequest.delete({ where: { id } });
}

export async function getContactRequests({ page, pageSize }: PageableDTO) {
  const [items, total] = await Promise.all([
    prisma.contactRequest.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactRequest.count(),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

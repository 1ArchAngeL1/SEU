import { ApartmentData } from './ApartmentCardGridView';

const complexes = ['Varketili', 'Dighomi', 'Saburtalo', 'Didube', 'Gldani', 'Isani', 'Nadzaladevi'];
const blocks = ['A', 'B', 'C', 'D', 'E'];
const statuses = ['available', 'available', 'available', 'reserved', 'sold'] as const;

export const DUMMY_APARTMENTS: ApartmentData[] = Array.from({ length: 400 }, (_, i) => ({
  id: i + 1,
  name: `Apartment ${100 + i}`,
  complex: complexes[i % complexes.length],
  rooms: (i % 5) + 1,
  size: 40 + ((i * 7) % 140),
  block: blocks[i % blocks.length],
  status: statuses[i % statuses.length],
}));

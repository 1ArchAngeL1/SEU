import { ApartmentData, ApartmentStatus, RoomDetail } from './ApartmentCardGridView';

const complexes = ['Varketili', 'Dighomi', 'Saburtalo', 'Didube', 'Gldani', 'Isani', 'Nadzaladevi'];
const blocks = ['A', 'B', 'C', 'D', 'E'];
const statuses: ApartmentStatus[] = ['available', 'available', 'available', 'reserved', 'sold'];

function generateRoomDetails(rooms: number, size: number): RoomDetail[] {
  const roomSize = Math.round((size / (rooms + 5)) * 10) / 10;
  const bedrooms: RoomDetail[] = Array.from({ length: rooms }, (_, i) => ({
    name: `Bedroom ${i + 1}`,
    size: roomSize,
    icon: 'bedroom' as const,
  }));
  return [
    ...bedrooms,
    { name: 'Hall',        size: Math.round(size * 0.08 * 10) / 10, icon: 'hall' },
    { name: 'Balcony',     size: Math.round(size * 0.07 * 10) / 10, icon: 'balcony' },
    { name: 'Bathroom',    size: Math.round(size * 0.06 * 10) / 10, icon: 'bathroom' },
    { name: 'Kitchen',     size: Math.round(size * 0.10 * 10) / 10, icon: 'kitchen' },
    { name: 'Storage',     size: Math.round(size * 0.04 * 10) / 10, icon: 'storage' },
    { name: 'Living room', size: Math.round(size * 0.18 * 10) / 10, icon: 'living' },
    { name: 'WC',          size: Math.round(size * 0.03 * 10) / 10, icon: 'wc' },
  ];
}

export const DUMMY_APARTMENTS: ApartmentData[] = Array.from({ length: 400 }, (_, i) => {
  const rooms      = (i % 5) + 1;
  const size       = 40 + ((i * 7) % 140);
  const totalSize  = size;
  const mainSize   = Math.round(size * 0.82);
  const openSpace  = Math.round(size * 0.18);
  const floor      = (i % 28) + 1;
  const totalFloors = (i % 12) + 8;           // 8–19 floors
  const priceUSD   = size * 800 + ((i * 1237) % 50000);
  const priceGEL   = Math.round(priceUSD * 2.72);
  const complex    = complexes[i % complexes.length];
  const block      = blocks[i % blocks.length];
  const apartmentNumber = 100 + i;

  return {
    // Identity
    id: i + 1,
    apartmentNumber,
    name: `Apartment ${apartmentNumber}`,

    // Location
    complex,
    block,
    floor,
    totalFloors,

    // Sizing
    size,
    totalSize,
    mainSize,
    openSpace,

    // Rooms
    rooms,
    roomDetails: generateRoomDetails(rooms, size),

    // Pricing
    priceUSD,
    priceGEL,

    // Status & availability
    status: statuses[i % statuses.length],
    completionYear: 2024 + (i % 4),           // 2024–2027

    // Amenities
    parking:     i % 3 !== 0,
    storageUnit: i % 2 === 0,

    // Media — placeholders, replace with real paths
    images: [],
    floorPlanImages: {
      plan:   '',  // PLACEHOLDER: floor plan drawing image
      twoD:   '',  // PLACEHOLDER: 2D rendered floor plan
      threeD: '',  // PLACEHOLDER: 3D rendered floor plan
    },

    // Content
    description: `${rooms}-bedroom apartment in the ${complex} complex, block ${block}, floor ${floor}. ` +
      `Total area ${totalSize} m² with ${openSpace} m² open space. ` +
      `Completion expected ${2024 + (i % 4)}.`,
  };
});

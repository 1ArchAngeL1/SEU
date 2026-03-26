import { ApartmentStatus, RoomSpec } from '@prisma/client';

export interface ApartmentDTO {
  id: string;
  floor: number;
  apartmentNo: number;
  totalSize: number;
  mainSize: number;
  openSpaceSize: number;
  bedroomCount: number;
  price: number;
  status: ApartmentStatus;
  position: number;
  rooms: RoomSpec[];
  building?: {
    id: string;
    block: string;
    floorCount: number;
    project?: {
      id: string;
      name: string;
    };
  };
}

export interface ApartmentFilterDTO {
  buildingId?: string;
  sizeFrom?: number;
  sizeTo?: number;
  selectedRooms?: number[] | null;
  priceFrom?: number;
  priceTo?: number;
  status?: ApartmentStatus;
}

export interface CreateApartmentDTO {
  buildingId: string;
  floor: number;
  apartmentNo: number;
  totalSize: number;
  mainSize: number;
  openSpaceSize: number;
  bedroomCount: number;
  rooms: RoomSpec[];
  price: number;
  status?: ApartmentStatus;
  position: number;
}

export interface UpdateApartmentDTO {
  floor?: number;
  apartmentNo?: number;
  totalSize?: number;
  mainSize?: number;
  openSpaceSize?: number;
  bedroomCount?: number;
  price?: number;
  status?: ApartmentStatus;
  position?: number;
  rooms?: RoomSpec[];
}

import ApartmentCard from '@/components/search/ApartmentCard';

export type ApartmentCardGridViewProps = {
  data: Array<ApartmentData>;
};

export type RoomDetailIcon =
  | 'bedroom'
  | 'hall'
  | 'balcony'
  | 'bathroom'
  | 'kitchen'
  | 'storage'
  | 'living'
  | 'wc';

export interface RoomDetail {
  name: string;
  size: number;
  icon: RoomDetailIcon;
}

export type ApartmentStatus = 'available' | 'sold' | 'reserved';

export interface FloorPlanImages {
  plan: string;
  twoD: string;
  threeD: string;
}

export interface ApartmentData {
  // Identity
  id: number;
  apartmentNumber: number;
  name: string;

  // Location
  complex: string;
  block: string;
  floor: number;
  totalFloors: number;

  // Sizing
  size: number;
  totalSize: number;
  mainSize: number;
  openSpace: number;

  // Rooms
  rooms: number;
  roomDetails: RoomDetail[];

  // Pricing
  priceUSD: number;
  priceGEL: number;

  // Status & availability
  status: ApartmentStatus;
  completionYear: number;

  // Amenities
  parking: boolean;
  storageUnit: boolean;

  // Media
  images: string[];
  floorPlanImages: FloorPlanImages;

  // Content
  description: string;
}

export const ApartmentCardGridView = ({ data }: ApartmentCardGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 xl:p-16 max-w-[1920px] mx-auto">
      {data.map((apartment) => (
        <ApartmentCard key={apartment.id} data={apartment} />
      ))}
    </div>
  );
};

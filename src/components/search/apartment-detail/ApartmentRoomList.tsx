import {
  BedDouble,
  ChefHat,
  DoorOpen,
  Droplets,
  Package,
  Sofa,
  Sun,
  Waves,
} from 'lucide-react';

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

function RoomIcon({ type }: { type: RoomDetailIcon }) {
  const cls = 'w-5 h-5 text-pale-gray/50 flex-shrink-0';
  switch (type) {
    case 'bedroom':
      return <BedDouble className={cls} />;
    case 'hall':
      return <DoorOpen className={cls} />;
    case 'balcony':
      return <Sun className={cls} />;
    case 'bathroom':
      return <Droplets className={cls} />;
    case 'kitchen':
      return <ChefHat className={cls} />;
    case 'storage':
      return <Package className={cls} />;
    case 'living':
      return <Sofa className={cls} />;
    case 'wc':
      return <Waves className={cls} />;
  }
}

interface ApartmentRoomListProps {
  roomDetails: RoomDetail[];
}

export function ApartmentRoomList({ roomDetails }: ApartmentRoomListProps) {
  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-5">
      {roomDetails.map((room, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <RoomIcon type={room.icon} />
          <div className="min-w-0">
            <span className="font-montserrat text-seu-caption text-pale-gray">
              {room.name}
            </span>
            <span className="font-montserrat text-seu-caption text-pale-gray/50 ml-1.5">
              {room.size} M2
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import {
  BedDouble,
  ChefHat,
  DoorOpen,
  Droplets,
  Home,
  Package,
  Sofa,
  Sun,
  Waves,
} from 'lucide-react';
import type { RoomType } from '@/model/types/api';

export interface RoomDetail {
  name?: string;
  type: RoomType;
  size: number;
}

function RoomIcon({ type }: { type: RoomType }) {
  const cls = 'size-5 text-site-fg-dim flex-shrink-0';
  switch (type) {
    case 'bedroom':
      return <BedDouble className={cls} />;
    case 'living_room':
      return <Sofa className={cls} />;
    case 'studio':
      return <Home className={cls} />;
    case 'kitchen':
      return <ChefHat className={cls} />;
    case 'bathroom':
      return <Droplets className={cls} />;
    case 'toilet':
      return <Waves className={cls} />;
    case 'hall':
      return <DoorOpen className={cls} />;
    case 'balcony':
    case 'terrace':
      return <Sun className={cls} />;
    case 'storage':
      return <Package className={cls} />;
    case 'other':
    default:
      return <Home className={cls} />;
  }
}

interface ApartmentRoomListProps {
  roomDetails: RoomDetail[];
}

export function ApartmentRoomList({ roomDetails }: ApartmentRoomListProps) {
  const t = useTranslations('search');
  const tRoom = useTranslations('roomTypes');
  if (roomDetails.length === 0) {
    return (
      <p className="font-montserrat text-seu-caption text-site-fg-dim">
        {t('noRoomDetails')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
      {roomDetails.map((room, i) => {
        const label = room.name?.trim() || tRoom(room.type);
        return (
          <div key={i} className="flex items-center gap-2.5">
            <RoomIcon type={room.type} />
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="font-montserrat text-seu-caption text-site-fg truncate">
                {label}
              </span>
              <span className="font-montserrat text-seu-caption text-site-fg-dim">
                {room.size} {t('m2')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

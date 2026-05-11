'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { labelClass } from './styles';

const ROOM_OPTIONS = [1, 2, 3, 4, 5];

export type RoomSelectorProps = {
  selected: number[];
  onChange: (rooms: number[]) => void;
};

export default function RoomSelector({
  selected,
  onChange,
}: RoomSelectorProps) {
  const t = useTranslations('search');
  return (
    <div>
      <Label className={labelClass}>{t('rooms')}</Label>
      <div className="flex gap-2">
        {ROOM_OPTIONS.map((num) => {
          const active = selected.includes(num);
          return (
            <button
              key={num}
              type="button"
              onClick={() =>
                onChange(
                  selected.includes(num)
                    ? selected.filter((r) => r !== num)
                    : [...selected, num]
                )
              }
              className={cn(
                'size-10 rounded-md font-montserrat text-seu-caption transition-colors border',
                active
                  ? 'bg-dark-green text-white border-dark-green'
                  : 'bg-transparent text-dark-green border-secondary-grey/50 hover:border-dark-green'
              )}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

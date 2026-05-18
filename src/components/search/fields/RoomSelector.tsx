'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { labelClass } from './styles';

const ROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

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
      <div className="flex flex-wrap gap-2">
        {ROOM_OPTIONS.map((num) => {
          const active = selected.includes(num);
          const isStudio = num === 0;
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
                'h-10 rounded-md font-montserrat text-seu-caption transition-colors border',
                isStudio ? 'px-3' : 'size-10',
                active
                  ? 'bg-dark-green text-white border-dark-green'
                  : 'bg-transparent text-dark-green border-secondary-grey/50 hover:border-dark-green'
              )}
            >
              {isStudio ? t('studio') : num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

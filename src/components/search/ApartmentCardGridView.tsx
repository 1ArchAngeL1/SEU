import ApartmentCard from '@/components/search/ApartmentCard';
import type { Unit } from '@/model/types/api';

export type ApartmentCardGridViewProps = {
  data: Unit[];
};

export const ApartmentCardGridView = ({ data }: ApartmentCardGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 xl:p-16 max-w-[1920px] mx-auto">
      {data.map((unit) => (
        <ApartmentCard key={unit.id} data={unit} />
      ))}
    </div>
  );
};

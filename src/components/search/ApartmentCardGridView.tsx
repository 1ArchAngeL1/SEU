import ApartmentCard from '@/components/search/ApartmentCard';
import FadeIn from '@/components/FadeIn';
import type { Unit } from '@/model/types/api';

export type ApartmentCardGridViewProps = {
  data: Unit[];
};

export const ApartmentCardGridView = ({ data }: ApartmentCardGridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 p-5 lg:p-8 xl:p-16 max-w-[1920px] mx-auto">
      {data.map((unit, i) => (
        <FadeIn key={unit.id} delay={(i % 4) * 80} duration={500}>
          <ApartmentCard data={unit} />
        </FadeIn>
      ))}
    </div>
  );
};

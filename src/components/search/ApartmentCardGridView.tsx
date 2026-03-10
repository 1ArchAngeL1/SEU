import ApartmentCard from '@/components/search/ApartmentCard';
import { ApartmentDTO } from '@/model/dto/apartment.dto';

export type ApartmentCardGridViewProps = {
  data: ApartmentDTO[];
};

export const ApartmentCardGridView = ({ data }: ApartmentCardGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 xl:p-16 max-w-[1920px] mx-auto">
      {data.map((apartment) => (
        <ApartmentCard key={apartment.id} data={apartment} />
      ))}
    </div>
  );
};

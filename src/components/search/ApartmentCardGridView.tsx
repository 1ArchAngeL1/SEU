import ApartmentCard from '@/components/search/ApartmentCard';

export type ApartmentCardGridViewProps = {
  data: Array<ApartmentData>;
};

export interface ApartmentData {
  id: number;
  name: string;
  complex: string;
  rooms: number;
  size: number;
  block: string;
  status: string;
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

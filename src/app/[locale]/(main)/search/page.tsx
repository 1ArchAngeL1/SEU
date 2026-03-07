import SearchForm from '@/components/search/SearchForm';
import ApartmentCard from '@/components/search/ApartmentCard';

const DUMMY_APARTMENTS = [
  { id: 1, name: 'Apartment 124', complex: 'Varketili', rooms: 2, size: 85, block: 'A', status: 'available' as const },
  { id: 2, name: 'Apartment 125', complex: 'Varketili', rooms: 3, size: 120, block: 'A', status: 'available' as const },
  { id: 3, name: 'Apartment 126', complex: 'Dighomi', rooms: 1, size: 45, block: 'B', status: 'sold' as const },
  { id: 4, name: 'Apartment 127', complex: 'Varketili', rooms: 4, size: 150, block: 'A', status: 'reserved' as const },
  { id: 5, name: 'Apartment 128', complex: 'Dighomi', rooms: 2, size: 78, block: 'B', status: 'available' as const },
  { id: 6, name: 'Apartment 129', complex: 'Saburtalo', rooms: 3, size: 110, block: 'C', status: 'available' as const },
  { id: 7, name: 'Apartment 130', complex: 'Dighomi', rooms: 1, size: 52, block: 'B', status: 'sold' as const },
  { id: 8, name: 'Apartment 131', complex: 'Saburtalo', rooms: 5, size: 180, block: 'A', status: 'available' as const },
];

export default function SearchPage() {
  return (
    <div className="bg-pale-gray min-h-screen">
      <div className="mx-auto py-12">
        {/* Title */}
        <h1 className="font-bodoni text-seu-title-xl text-dark-green mb-8">
          APARTMENTS.
        </h1>

        {/* Search Form */}
        <SearchForm />

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-dark-green p-8">
          {DUMMY_APARTMENTS.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              name={apartment.name}
              complex={apartment.complex}
              rooms={apartment.rooms}
              size={apartment.size}
              block={apartment.block}
              status={apartment.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ApartmentDetailStatsProps {
  totalSize: number;
  mainSize: number;
  openSpace: number;
  rooms: number;
}

interface StatCellProps {
  label: string;
  value: string | number;
}

function StatCell({ label, value }: StatCellProps) {
  return (
    <div className="flex flex-col">
      <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1.5">
        {label}
      </p>
      <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
        {value}
      </p>
    </div>
  );
}

export function ApartmentDetailStats({
  totalSize,
  mainSize,
  openSpace,
  rooms,
}: ApartmentDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 mb-8">
      <StatCell label="Total Size" value={`${totalSize} SQ.M`} />
      <StatCell label="Main Size" value={`${mainSize} SQ.M`} />
      <StatCell label="Open Space" value={`${openSpace} SQ.M`} />
      <StatCell label="Bedroom" value={rooms} />
    </div>
  );
}

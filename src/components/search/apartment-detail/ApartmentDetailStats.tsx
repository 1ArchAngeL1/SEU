interface ApartmentDetailStatsProps {
  totalSize: number;
  mainSize: number;
  openSpace: number;
  rooms: number;
}

export function ApartmentDetailStats({
  totalSize,
  mainSize,
  openSpace,
  rooms,
}: ApartmentDetailStatsProps) {
  return (
    <div className="flex gap-10 mb-8">
      <div>
        <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
          Total Size
        </p>
        <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
          {totalSize} SQ.M
        </p>
      </div>
      <div>
        <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
          Main Size
        </p>
        <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
          {mainSize} SQ.M
        </p>
      </div>
      <div>
        <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
          Open Space
        </p>
        <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
          {openSpace} SQ.M
        </p>
      </div>
      <div>
        <p className="font-montserrat text-seu-caption text-pale-gray/50 mb-1">
          Bedroom
        </p>
        <p className="font-montserrat font-medium text-seu-body-lg text-pale-gray">
          {rooms}
        </p>
      </div>
    </div>
  );
}

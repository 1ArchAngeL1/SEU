interface ChessFloorLabelProps {
  floor: number;
}

export default function ChessFloorLabel({ floor }: ChessFloorLabelProps) {
  return (
    <div className="flex items-center justify-center px-3 py-2 font-montserrat font-medium text-seu-caption-sm text-secondary-grey min-w-12">
      {floor}
    </div>
  );
}

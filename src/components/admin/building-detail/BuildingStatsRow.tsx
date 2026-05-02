import StatPill from './StatPill';

interface BuildingStatsRowProps {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  avgPricePerM2: number;
}

export default function BuildingStatsRow({
  total,
  available,
  reserved,
  sold,
  avgPricePerM2,
}: BuildingStatsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <StatPill label="Total" value={total} />
      <StatPill label="Available" value={available} accent="emerald" />
      <StatPill label="Reserved" value={reserved} accent="amber" />
      <StatPill label="Sold" value={sold} accent="rose" />
      <StatPill
        label="Avg /m²"
        value={`$${avgPricePerM2.toLocaleString()}`}
      />
    </div>
  );
}

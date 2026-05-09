import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { fieldClass } from './styles';

export type PriceFieldProps = {
  currency: 'USD' | 'GEL';
  onCurrencyChange: (c: 'USD' | 'GEL') => void;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  error?: string;
};

export default function PriceField({
  currency,
  onCurrencyChange,
  from,
  to,
  onFromChange,
  onToChange,
  error,
}: PriceFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-montserrat text-seu-caption-sm text-dark-green">
          Price
        </span>
        <div className="inline-flex items-center gap-1">
          {(['USD', 'GEL'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCurrencyChange(c)}
              className={cn(
                'px-2.5 py-0.5 rounded-md font-montserrat text-[0.7rem] font-medium transition-colors',
                currency === c
                  ? 'bg-primary-orange text-white'
                  : 'text-secondary-grey hover:text-dark-green'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="From"
          className={fieldClass}
        />
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="To"
          className={fieldClass}
        />
      </div>
      {error && (
        <p className="mt-2 font-montserrat text-seu-caption-sm text-red">
          {error}
        </p>
      )}
    </div>
  );
}

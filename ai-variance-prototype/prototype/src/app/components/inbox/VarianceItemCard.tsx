import { Check } from 'lucide-react';
import type { VarianceItem } from '../../../data/variances';
import { formatDollar, formatPercent } from '../../../data/variances';

interface Props {
  item: VarianceItem;
  selected: boolean;
  onClick: () => void;
}

export function VarianceItemCard({ item, selected, onClick }: Props) {
  const isUp = item.changeAmount >= 0;
  const isSignedOff = item.status === 'signed-off' || item.status === 'ready-for-review';

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left px-4 py-3 border-b border-neutral-100 transition-colors',
        selected
          ? 'bg-indigo-50'
          : isSignedOff
          ? 'bg-neutral-100 hover:bg-neutral-200/50'
          : 'hover:bg-neutral-50',
      ].join(' ')}
    >
      <style>{`
        @keyframes badge-stamp {
          0%   { transform: scale(2.8) translate(2px, -2px); opacity: 0; }
          55%  { transform: scale(0.88); opacity: 1; }
          72%  { transform: scale(1.10); }
          100% { transform: scale(1); }
        }
        @keyframes spark-fly {
          0%   { opacity: 0; transform: rotate(var(--a)) translateY(-2px) scaleY(1); }
          18%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--a)) translateY(-15px) scaleY(0.4); }
        }
      `}</style>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-baseline gap-2">
            {isSignedOff && (
              <span className="relative inline-flex shrink-0">
                <span
                  className="relative z-20 inline-flex items-center justify-center rounded-full bg-[#014a3d] p-1 text-white"
                  style={{ animation: 'badge-stamp 380ms cubic-bezier(0.2,0,0,1) both' }}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
                  <span className="relative h-4 w-4">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <span
                        key={angle}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '1.5px',
                          height: '5px',
                          marginLeft: '-0.75px',
                          marginTop: '-2.5px',
                          background: 'rgb(52 211 153)',
                          borderRadius: '2px',
                          ['--a' as string]: `${angle}deg`,
                          animation: 'spark-fly 380ms ease-out 215ms both',
                        }}
                      />
                    ))}
                  </span>
                </span>
              </span>
            )}
            <p className="font-display text-sm font-normal tracking-tight truncate text-neutral-900">
              {item.accountName}
            </p>
          </div>
          <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
            {item.accountNumber}{item.department ? <span className="text-neutral-300"> · </span> : null}{item.department && <span>{item.department}</span>}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className={`font-mono text-sm tabular-nums leading-tight ${isSignedOff ? 'text-neutral-400' : isUp ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatDollar(item.changeAmount)}
          </span>
          <span className={`text-[11px] tabular-nums font-mono ${isSignedOff ? 'text-neutral-400' : isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatPercent(item.changePercent)}
          </span>
        </div>
      </div>
    </button>
  );
}

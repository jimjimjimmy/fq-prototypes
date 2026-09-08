import type { KPICardProps } from '../types';

export default function KPICard({ title, value, icon, isMain = false, breakdown }: KPICardProps) {
  const totalBreakdownValue = breakdown ? breakdown.reduce((sum, item) => sum + item.value, 0) : 0;

  if (breakdown) {
    return (
      <div className="bg-white border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg p-3 shadow-sm">
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center justify-center mb-2">
            <p className="text-2xl font-bold" style={{ color: 'var(--flo-sem-color-text-default)' }}>{totalBreakdownValue}</p>
            <p className="text-sm font-bold ml-2" style={{ color: 'var(--flo-sem-color-text-default)' }}>Total Anomalies</p>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            {breakdown.map((item, index) => (
              <div key={index} className="text-center">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="text-lg font-bold hover:opacity-70 transition-opacity"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </button>
                ) : (
                  <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                )}
                <p className="text-xs mt-0.5" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg p-3 shadow-sm flex flex-col items-center justify-center h-full">
      <p className="text-sm font-bold mb-1 text-center" style={{ color: 'var(--flo-sem-color-text-default)' }}>{title}</p>
      {value !== undefined && (
        <p className={`${isMain ? 'text-4xl' : 'text-3xl'} font-bold text-center`} style={{ color: 'var(--flo-sem-color-text-default)' }}>
          {value.toLocaleString()}
        </p>
      )}
    </div>
  );
}

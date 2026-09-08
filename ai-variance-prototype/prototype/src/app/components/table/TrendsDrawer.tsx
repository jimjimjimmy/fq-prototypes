import { useState } from 'react';
import { X } from 'lucide-react';
import type { VarianceItem } from '../../../data/variances';
import { formatDollarFull, formatDollar, formatPercent } from '../../../data/variances';

interface Props {
  open: boolean;
  item: VarianceItem;
  collection: { currentPeriod: string; priorPeriod: string };
  onClose: () => void;
}

// ─── Synthetic trend data ─────────────────────────────────────────────────────
// Generates 12 months of plausible data anchored to priorAmount → currentAmount.

function generateTrend(item: VarianceItem): { month: string; value: number }[] {
  const seed = item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i: number) => {
    const x = Math.sin(seed + i * 9301 + 49297) * 0.5 + 0.5;
    return x;
  };

  const months = [
    'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
    'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025',
    'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
  ];

  const prior = item.priorAmount;
  const current = item.currentAmount;
  const base = Math.min(prior, current) * 0.85;
  const range = Math.abs(current - prior) * 4 + Math.abs(prior) * 0.15;

  const values = months.map((_, i) => {
    if (i === 10) return prior;
    if (i === 11) return current;
    const t = i / 10;
    const trend = base + (prior - base) * t;
    const noise = (rng(i) - 0.5) * range * 0.4;
    return Math.round(trend + noise);
  });

  return months.map((month, i) => ({ month, value: values[i] }));
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────

function TrendChart({ data, isUp }: { data: { month: string; value: number }[]; isUp: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 900;
  const H = 280;
  const PAD = { top: 24, right: 32, bottom: 48, left: 72 };

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  const xScale = (i: number) =>
    PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const yScale = (v: number) =>
    PAD.top + (1 - (v - minVal) / valRange) * (H - PAD.top - PAD.bottom);

  const lineColor = isUp ? '#059669' : '#dc2626';
  const areaColor = isUp ? '#d1fae5' : '#fee2e2';

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value), ...d }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = [
    `M ${points[0].x.toFixed(1)} ${(H - PAD.bottom).toFixed(1)}`,
    ...points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    `L ${points[points.length - 1].x.toFixed(1)} ${(H - PAD.bottom).toFixed(1)}`,
    'Z',
  ].join(' ');

  // Y-axis ticks (5 evenly spaced)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minVal + (valRange / 4) * i;
    return { v, y: yScale(v) };
  });

  const hovPt = hovered !== null ? points[hovered] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: 'visible' }}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={t.y.toFixed(1)}
              x2={W - PAD.right} y2={t.y.toFixed(1)}
              stroke="#f3f4f6" strokeWidth={1}
            />
            <text
              x={PAD.left - 8} y={t.y + 4}
              textAnchor="end"
              fontSize={10} fill="#9ca3af"
              fontFamily="'JetBrains Mono', monospace"
            >
              {formatDollar(Math.round(t.v))}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={areaColor} opacity={0.35} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* X-axis labels + hover zones */}
        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - (W - PAD.left - PAD.right) / data.length / 2}
              y={PAD.top}
              width={(W - PAD.left - PAD.right) / data.length}
              height={H - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
            />
            {/* X label — every 3rd or all */}
            <text
              x={p.x} y={H - PAD.bottom + 16}
              textAnchor="middle"
              fontSize={10} fill={i === hovered ? '#374151' : '#9ca3af'}
              fontFamily="system-ui, sans-serif"
            >
              {p.month}
            </text>
            {/* Dot */}
            <circle
              cx={p.x} cy={p.y}
              r={i === hovered ? 5 : (i === 10 || i === 11 ? 4 : 2.5)}
              fill={i === 10 || i === 11 ? lineColor : (i === hovered ? lineColor : '#fff')}
              stroke={lineColor}
              strokeWidth={i === hovered ? 2 : 1.5}
            />
          </g>
        ))}

        {/* Hover crosshair */}
        {hovPt && (
          <line
            x1={hovPt.x} y1={PAD.top}
            x2={hovPt.x} y2={H - PAD.bottom}
            stroke="#d1d5db" strokeWidth={1} strokeDasharray="4 2"
          />
        )}
      </svg>

      {/* Hover tooltip */}
      {hovPt && (
        <div
          style={{
            position: 'absolute',
            left: `${(hovPt.x / W) * 100}%`,
            top: `${(hovPt.y / H) * 100}%`,
            transform: 'translate(-50%, -120%)',
            pointerEvents: 'none',
          }}
          className="rounded-md bg-neutral-900 px-2.5 py-1.5 shadow-lg"
        >
          <p className="font-display text-[11px] font-medium tracking-tight text-neutral-400">{hovPt.month}</p>
          <p className="font-mono text-sm font-semibold tabular-nums text-white">{formatDollarFull(hovPt.value)}</p>
        </div>
      )}
    </div>
  );
}

// ─── TrendsDrawer ─────────────────────────────────────────────────────────────

export function TrendsDrawer({ open, item, collection, onClose }: Props) {
  const trend = generateTrend(item);
  const isUp = item.changeAmount >= 0;

  const high = Math.max(...trend.map((d) => d.value));
  const low = Math.min(...trend.map((d) => d.value));
  const highMonth = trend.find((d) => d.value === high)?.month ?? '';
  const lowMonth = trend.find((d) => d.value === low)?.month ?? '';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[calc(100vw-160px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-8 py-4">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-neutral-900">
              {item.accountName} — 12-Month Trend
            </h2>
            <p className="mt-0.5 font-display text-xs tracking-tight text-neutral-500">
              {item.accountNumber} · {item.department} · {collection.priorPeriod} → {collection.currentPeriod}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Summary stats */}
          <div className="mb-8 grid grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{collection.priorPeriod}</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-neutral-900">{formatDollarFull(item.priorAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{collection.currentPeriod}</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-neutral-900">{formatDollarFull(item.currentAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Change</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`font-mono text-2xl tabular-nums ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
                  {formatDollar(item.changeAmount)}
                </span>
                <span className={`font-mono text-sm tabular-nums ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatPercent(item.changePercent)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">12-Mo Range</p>
              <p className="mt-1 font-mono text-sm tabular-nums text-neutral-700">
                {formatDollar(low)} – {formatDollar(high)}
              </p>
              <p className="mt-0.5 font-display text-[10px] tracking-tight text-neutral-400">
                Low: {lowMonth} · High: {highMonth}
              </p>
            </div>
          </div>

          {/* Chart */}
          <TrendChart data={trend} isUp={isUp} />
        </div>
      </div>
    </>
  );
}

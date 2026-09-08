import { useNavigate } from 'react-router-dom'
import type { DimensionModel, DimensionStatus } from '../../data/dimensions'
import { formatDimensionDate } from '../../data/dimensions'

const STATUS_CFG: Record<DimensionStatus, { dot: string; label: string; bg: string; text: string }> = {
  active:         { dot: '#16a34a', label: 'Active',             bg: '#ecfff8', text: '#1fac76' },
  draft:          { dot: '#9ca3af', label: 'Draft',              bg: '#f3f4f6', text: '#6b7280' },
  'data-quality': { dot: '#d97706', label: 'Data quality issue', bg: '#fffbeb', text: '#d97706' },
  orphaned:       { dot: '#9ca3af', label: 'Orphaned',           bg: '#f3f4f6', text: '#6b7280' },
}

export default function DimensionHeader({ dimension }: { dimension: DimensionModel }) {
  const navigate = useNavigate()
  const cfg = STATUS_CFG[dimension.status]

  return (
    <div className="flex flex-col gap-2 px-6 py-4 border-b border-[#e1e6ef] bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 h-[18px]">
        <button
          onClick={() => navigate('/data-studio/dimensions')}
          className="text-xs text-[#adb2bb] hover:text-[#0a0d14] font-semibold"
          style={{ fontFamily: "'Museo Sans', sans-serif" }}
        >
          Dimensions
        </button>
        <span className="text-xs text-[#adb2bb] font-semibold" style={{ fontFamily: "'Museo Sans', sans-serif" }}>/</span>
        <span className="text-xs text-[#0a0d14] font-semibold" style={{ fontFamily: "'Museo Sans', sans-serif" }}>
          {dimension.name}
        </span>
      </div>

      {/* Name + status */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[24px] font-semibold text-black leading-[32px]" style={{ fontFamily: "'Museo Sans', sans-serif" }}>
            {dimension.name}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] leading-[14px]"
            style={{ fontFamily: "'Inter', sans-serif", backgroundColor: cfg.bg, color: cfg.text }}
          >
            {cfg.label}
          </span>
          {dimension.dataQualityIssue && (
            <span className="text-[11px] text-[#92400e]" style={{ fontFamily: "'Inter', sans-serif" }}>
              — {dimension.dataQualityIssue}
            </span>
          )}
        </div>
        <div className="text-xs text-[#424867] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {dimension.records ?? 0} unique values
          &nbsp;&bull;&nbsp;
          {dimension.modelsUsing.length} linked {dimension.modelsUsing.length === 1 ? 'model' : 'models'}
          {dimension.lastUpdated && (
            <>&nbsp;&bull;&nbsp;Last updated {formatDimensionDate(dimension.lastUpdated)}</>
          )}
        </div>
      </div>
    </div>
  )
}

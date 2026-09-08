import { useNavigate } from 'react-router-dom'
import type { Model } from '../../data/models'
import BreadcrumbDropdown from './BreadcrumbDropdown'

interface ModelHeaderProps {
  model: Model
}

function statusClasses(status: Model['status']): string {
  switch (status) {
    case 'active': return 'bg-[#ecfff8] text-[#1fac76]'
    case 'draft': return 'bg-orange-50 text-orange-500'
    case 'inactive': return 'bg-gray-100 text-gray-400'
  }
}

function statusLabel(status: Model['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function ModelHeader({ model }: ModelHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2 px-6 py-4 border-b border-[#e1e6ef] bg-white">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 h-[18px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/data-studio/catalog')}
            className="text-xs text-[#adb2bb] hover:text-[#0a0d14] font-semibold"
            style={{ fontFamily: "'Museo Sans', sans-serif" }}
          >
            Catalog
          </button>
          <span className="text-xs text-[#0a0d14] font-semibold" style={{ fontFamily: "'Museo Sans', sans-serif" }}>
            /
          </span>
        </div>
        <BreadcrumbDropdown currentModel={model} />
      </div>

      {/* Model name + status + version */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[24px] font-semibold text-black leading-[32px]"
            style={{ fontFamily: "'Museo Sans', sans-serif" }}
          >
            {model.name}
          </span>
          <span className={`text-[10px] font-semibold px-1 py-0.5 rounded-[4px] leading-[14px] ${statusClasses(model.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>
            {statusLabel(model.status)}
          </span>
        </div>
        <div className="text-xs text-[#424867] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Version {model.version} &bull; Last updated {model.lastUpdated}
        </div>
      </div>
    </div>
  )
}

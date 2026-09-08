import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Model } from '../../data/models'
import { modelData } from '../../data/models'

interface BreadcrumbDropdownProps {
  currentModel: Model
}

export default function BreadcrumbDropdown({ currentModel }: BreadcrumbDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-semibold text-[#0a0d14] hover:underline"
        style={{ fontFamily: "'Museo Sans', sans-serif" }}
      >
        {currentModel.name}
        <svg
          className={`w-5 h-5 transition-transform text-[#6b7280] ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-80 overflow-auto">
          {modelData.map((group) => (
            <div key={group.domain}>
              {group.models.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {group.domain}
                  </div>
                  {group.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        navigate(`/data-studio/model/${model.id}/overview`)
                        setOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        model.id === currentModel.id ? 'bg-green-50 text-green-900 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

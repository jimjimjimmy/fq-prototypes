import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from '@floqastinc/flow-ui_core'

const SIDEBAR_ITEMS = [
  { path: 'overview', label: 'Overview' },
  { path: 'data-preview', label: 'Data Preview' },
  { path: 'source-datasets', label: 'Source Datasets' },
  { path: 'field-mapping', label: 'Field Mapping' },
  { path: 'versions', label: 'Versions' },
  { path: 'logs', label: 'Logs' },
]

interface SidebarNavProps {
  modelId: string
}

export default function SidebarNav({ modelId }: SidebarNavProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const activeSegment = location.pathname.split('/').pop() || 'overview'
  const isFieldMapping = activeSegment === 'field-mapping'
  const [collapsed, setCollapsed] = useState(isFieldMapping)

  // On field-mapping route when collapsed, show minimal 30px chevron strip
  if (isFieldMapping && collapsed) {
    return (
      <div className="w-[30px] border-r border-[#e1e6ef] flex flex-col items-center pt-3 shrink-0 bg-white">
        <button
          onClick={() => setCollapsed(false)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <Sidebar collapsed={collapsed} onCollapseChange={() => setCollapsed(!collapsed)}>
      <Sidebar.Title>Navigation</Sidebar.Title>
      <Sidebar.Menu>
        {SIDEBAR_ITEMS.map((item) => (
          <Sidebar.Item
            key={item.path}
            value={item.path}
            isActive={activeSegment === item.path}
            onChange={() => navigate(`/data-studio/model/${modelId}/${item.path}`)}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Menu>
    </Sidebar>
  )
}

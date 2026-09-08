import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from '@floqastinc/flow-ui_core'

const SIDEBAR_ITEMS = [
  { path: 'values',     label: 'Values'     },
  { path: 'data-flow',  label: 'Data Flow'  },
]

export default function DimensionSidebarNav({ dimensionId }: { dimensionId: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const activeSegment = location.pathname.split('/').pop() || 'values'

  return (
    <Sidebar>
      <Sidebar.Menu>
        {SIDEBAR_ITEMS.map(item => (
          <Sidebar.Item
            key={item.path}
            value={item.path}
            isActive={activeSegment === item.path}
            onChange={() => navigate(`/data-studio/dimension/${dimensionId}/${item.path}`)}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Menu>
    </Sidebar>
  )
}

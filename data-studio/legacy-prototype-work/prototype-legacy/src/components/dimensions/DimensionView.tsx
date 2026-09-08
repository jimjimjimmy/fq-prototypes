import { useParams, Outlet, Navigate } from 'react-router-dom'
import { getDimensionById } from '../../data/dimensions'
import DimensionHeader from './DimensionHeader'
import DimensionSidebarNav from './DimensionSidebarNav'

export default function DimensionView() {
  const { id } = useParams<{ id: string }>()
  const dimension = id ? getDimensionById(id) : undefined

  if (!dimension) {
    return <Navigate to="/data-studio/dimensions" replace />
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <DimensionHeader dimension={dimension} />
      <div className="flex flex-1 overflow-hidden">
        <DimensionSidebarNav dimensionId={dimension.id} />
        <div className="flex-1 overflow-hidden bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

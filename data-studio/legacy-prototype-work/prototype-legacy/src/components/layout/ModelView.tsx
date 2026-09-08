import { useParams, Outlet, Navigate } from 'react-router-dom'
import { getModelById } from '../../data/models'
import ModelHeader from './ModelHeader'
import SidebarNav from './SidebarNav'

export default function ModelView() {
  const { id } = useParams<{ id: string }>()
  const model = id ? getModelById(id) : undefined

  if (!model) {
    return <Navigate to="/data-studio/catalog" replace />
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ModelHeader model={model} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav modelId={model.id} />
        <div className="flex-1 overflow-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

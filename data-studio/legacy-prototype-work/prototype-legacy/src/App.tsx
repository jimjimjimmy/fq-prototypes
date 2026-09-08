import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AiModeProvider, useAiMode } from './context/AiModeContext'
import { CdcProvider } from './context/CdcContext'
import AdminSettingsShell from './components/layout/AdminSettingsShell'
import DataStudioShell from './components/layout/DataStudioShell'
import ModelView from './components/layout/ModelView'
import ModelsTable from './components/lineage/ModelsTable'
import ConnectionsTable from './components/lineage/ConnectionsTable'
import Placeholder from './components/shared/Placeholder'
import EntityMappingsTable from './components/entity-mappings/EntityMappingsTable'
import DimensionsTable from './components/dimensions/DimensionsTable'
import DimensionView from './components/dimensions/DimensionView'
import DimensionValuesSection from './components/dimensions/DimensionValuesSection'
import DimensionDataFlow from './components/dimensions/DimensionDataFlow'
import DevToolbar from './components/shared/DevToolbar'
import FieldMappingView from './components/field-mapping/FieldMappingView'
import OverviewSection from './components/lineage/OverviewSection'
import SourceDatasetsSection from './components/lineage/SourceDatasetsSection'
import AIGuidedApp from './ai-guided/AIGuidedApp'

function AppContent() {
  const { aiMode, setAiMode } = useAiMode()
  const location = useLocation()
  const isAiGuidedRoute = location.pathname.startsWith('/ai-guided')

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/data-studio" replace />} />

        {/* AI-Guided prototype — no FQ chrome, full viewport */}
        <Route path="/ai-guided" element={<AIGuidedApp />} />

        <Route element={<AdminSettingsShell />}>
          {/* L1: Data Studio list views */}
          <Route path="/data-studio" element={<DataStudioShell />}>
            <Route index element={<Navigate to="catalog" replace />} />
            <Route path="catalog" element={<ModelsTable />} />
            <Route path="dimensions" element={<DimensionsTable />} />
            <Route path="connections" element={<ConnectionsTable />} />
            <Route path="entity-mappings" element={<EntityMappingsTable />} />
          </Route>

          {/* L2: Dimension detail view */}
          <Route path="/data-studio/dimension/:id" element={<DimensionView />}>
            <Route index element={<Navigate to="values" replace />} />
            <Route path="values" element={<DimensionValuesSection />} />
            <Route path="data-flow" element={<DimensionDataFlow />} />
          </Route>

          {/* L2: Model detail view */}
          <Route path="/data-studio/model/:id" element={<ModelView />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewSection />} />
            <Route path="data-preview" element={<Placeholder title="Data Preview" description="Preview source data records and transformations." />} />
            <Route path="source-datasets" element={<SourceDatasetsSection />} />
            <Route path="field-mapping" element={<FieldMappingView />} />
            <Route path="versions" element={<Placeholder title="Versions" description="Version history: Draft, Active, Archived." />} />
            <Route path="logs" element={<Placeholder title="Logs" description="Pipeline run history, status, timestamps, and error details." />} />
          </Route>
        </Route>
      </Routes>

      {!isAiGuidedRoute && <DevToolbar mode={aiMode} onModeChange={setAiMode} />}
    </>
  )
}

function App() {
  return (
    <AiModeProvider>
      <CdcProvider>
        <AppContent />
      </CdcProvider>
    </AiModeProvider>
  )
}

export default App

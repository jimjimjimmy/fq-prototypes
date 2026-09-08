import { useRef, useState } from 'react'
import { GlobalNav } from './components/layout/GlobalNav'
import { SectionNav } from './components/layout/SectionNav'
import { TopBar } from './components/layout/TopBar'
import { AgentLibrary } from './components/library/AgentLibrary'
import { NewAgentFlow } from './components/creation/NewAgentFlow'
import { PlaybookViewer } from './components/library/PlaybookViewer'
import { RunAgentPanel } from './components/library/RunAgentPanel'
import type { Playbook, PlaybookStatus } from './data/mockData'

export type AppView = 'library' | 'create' | 'viewer'

const RCM_URL = 'http://localhost:5179/projects/coso-ai-rcm/?embedded=true'

export default function App() {
  const [view, setView] = useState<AppView>('library')
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)
  const [initialPanel, setInitialPanel] = useState<'run' | undefined>(undefined)
  const [runPanelPlaybook, setRunPanelPlaybook] = useState<Playbook | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, PlaybookStatus>>({})
  const [activePrototype, setActivePrototype] = useState<'agents' | 'compliance'>('agents')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleOpenPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook)
    setInitialPanel(undefined)
    setView('viewer')
  }

  const handleRunPlaybook = (playbook: Playbook) => {
    if (view === 'library') {
      // Stay on the library — open as floating overlay
      setRunPanelPlaybook(playbook)
    } else {
      // Already in the viewer — open as the run drawer
      setSelectedPlaybook(playbook)
      setInitialPanel('run')
      setView('viewer')
    }
  }

  const handleStatusChange = (id: string, status: PlaybookStatus) => {
    setStatusOverrides(prev => ({ ...prev, [id]: status }))
    if (id === 'pb-7' && status === 'Live') {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'agent-live', agentId: 'three-way-match' },
        '*'
      )
    }
  }

  const showAgents = activePrototype === 'agents'

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GlobalNav
        onComplianceClick={() => setActivePrototype('compliance')}
        onAgentsClick={() => setActivePrototype('agents')}
        activePrototype={activePrototype}
      />

      {/* SectionNav — hidden when compliance is active, preserved as flex sibling */}
      <div style={{ display: showAgents ? 'contents' : 'none' }}>
        <SectionNav />
      </div>

      {/* Main content — hidden but not unmounted when compliance is active */}
      <div style={{ flex: 1, display: showAgents ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />

        {view === 'library' && (
          <AgentLibrary
            onCreateAgent={() => setView('create')}
            onOpenPlaybook={handleOpenPlaybook}
            onRunPlaybook={handleRunPlaybook}
            statusOverrides={statusOverrides}
          />
        )}

        {view === 'create' && (
          <NewAgentFlow
            onBack={() => setView('library')}
            onFinish={() => setView('viewer')}
          />
        )}

        {view === 'viewer' && (
          <PlaybookViewer
            playbook={selectedPlaybook}
            onBack={() => setView('library')}
            onStatusChange={handleStatusChange}
            initialPanel={initialPanel}
          />
        )}
      </div>

      {/* Floating run panel — overlays the library without navigating away */}
      {runPanelPlaybook && view === 'library' && (
        <RunAgentPanel
          floating
          playbookId={runPanelPlaybook.id}
          playbookName={runPanelPlaybook.name}
          onClose={() => setRunPanelPlaybook(null)}
        />
      )}

      {/* COSO AI RCM prototype — loaded in iframe, revealed when shield is clicked */}
      <iframe
        ref={iframeRef}
        src={RCM_URL}
        style={{
          flex: 1,
          border: 'none',
          height: '100vh',
          display: showAgents ? 'none' : 'block',
        }}
        title="COSO AI RCM"
      />
    </div>
  )
}

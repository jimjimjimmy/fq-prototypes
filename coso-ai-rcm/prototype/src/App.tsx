import { useEffect, useState } from 'react'
import { AppLayout } from './layout/AppLayout'
import { Home } from './views/Home'
import { KeySystems } from './views/KeySystems'
import { AgentDetails } from './views/AgentDetails'
import { Tests } from './views/Tests'
import { Gaps } from './views/Gaps'
import { AICapabilities } from './views/AICapabilities'
import { NewAgentFlow } from './views/NewAgentFlow'
import { PlaybookViewer } from './views/PlaybookViewer'
import { INITIAL_AGENTS, type Agent } from './data/agents'
import { getAgentCapabilityIds } from './data/risks-controls'

export type ViewId =
  | 'home' | 'key-systems' | 'agent-details' | 'tests' | 'gaps' | 'ai-capabilities'
  | 'new-agent' | 'playbook-viewer'

const isEmbedded = new URLSearchParams(window.location.search).has('embedded')

const THREE_WAY_MATCH_AGENT: Omit<Agent, 'capabilityIds'> = {
  id: 'three-way-match',
  name: 'Three-Way Match Review',
  description: 'Matches POs, receiving reports, and vendor invoices to identify line-item discrepancies. Flags quantity, price, and terms mismatches before payment authorization.',
  owner: { name: 'Joseph Vu', initials: 'JV' },
  reliance: 'not-reliable',
  openGaps: 0,
  frequency: 'On demand',
  lastRun: 'Just registered',
  health: 'healthy',
  isNewFromTransform: true,
}

export default function App() {
  const [view, setView] = useState<ViewId>(isEmbedded ? 'key-systems' : 'home')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== 'agent-live') return
      if (event.data?.agentId !== 'three-way-match') return
      setAgents((prev) => {
        if (prev.some((a) => a.id === 'three-way-match')) return prev
        const newAgent: Agent = {
          ...THREE_WAY_MATCH_AGENT,
          capabilityIds: getAgentCapabilityIds('three-way-match'),
        }
        return [newAgent, ...prev]
      })
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  function navigate(next: ViewId) {
    if (next !== 'agent-details') setSelectedAgentId(null)
    setView(next)
  }

  function openAgent(id: string) {
    setSelectedAgentId(id)
    setView('agent-details')
  }

  const newAgentCount = agents.filter((a) => a.isNewFromTransform).length

  return (
    <AppLayout currentView={view} onNavigate={navigate} newAgentCount={newAgentCount}>
      {view === 'home' && <Home onGetStarted={() => navigate('key-systems')} />}
      {view === 'key-systems' && (
        <KeySystems
          agents={agents}
          onSelectAgent={openAgent}
          onCreateAgent={() => navigate('new-agent')}
        />
      )}
      {view === 'agent-details' && selectedAgentId && (
        <AgentDetails agentId={selectedAgentId} agents={agents} onBack={() => navigate('key-systems')} />
      )}
      {view === 'tests' && <Tests onSelectAgent={openAgent} />}
      {view === 'gaps' && <Gaps onSelectAgent={openAgent} />}
      {view === 'ai-capabilities' && <AICapabilities />}
      {view === 'new-agent' && (
        <NewAgentFlow
          onBack={() => navigate('key-systems')}
          onFinish={() => navigate('playbook-viewer')}
        />
      )}
      {view === 'playbook-viewer' && (
        <PlaybookViewer onBack={() => navigate('key-systems')} />
      )}
    </AppLayout>
  )
}

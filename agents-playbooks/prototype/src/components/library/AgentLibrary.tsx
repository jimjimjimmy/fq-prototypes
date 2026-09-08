import { useState } from 'react'
import { LayoutGrid, List, ChevronDown } from 'lucide-react'
import { FOLDERS, PLAYBOOKS, type Playbook, type PlaybookStatus, type PlaybookType } from '../../data/mockData'
import { FolderTree } from './FolderTree'
import { PlaybookCard } from './PlaybookCard'

type ViewMode = 'grid' | 'list'

interface AgentLibraryProps {
  onCreateAgent: () => void
  onOpenPlaybook: (playbook: Playbook) => void
  onRunPlaybook?: (playbook: Playbook) => void
  statusOverrides?: Record<string, PlaybookStatus>
}

export function AgentLibrary({ onCreateAgent, onOpenPlaybook, onRunPlaybook, statusOverrides }: AgentLibraryProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('ap')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [typeFilter, setTypeFilter] = useState<PlaybookType | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<PlaybookStatus | 'All'>('All')

  const selectedFolder = FOLDERS.find((f) => f.id === selectedFolderId)

  const mergedPlaybooks = PLAYBOOKS.map(p =>
    statusOverrides?.[p.id] ? { ...p, status: statusOverrides[p.id] } : p
  )

  const folderPlaybooks = mergedPlaybooks.filter((p) => {
    if (p.folderId !== selectedFolderId) return false
    if (typeFilter !== 'All' && p.type !== typeFilter) return false
    if (statusFilter !== 'All' && p.status !== statusFilter) return false
    return true
  })

  const allFolderPlaybooks = mergedPlaybooks.filter((p) => p.folderId === selectedFolderId)
  const liveCount = allFolderPlaybooks.filter((p) => p.status === 'Live').length
  const draftCount = allFolderPlaybooks.filter((p) => p.status === 'Draft').length
  const pendingCount = allFolderPlaybooks.filter((p) => p.status === 'Pending Approval').length

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left sidebar */}
      <aside style={{ width: 232, background: '#FFFFFF', borderRight: '1px solid #E4E9F2', overflow: 'auto', flexShrink: 0 }}>
        <FolderTree
          folders={FOLDERS}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: '#F8FAFC' }}>
        {selectedFolder ? (
          <div style={{ padding: '24px 24px' }}>
            {/* Page header */}
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1D2433', margin: '0 0 16px' }}>
              {selectedFolder.name}
            </h1>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E4E9F2', marginBottom: 16 }}>
              {['Agents', 'Documents', 'Permissions'].map((tab) => (
                <button
                  key={tab}
                  style={{
                    padding: '8px 16px 10px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    fontWeight: tab === 'Agents' ? 600 : 400,
                    color: tab === 'Agents' ? '#1D2433' : '#6B7A99',
                    borderBottom: tab === 'Agents' ? '2px solid #1D2433' : '2px solid transparent',
                    cursor: 'pointer',
                    marginBottom: -1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              {/* Agent Type filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7A99', fontWeight: 500, whiteSpace: 'nowrap' }}>Agent Type</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['All', 'Playbooks', 'Workflows'] as const).map((f) => {
                    const value = f === 'Playbooks' ? 'Playbook' : f === 'Workflows' ? 'Workflow' : 'All'
                    const active = typeFilter === value
                    return (
                      <button
                        key={f}
                        onClick={() => setTypeFilter(value as PlaybookType | 'All')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 5,
                          border: active ? 'none' : '1px solid #D0D9E8',
                          background: active ? '#1D2433' : '#fff',
                          color: active ? '#fff' : '#4A556A',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 20, background: '#E4E9F2' }} />

              {/* Status filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7A99', fontWeight: 500 }}>Status</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['All', 'Live', 'Draft'] as const).map((s) => {
                    const active = statusFilter === s
                    return (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s as PlaybookStatus | 'All')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 5,
                          border: active ? 'none' : '1px solid #D0D9E8',
                          background: active ? '#1D2433' : '#fff',
                          color: active ? '#fff' : '#4A556A',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                  {/* Pending Approval with badge */}
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'Pending Approval' ? 'All' : 'Pending Approval')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 5,
                      border: statusFilter === 'Pending Approval' ? 'none' : '1px solid #D0D9E8',
                      background: statusFilter === 'Pending Approval' ? '#1D2433' : '#fff',
                      color: statusFilter === 'Pending Approval' ? '#fff' : '#4A556A',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Pending Approval
                    {pendingCount > 0 && (
                      <span style={{
                        background: '#F4A429',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        fontSize: 10,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {pendingCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div style={{ flex: 1 }} />

              {/* Live / Draft counts */}
              {allFolderPlaybooks.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#1FAC76', fontWeight: 500 }}>{liveCount} Live</span>
                  <span style={{ color: '#D0D9E8' }}>|</span>
                  <span style={{ color: '#6B7A99', fontWeight: 500 }}>{draftCount} Draft</span>
                </div>
              )}

              {/* View toggle */}
              <div style={{ display: 'flex', border: '1px solid #D0D9E8', borderRadius: 6, overflow: 'hidden' }}>
                {(['grid', 'list'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      width: 32,
                      height: 30,
                      border: 'none',
                      background: viewMode === mode ? '#EEF2F8' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: viewMode === mode ? '#1D2433' : '#8896B0',
                    }}
                  >
                    {mode === 'grid'
                      ? <LayoutGrid size={14} strokeWidth={1.75} />
                      : <List size={14} strokeWidth={1.75} />
                    }
                  </button>
                ))}
              </div>

              {/* Create button */}
              <button
                onClick={onCreateAgent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 14px',
                  height: 32,
                  borderRadius: 6,
                  border: 'none',
                  background: '#1FAC76',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Create
                <ChevronDown size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Cards grid */}
            {folderPlaybooks.length === 0 ? (
              <FolderEmptyState onCreateAgent={onCreateAgent} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {folderPlaybooks.map((pb) => (
                  <PlaybookCard key={pb.id} playbook={pb} onOpen={onOpenPlaybook} onRun={onRunPlaybook} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <FolderEmptyState onCreateAgent={onCreateAgent} />
        )}
      </main>
    </div>
  )
}

function FolderEmptyState({ onCreateAgent }: { onCreateAgent: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 8 }}>
      <p style={{ fontSize: 14, color: '#6B7A99', margin: 0 }}>No Agents in this folder</p>
      <button
        onClick={onCreateAgent}
        style={{ background: 'transparent', border: 'none', color: '#1FAC76', fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
      >
        Create Agent
      </button>
    </div>
  )
}

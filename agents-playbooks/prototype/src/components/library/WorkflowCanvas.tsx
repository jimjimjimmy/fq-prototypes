import { useState } from 'react'
import {
  Sparkles, MousePointer2, Hand, GitBranch, ChevronDown,
  User, Send, FileText, LayoutGrid,
} from 'lucide-react'
import type { WorkflowDef, WorkflowNode, WorkflowNodeType, WorkflowEdge, WorkflowControl } from '../../data/playbookContent'

// ─── Visual config per node type ───────────────────────────────────────────

type NodeConfig = {
  iconBg: string
  iconColor: string
  labelColor: string
  typeLabel: string
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
}

const NODE_CONFIG: Record<WorkflowNodeType, NodeConfig> = {
  'data-transform': {
    iconBg: '#E3F9EE', iconColor: '#1FAC76', labelColor: '#1FAC76',
    typeLabel: 'Data Transformation',
    Icon: LayoutGrid,
  },
  'human-review': {
    iconBg: '#FEF3E2', iconColor: '#D97706', labelColor: '#D97706',
    typeLabel: 'Human Review',
    Icon: User,
  },
  'post-je': {
    iconBg: '#FEE2E2', iconColor: '#EF4444', labelColor: '#EF4444',
    typeLabel: 'Post JE',
    Icon: FileText,
  },
  'notification': {
    iconBg: '#EFF6FF', iconColor: '#3B82F6', labelColor: '#3B82F6',
    typeLabel: 'Notification',
    Icon: Send,
  },
}

// ─── Layout constants ────────────────────────────────────────────────────────

const MAIN_NODE_W  = 210
const BRANCH_NODE_W = 180
const BRANCH_GAP   = 56

// ─── Sub-components ──────────────────────────────────────────────────────────

function ControlsTooltip({ controls }: { controls: WorkflowControl[] }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: 0,
      zIndex: 200,
      background: '#fff',
      border: '1px solid #E4E9F2',
      borderRadius: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
      width: 292,
      overflow: 'hidden',
      // prevent the card from clipping the tooltip
      pointerEvents: 'none',
    }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #F0F2F5',
        fontSize: 10, fontWeight: 700, color: '#8896B0',
        textTransform: 'uppercase', letterSpacing: '0.6px',
        fontFamily: 'Inter, sans-serif',
      }}>
        Linked Controls
      </div>
      {controls.map((ctrl, i) => (
        <div key={ctrl.id} style={{
          padding: '8px 12px',
          borderBottom: i < controls.length - 1 ? '1px solid #F8FAFC' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, color: '#1557A0',
              background: '#EBF4FF', border: '1px solid #BFDBFE',
              borderRadius: 3, padding: '1px 5px',
              fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            }}>
              {ctrl.id}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#1D2433',
              fontFamily: 'Inter, sans-serif', lineHeight: '14px',
            }}>
              {ctrl.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{
              fontSize: 9, color: '#6B7A99', background: '#F3F4F6',
              borderRadius: 3, padding: '2px 6px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {ctrl.frequency}
            </span>
            <span style={{
              fontSize: 9, color: '#6B7A99', background: '#F3F4F6',
              borderRadius: 3, padding: '2px 6px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {ctrl.enforcement}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function FlowNode({ node, width = MAIN_NODE_W }: { node: WorkflowNode; width?: number }) {
  const cfg = NODE_CONFIG[node.type]
  const hasControls = node.controls && node.controls.length > 0
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div style={{
      position: 'relative',
      width,
      padding: hasControls ? '10px 12px 8px' : '10px 12px',
      background: '#fff',
      border: '1px solid #E4E9F2',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      flexShrink: 0,
    }}>
      {/* AI sparkle badge */}
      <div style={{
        position: 'absolute', top: -8, left: -8,
        width: 18, height: 18, borderRadius: 4,
        background: '#fff', border: '1px solid #E4E9F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <Sparkles size={10} color="#94A3B8" strokeWidth={1.5} />
      </div>

      {/* Main row: icon + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Colored icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 6, flexShrink: 0,
          background: cfg.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <cfg.Icon size={16} color={cfg.iconColor} strokeWidth={1.75} />
        </div>

        {/* Text */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#1D2433',
            lineHeight: '16px', marginBottom: 3,
            fontFamily: 'Inter, sans-serif',
          }}>
            {node.label}
          </div>
          <div style={{ fontSize: 10, color: cfg.labelColor, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
            {cfg.typeLabel}
          </div>
        </div>
      </div>

      {/* Controls badge row */}
      {hasControls && (
        <div
          style={{ position: 'relative', display: 'inline-flex' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 5px 3px 9px', borderRadius: 20,
            border: '1px solid #E4E9F2', background: '#F5F6F8',
            cursor: 'default', userSelect: 'none',
          }}>
            <span style={{
              fontSize: 11, color: '#6B7A99', fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}>
              Controls
            </span>
            <div style={{
              minWidth: 18, height: 18, borderRadius: 9,
              background: '#3D4462', color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
              fontFamily: 'Inter, sans-serif',
            }}>
              {node.controls!.length}
            </div>
          </div>

          {/* Tooltip */}
          {showTooltip && <ControlsTooltip controls={node.controls!} />}
        </div>
      )}
    </div>
  )
}

function ArrowConnector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width="16" height="30" viewBox="0 0 16 30" fill="none">
        <line x1="8" y1="0" x2="8" y2="22" stroke="#CBD5E1" strokeWidth="1.5" />
        <polygon points="8,28 4,20 12,20" fill="#CBD5E1" />
      </svg>
    </div>
  )
}

function BranchConnector({ leftLabel, rightLabel }: { leftLabel: string; rightLabel: string }) {
  const totalW = BRANCH_NODE_W * 2 + BRANCH_GAP   // 416
  const leftX  = BRANCH_NODE_W / 2                // 90
  const rightX = BRANCH_NODE_W + BRANCH_GAP + BRANCH_NODE_W / 2  // 326
  const midX   = totalW / 2                       // 208
  const splitY = 26
  const endY   = 58

  return (
    <svg
      width={totalW}
      height={endY}
      viewBox={`0 0 ${totalW} ${endY}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Spine down to split */}
      <line x1={midX} y1={0} x2={midX} y2={splitY} stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Horizontal crossbar */}
      <line x1={leftX} y1={splitY} x2={rightX} y2={splitY} stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Left branch descend */}
      <line x1={leftX} y1={splitY} x2={leftX} y2={endY - 6} stroke="#CBD5E1" strokeWidth="1.5" />
      <polygon
        points={`${leftX},${endY} ${leftX - 4},${endY - 10} ${leftX + 4},${endY - 10}`}
        fill="#CBD5E1"
      />
      {/* Right branch descend */}
      <line x1={rightX} y1={splitY} x2={rightX} y2={endY - 6} stroke="#CBD5E1" strokeWidth="1.5" />
      <polygon
        points={`${rightX},${endY} ${rightX - 4},${endY - 10} ${rightX + 4},${endY - 10}`}
        fill="#CBD5E1"
      />
      {/* Branch labels */}
      <text
        x={leftX} y={splitY + 18}
        textAnchor="middle" fontSize="10" fill="#8896B0"
        fontFamily="Inter, sans-serif" fontWeight="500"
      >
        {leftLabel}
      </text>
      <text
        x={rightX} y={splitY + 18}
        textAnchor="middle" fontSize="10" fill="#8896B0"
        fontFamily="Inter, sans-serif" fontWeight="500"
      >
        {rightLabel}
      </text>
    </svg>
  )
}

function PlusAddButton() {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      border: '1.5px dashed #CBD5E1',
      background: '#F8FAFC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'default', color: '#94A3B8',
      fontSize: 16, lineHeight: '1', userSelect: 'none',
      marginTop: 6,
    }}>
      +
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface WorkflowCanvasProps {
  data?: WorkflowDef
}

export function WorkflowCanvas({ data }: WorkflowCanvasProps) {
  const [activeTool, setActiveTool] = useState<'cursor' | 'hand' | 'connect'>('cursor')

  if (!data) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F2F5' }}>
        <span style={{ fontSize: 13, color: '#8896B0', fontFamily: 'Inter, sans-serif' }}>No workflow defined</span>
      </div>
    )
  }

  // Build adjacency map
  const edgesByFrom: Record<string, WorkflowEdge[]> = {}
  for (const e of data.edges) {
    if (!edgesByFrom[e.from]) edgesByFrom[e.from] = []
    edgesByFrom[e.from].push(e)
  }

  const nodeMap: Record<string, WorkflowNode> = Object.fromEntries(data.nodes.map(n => [n.id, n]))

  // Find the branch node (2 outgoing edges) and leaf nodes
  const branchEntry = Object.entries(edgesByFrom).find(([, edges]) => edges.length > 1)
  const branchNodeId = branchEntry?.[0]
  const branchEdges: WorkflowEdge[] = branchNodeId ? edgesByFrom[branchNodeId] : []
  const leafIds = branchEdges.map(e => e.to)

  // Traverse linear spine from start node up to (and including) the branch node
  const spineNodes: WorkflowNode[] = []
  const startNode = data.nodes.find(n => n.isStart) ?? data.nodes[0]
  let cur: WorkflowNode | undefined = startNode
  while (cur && !leafIds.includes(cur.id)) {
    spineNodes.push(cur)
    const nexts = edgesByFrom[cur.id]
    if (!nexts || nexts.length !== 1) break
    cur = nodeMap[nexts[0].to]
  }

  const branchNodes = leafIds.map(id => nodeMap[id]).filter(Boolean)

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      background: '#F0F2F5',
    }}>
      {/* Edit with AI — fixed top-right */}
      <div style={{ position: 'absolute', top: 14, right: 16, zIndex: 10 }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 6,
          border: '1px solid #E4E9F2', background: '#fff',
          fontSize: 12, fontWeight: 500, color: '#4A556A',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <Sparkles size={13} color="#7C3AED" strokeWidth={1.75} />
          Edit with AI
        </button>
      </div>

      {/* Scrollable canvas area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '56px 48px 96px',
      }}>
        {/* Flow column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {spineNodes.map((node, i) => (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* Starting point label above first node */}
              {i === 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  marginBottom: 10,
                  fontSize: 10, fontWeight: 700, color: '#94A3B8',
                  textTransform: 'uppercase', letterSpacing: '0.7px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <svg width="9" height="10" viewBox="0 0 9 10">
                    <polygon points="0,0 9,5 0,10" fill="#94A3B8" />
                  </svg>
                  Starting Point
                </div>
              )}

              <FlowNode node={node} />

              {/* Connector after this node */}
              {i < spineNodes.length - 1 ? (
                <ArrowConnector />
              ) : branchNodes.length > 0 ? (
                /* Branch connector + leaf nodes */
                <>
                  <BranchConnector
                    leftLabel={branchEdges[0]?.label ?? ''}
                    rightLabel={branchEdges[1]?.label ?? ''}
                  />
                  <div style={{ display: 'flex', gap: BRANCH_GAP, alignItems: 'flex-start' }}>
                    {branchNodes.map(n => (
                      <div key={n.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FlowNode node={n} width={BRANCH_NODE_W} />
                        <PlusAddButton />
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ))}

        </div>
      </div>

      {/* Bottom toolbar */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: '#fff',
        border: '1px solid #E4E9F2',
        borderRadius: 8,
        padding: '4px 6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        zIndex: 10,
        whiteSpace: 'nowrap',
      }}>
        {/* Zoom selector */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 5, border: 'none',
          background: 'transparent', fontSize: 12, fontWeight: 500,
          color: '#4A556A', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          80%
          <ChevronDown size={11} strokeWidth={2.5} color="#8896B0" />
        </button>

        <div style={{ width: 1, height: 16, background: '#E4E9F2', margin: '0 2px' }} />

        {/* Cursor tool */}
        <ToolbarBtn
          active={activeTool === 'cursor'}
          title="Select"
          onClick={() => setActiveTool('cursor')}
        >
          <MousePointer2 size={14} strokeWidth={1.75} />
        </ToolbarBtn>

        {/* Hand tool */}
        <ToolbarBtn
          active={activeTool === 'hand'}
          title="Pan"
          onClick={() => setActiveTool('hand')}
        >
          <Hand size={14} strokeWidth={1.75} />
        </ToolbarBtn>

        {/* Connect tool */}
        <ToolbarBtn
          active={activeTool === 'connect'}
          title="Connect nodes"
          onClick={() => setActiveTool('connect')}
        >
          <GitBranch size={14} strokeWidth={1.75} />
        </ToolbarBtn>
      </div>
    </div>
  )
}

// ─── Toolbar button helper ────────────────────────────────────────────────────

function ToolbarBtn({
  active, title, onClick, children,
}: {
  active: boolean
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 5, border: 'none',
        background: active ? '#EEF2F8' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: active ? '#1D2433' : '#6B7A99',
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  )
}

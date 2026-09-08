import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Link2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { useTaskStore } from '@/runtime/TaskStore';
import { useDagLayout, NODE_WIDTH, NODE_HEIGHT } from '@/hooks/use-dag-layout';

interface DependencyFlowViewProps {
  tasks: Task[];
  onSelectTask: (id: number) => void;
}

const statusColors: Record<TaskStatus, { bg: string; border: string; text: string }> = {
  'Complete': { bg: '#e3f5e6', border: '#2a6a39', text: '#2a6a39' },
  'Not Started': { bg: '#f2f1f0', border: '#555352', text: '#555352' },
  'In Progress': { bg: '#e3edf6', border: '#507fc0', text: '#507fc0' },
  'Ready for Review': { bg: '#f4eef9', border: '#73418a', text: '#73418a' },
  'Blocked': { bg: '#fdebd7', border: '#e15015', text: '#e15015' },
};

const edgeColor = (sourceStatus: TaskStatus, targetStatus: TaskStatus) => {
  if (targetStatus === 'Blocked') return '#e15015';
  if (sourceStatus === 'Complete') return '#2a6a39';
  return '#94a3b8';
};

export function DependencyFlowView({ tasks, onSelectTask }: DependencyFlowViewProps) {
  const { dependencyGraph } = useTaskStore();
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
  const [focusedTaskId, setFocusedTaskId] = useState<number | null>(null);
  const [showIsolated, setShowIsolated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter to only tasks with dependencies (or all if showIsolated)
  const connectedTaskIds = new Set<number>();
  for (const edge of dependencyGraph.edges) {
    connectedTaskIds.add(edge.from);
    connectedTaskIds.add(edge.to);
  }

  const dagTasks = showIsolated
    ? tasks
    : tasks.filter(t => connectedTaskIds.has(t.id));

  const layout = useDagLayout(dagTasks, dependencyGraph.edges);

  const highlightedIds = hoveredTaskId
    ? layout.getFullChain(hoveredTaskId)
    : focusedTaskId
    ? layout.getFullChain(focusedTaskId)
    : null;

  // Build a position map for edges
  const posMap = new Map<number, { x: number; y: number }>();
  for (const node of layout.nodes) {
    posMap.set(node.task.id, { x: node.x, y: node.y });
  }

  const isolatedCount = tasks.filter(t => !connectedTaskIds.has(t.id)).length;

  // Focus on a chain by clicking the link icon on a node
  const handleFocus = useCallback((taskId: number) => {
    setFocusedTaskId(prev => (prev === taskId ? null : taskId));
  }, []);

  // Filter tasks if focused
  const focusedIds = focusedTaskId ? layout.getFullChain(focusedTaskId) : null;
  const visibleNodes = focusedIds
    ? layout.nodes.filter(n => focusedIds.has(n.task.id))
    : layout.nodes;
  const visibleEdges = focusedIds
    ? dependencyGraph.edges.filter(e => focusedIds.has(e.from) && focusedIds.has(e.to))
    : dependencyGraph.edges.filter(e => posMap.has(e.from) && posMap.has(e.to));

  // When focused, re-layout just the focused chain
  const focusLayout = useDagLayout(
    focusedIds ? dagTasks.filter(t => focusedIds.has(t.id)) : [],
    focusedIds ? visibleEdges : []
  );

  const activeNodes = focusedIds ? focusLayout.nodes : visibleNodes;
  const activeEdges = focusedIds ? focusLayout.edges : visibleEdges;
  const activeWidth = focusedIds ? focusLayout.width : layout.width;
  const activeHeight = focusedIds ? focusLayout.height : layout.height;

  // Build position map for active layout
  const activePosMap = new Map<number, { x: number; y: number }>();
  for (const node of activeNodes) {
    activePosMap.set(node.task.id, { x: node.x, y: node.y });
  }

  // Scroll to start on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      scrollRef.current.scrollTop = 0;
    }
  }, [focusedTaskId]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#e4e7ec] bg-[rgba(245,245,245,0.6)] shrink-0">
        {focusedTaskId && (
          <button
            onClick={() => setFocusedTaskId(null)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#507fc0] text-white text-[11px] font-medium hover:bg-[#3d6aa8] transition-colors"
          >
            <X size={12} />
            Clear focus
          </button>
        )}
        {!showIsolated && isolatedCount > 0 && (
          <button
            onClick={() => setShowIsolated(true)}
            className="text-[11px] font-medium text-[#507fc0] hover:text-[#3d6aa8] transition-colors"
          >
            Show {isolatedCount} independent tasks
          </button>
        )}
        {showIsolated && (
          <button
            onClick={() => setShowIsolated(false)}
            className="text-[11px] font-medium text-[#507fc0] hover:text-[#3d6aa8] transition-colors"
          >
            Hide independent tasks
          </button>
        )}
        <div className="ml-auto text-[11px] text-[#6b7280] font-medium">
          {activeNodes.length} tasks · {activeEdges.length} dependencies
        </div>
      </div>

      {/* Canvas */}
      <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-hide p-4">
        <div
          className="relative"
          style={{ width: Math.max(activeWidth, 600), height: Math.max(activeHeight, 400) }}
        >
          {/* SVG connector layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={Math.max(activeWidth, 600)}
            height={Math.max(activeHeight, 400)}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#2a6a39" />
              </marker>
              <marker
                id="arrowhead-orange"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#e15015" />
              </marker>
            </defs>
            {activeEdges.map(edge => {
              const from = activePosMap.get(edge.from);
              const to = activePosMap.get(edge.to);
              if (!from || !to) return null;

              const fromTask = dagTasks.find(t => t.id === edge.from);
              const toTask = dagTasks.find(t => t.id === edge.to);
              if (!fromTask || !toTask) return null;

              const color = edgeColor(fromTask.status, toTask.status);
              const isInChain = highlightedIds ? highlightedIds.has(edge.from) && highlightedIds.has(edge.to) : true;
              const opacity = highlightedIds ? (isInChain ? 1 : 0.12) : 1;

              const x1 = from.x + NODE_WIDTH;
              const y1 = from.y + NODE_HEIGHT / 2;
              const x2 = to.x;
              const y2 = to.y + NODE_HEIGHT / 2;
              const midX = (x1 + x2) / 2;

              const markerId = color === '#2a6a39' ? 'arrowhead-green'
                : color === '#e15015' ? 'arrowhead-orange'
                : 'arrowhead';

              return (
                <motion.path
                  key={`${edge.from}-${edge.to}`}
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={isInChain && highlightedIds ? 2.5 : 1.5}
                  opacity={opacity}
                  markerEnd={`url(#${markerId})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
          </svg>

          {/* Task nodes */}
          {activeNodes.map(node => {
            const { task, x, y } = node;
            const colors = statusColors[task.status];
            const isInChain = highlightedIds ? highlightedIds.has(task.id) : true;
            const isHovered = hoveredTaskId === task.id;

            return (
              <motion.div
                key={task.id}
                className="absolute cursor-pointer group"
                style={{ left: x, top: y, width: NODE_WIDTH, height: NODE_HEIGHT }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: highlightedIds ? (isInChain ? 1 : 0.15) : 1,
                  scale: 1,
                }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
                onClick={() => onSelectTask(task.id)}
              >
                <div
                  className="h-full rounded-lg border-2 px-3 py-2 flex flex-col justify-between transition-shadow"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: isHovered ? colors.border : `${colors.border}99`,
                    boxShadow: isHovered ? `0 4px 12px ${colors.border}25` : 'none',
                  }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828] leading-[16px] truncate flex-1">
                      {task.name}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFocus(task.id); }}
                      className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-black/5 transition-opacity"
                      title="Focus on this dependency chain"
                    >
                      <Link2 size={12} className="text-[#6b7280]" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: `${colors.border}20`, color: colors.text }}
                      >
                        {task.status}
                      </span>
                      <span className="text-[10px] text-[#6b7280] font-medium">{task.preparer}</span>
                    </div>
                    <span className="text-[10px] text-[#6b7280] font-medium">{task.dueDate}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

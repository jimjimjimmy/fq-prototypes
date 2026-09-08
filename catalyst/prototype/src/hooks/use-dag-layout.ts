import { useMemo } from 'react';
import type { Task } from '@/types';
import type { DependencyEdge } from '@/runtime/TaskStore';

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 72;
export const LAYER_GAP = 180;
export const NODE_GAP = 20;

export interface DagNode {
  task: Task;
  x: number;
  y: number;
  layer: number;
}

export interface DagLayout {
  nodes: DagNode[];
  edges: DependencyEdge[];
  width: number;
  height: number;
  getUpstreamChain: (taskId: number) => Set<number>;
  getDownstreamChain: (taskId: number) => Set<number>;
  getFullChain: (taskId: number) => Set<number>;
}

export function useDagLayout(tasks: Task[], edges: DependencyEdge[]): DagLayout {
  return useMemo(() => {
    // Build adjacency lists
    const forward = new Map<number, number[]>(); // from → [to]
    const reverse = new Map<number, number[]>(); // to → [from]
    const taskMap = new Map<number, Task>();

    for (const t of tasks) {
      taskMap.set(t.id, t);
      forward.set(t.id, []);
      reverse.set(t.id, []);
    }

    for (const edge of edges) {
      if (taskMap.has(edge.from) && taskMap.has(edge.to)) {
        forward.get(edge.from)!.push(edge.to);
        reverse.get(edge.to)!.push(edge.from);
      }
    }

    // Topological sort with layer assignment
    const inDegree = new Map<number, number>();
    for (const t of tasks) {
      inDegree.set(t.id, (reverse.get(t.id) ?? []).length);
    }

    const layers = new Map<number, number>();
    const queue: number[] = [];

    // Start with nodes that have no incoming edges
    for (const t of tasks) {
      if (inDegree.get(t.id) === 0) {
        queue.push(t.id);
        layers.set(t.id, 0);
      }
    }

    let idx = 0;
    while (idx < queue.length) {
      const nodeId = queue[idx++];
      const currentLayer = layers.get(nodeId)!;

      for (const next of forward.get(nodeId) ?? []) {
        // Each node's layer = max of all predecessor layers + 1
        const prevLayer = layers.get(next) ?? 0;
        layers.set(next, Math.max(prevLayer, currentLayer + 1));

        const newDeg = (inDegree.get(next) ?? 1) - 1;
        inDegree.set(next, newDeg);
        if (newDeg === 0) {
          queue.push(next);
        }
      }
    }

    // Handle any tasks not in the graph (cycles or disconnected with deps outside filtered set)
    for (const t of tasks) {
      if (!layers.has(t.id)) {
        layers.set(t.id, 0);
      }
    }

    // Group tasks by layer
    const layerGroups = new Map<number, Task[]>();
    for (const t of tasks) {
      const layer = layers.get(t.id)!;
      if (!layerGroups.has(layer)) layerGroups.set(layer, []);
      layerGroups.get(layer)!.push(t);
    }

    // Sort within each layer by due date
    for (const [, group] of layerGroups) {
      group.sort((a, b) => {
        const dateA = a.startDate ? new Date(`2026-${a.startDate}`).getTime() : 0;
        const dateB = b.startDate ? new Date(`2026-${b.startDate}`).getTime() : 0;
        return dateA - dateB;
      });
    }

    // Position nodes
    const maxLayer = Math.max(...Array.from(layers.values()), 0);
    const nodes: DagNode[] = [];

    for (let layer = 0; layer <= maxLayer; layer++) {
      const group = layerGroups.get(layer) ?? [];
      const x = 40 + layer * (NODE_WIDTH + LAYER_GAP);

      for (let i = 0; i < group.length; i++) {
        const y = 40 + i * (NODE_HEIGHT + NODE_GAP);
        nodes.push({ task: group[i], x, y, layer });
      }
    }

    // Calculate total dimensions
    const width = 80 + (maxLayer + 1) * (NODE_WIDTH + LAYER_GAP);
    const maxNodesInLayer = Math.max(...Array.from(layerGroups.values()).map(g => g.length), 1);
    const height = 80 + maxNodesInLayer * (NODE_HEIGHT + NODE_GAP);

    // Chain traversal helpers
    const getUpstreamChain = (taskId: number): Set<number> => {
      const visited = new Set<number>();
      const stack = [taskId];
      while (stack.length > 0) {
        const id = stack.pop()!;
        if (visited.has(id)) continue;
        visited.add(id);
        for (const parent of reverse.get(id) ?? []) {
          stack.push(parent);
        }
      }
      return visited;
    };

    const getDownstreamChain = (taskId: number): Set<number> => {
      const visited = new Set<number>();
      const stack = [taskId];
      while (stack.length > 0) {
        const id = stack.pop()!;
        if (visited.has(id)) continue;
        visited.add(id);
        for (const child of forward.get(id) ?? []) {
          stack.push(child);
        }
      }
      return visited;
    };

    const getFullChain = (taskId: number): Set<number> => {
      const up = getUpstreamChain(taskId);
      const down = getDownstreamChain(taskId);
      return new Set([...up, ...down]);
    };

    return { nodes, edges, width, height, getUpstreamChain, getDownstreamChain, getFullChain };
  }, [tasks, edges]);
}

import { createContext, useContext, useReducer, useCallback, useMemo, useState, useEffect, type ReactNode } from 'react';
import type { Task, TaskStatus, TaskDetail } from '@/types';
import { tasks as seedTasks } from '@/data/tasks';
import { taskDetails as seedDetails } from '@/data/task-details';

// ── Dependency Graph Types ──────────────────────────────────────

export interface DependencyEdge {
  from: number; // blocking task
  to: number;   // blocked task
}

export interface DependencyGraph {
  edges: DependencyEdge[];
  getBlockers: (taskId: number) => Task[];
  getBlocked: (taskId: number) => Task[];
  isBlocked: (taskId: number) => boolean;
}

// ── Actions ──────────────────────────────────────────────────────

type TaskAction =
  | { type: 'UPDATE_TASK_STATUS'; taskId: number; status: TaskStatus }
  | { type: 'TOGGLE_SIGN_OFF'; taskId: number }
  | { type: 'SUBMIT_JOURNAL_ENTRY'; taskId: number }
  | { type: 'ADD_COMMENT'; taskId: number; author: string; initials: string; message: string }
  | { type: 'SET_WORKFLOW_STAGE'; taskId: number; stageId: string }
  | { type: 'ADD_DEPENDENCY'; taskId: number; dependsOn: number }
  | { type: 'REMOVE_DEPENDENCY'; taskId: number; dependsOn: number }
  | { type: 'RESET' };

// ── State ────────────────────────────────────────────────────────

interface TaskState {
  tasks: Task[];
  details: Record<number, TaskDetail>;
}

function buildInitialState(): TaskState {
  return {
    tasks: structuredClone(seedTasks),
    details: structuredClone(seedDetails),
  };
}

// ── Auto-unblock Logic ──────────────────────────────────────────

function autoUnblock(tasks: Task[]): Task[] {
  return tasks.map(t => {
    if (t.status !== 'Blocked' || !t.dependencies?.length) return t;
    const allDepsComplete = t.dependencies.every(depId => {
      const dep = tasks.find(d => d.id === depId);
      return dep?.status === 'Complete';
    });
    if (allDepsComplete) return { ...t, status: 'Not Started' as TaskStatus };
    return t;
  });
}

// ── Reducer ──────────────────────────────────────────────────────

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'UPDATE_TASK_STATUS': {
      let tasks = state.tasks.map(t =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      );
      // Auto-unblock downstream tasks when a task completes
      if (action.status === 'Complete') {
        tasks = autoUnblock(tasks);
      }
      const details = { ...state.details };
      const detail = details[action.taskId];
      if (detail) {
        details[action.taskId] = { ...detail };
        if (action.status === 'Complete') {
          details[action.taskId] = {
            ...detail,
            currentStage: 'review',
            workflowStages: detail.workflowStages.map(s => ({ ...s, status: 'complete' as const })),
          };
        }
      }
      return { ...state, tasks, details };
    }

    case 'TOGGLE_SIGN_OFF': {
      const details = { ...state.details };
      const detail = details[action.taskId];
      if (detail?.isSignedOff) return state;
      if (detail) {
        details[action.taskId] = {
          ...detail,
          isSignedOff: true,
          workflowStages: detail.workflowStages.map(s => ({ ...s, status: 'complete' as const })),
        };
      }
      let tasks = state.tasks.map(t =>
        t.id === action.taskId ? { ...t, status: 'Complete' as TaskStatus } : t
      );
      // Auto-unblock downstream tasks
      tasks = autoUnblock(tasks);
      return { ...state, tasks, details };
    }

    case 'SUBMIT_JOURNAL_ENTRY': {
      const details = { ...state.details };
      const detail = details[action.taskId];
      if (detail) {
        details[action.taskId] = { ...detail, journalEntrySubmitted: true };
      }
      return { ...state, details };
    }

    case 'ADD_COMMENT': {
      const tasks = state.tasks.map(t =>
        t.id === action.taskId ? { ...t, comments: (t.comments ?? 0) + 1 } : t
      );
      const details = { ...state.details };
      const detail = details[action.taskId];
      if (detail && detail.reviewNotes) {
        details[action.taskId] = {
          ...detail,
          reviewNotes: [
            ...detail.reviewNotes,
            {
              id: String(detail.reviewNotes.length + 1),
              author: action.author,
              initials: action.initials,
              time: 'Just now',
              message: action.message,
            },
          ],
        };
      }
      return { ...state, tasks, details };
    }

    case 'SET_WORKFLOW_STAGE': {
      const details = { ...state.details };
      const detail = details[action.taskId];
      if (detail) {
        const stageIndex = detail.workflowStages.findIndex(s => s.id === action.stageId);
        if (stageIndex >= 0) {
          details[action.taskId] = {
            ...detail,
            currentStage: action.stageId,
            workflowStages: detail.workflowStages.map((s, i) => ({
              ...s,
              status: i < stageIndex ? 'complete' as const
                : i === stageIndex ? 'current' as const
                : 'pending' as const,
            })),
          };
        }
      }
      return { ...state, details };
    }

    case 'ADD_DEPENDENCY': {
      const tasks = state.tasks.map(t => {
        if (t.id !== action.taskId) return t;
        const deps = t.dependencies ?? [];
        if (deps.includes(action.dependsOn)) return t;
        return { ...t, dependencies: [...deps, action.dependsOn] };
      });
      return { ...state, tasks };
    }

    case 'REMOVE_DEPENDENCY': {
      const tasks = state.tasks.map(t => {
        if (t.id !== action.taskId) return t;
        return { ...t, dependencies: (t.dependencies ?? []).filter(d => d !== action.dependsOn) };
      });
      return { ...state, tasks };
    }

    case 'RESET':
      return buildInitialState();

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────

interface TaskStoreContext {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  isLoading: boolean;
  // Convenience selectors
  getTask: (id: number) => Task | undefined;
  getTaskDetail: (id: number) => TaskDetail | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  // Dependency selectors
  dependencyGraph: DependencyGraph;
}

const TaskStoreCtx = createContext<TaskStoreContext | null>(null);

// ── Provider ─────────────────────────────────────────────────────

interface TaskStoreProviderProps {
  children: ReactNode;
  simulatedDelay?: number; // ms — artificial loading delay (default 600)
}

export function TaskStoreProvider({ children, simulatedDelay = 600 }: TaskStoreProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, buildInitialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), simulatedDelay);
    return () => clearTimeout(timer);
  }, [simulatedDelay]);

  const getTask = useCallback(
    (id: number) => state.tasks.find(t => t.id === id),
    [state.tasks]
  );

  const getTaskDetail = useCallback(
    (id: number) => state.details[id],
    [state.details]
  );

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => state.tasks.filter(t => t.status === status),
    [state.tasks]
  );

  const dependencyGraph = useMemo((): DependencyGraph => {
    const edges: DependencyEdge[] = [];
    for (const task of state.tasks) {
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          edges.push({ from: depId, to: task.id });
        }
      }
    }

    const getBlockers = (taskId: number): Task[] => {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task?.dependencies?.length) return [];
      return task.dependencies
        .map(depId => state.tasks.find(t => t.id === depId))
        .filter((t): t is Task => t !== undefined);
    };

    const getBlocked = (taskId: number): Task[] => {
      return state.tasks.filter(t => t.dependencies?.includes(taskId));
    };

    const isBlocked = (taskId: number): boolean => {
      const blockers = getBlockers(taskId);
      return blockers.length > 0 && blockers.some(b => b.status !== 'Complete');
    };

    return { edges, getBlockers, getBlocked, isBlocked };
  }, [state.tasks]);

  return (
    <TaskStoreCtx.Provider value={{ state, dispatch, isLoading, getTask, getTaskDetail, getTasksByStatus, dependencyGraph }}>
      {children}
    </TaskStoreCtx.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useTaskStore() {
  const ctx = useContext(TaskStoreCtx);
  if (!ctx) throw new Error('useTaskStore must be used within TaskStoreProvider');
  return ctx;
}

import { DrilldownTemplate } from './DrilldownTemplate';
import { TaskDetailPage } from './task-detail';
import { useTaskStore } from '@/runtime/TaskStore';
import { DetailSkeleton } from './tasks/TaskSkeletons';

interface TaskDrilldownProps {
  taskId: number;
  onBack: () => void;
}

export function TaskDrilldown({ taskId, onBack }: TaskDrilldownProps) {
  const { getTaskDetail, isLoading } = useTaskStore();

  if (isLoading) {
    return <DetailSkeleton />;
  }

  const detail = getTaskDetail(taskId);

  // Use config-driven detail page when a detail config exists
  if (detail) {
    return <TaskDetailPage taskId={taskId} onBack={onBack} entrySource="tasks" />;
  }

  // Fallback to legacy hardcoded drilldown
  return <DrilldownTemplate onBack={onBack} />;
}

import type { Task } from '@/types';
import { tasks, isTaskOverdue } from '@/data/tasks';

export async function getTasks(): Promise<Task[]> {
  return tasks;
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  return tasks.find(t => t.id === id);
}

export async function checkTaskOverdue(task: Task): Promise<boolean> {
  return isTaskOverdue(task.dueDate);
}

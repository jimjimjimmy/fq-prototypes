import type { Task } from '@/types';
import { parseTaskDate } from '@/data/tasks';

export function getTaskDateRange(task: Task): { start: Date; end: Date } {
  const end = parseTaskDate(task.dueDate);
  const start = task.startDate ? parseTaskDate(task.startDate) : end;
  return { start, end };
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = stripTime(date).getTime();
  return d >= stripTime(start).getTime() && d <= stripTime(end).getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getWeekRows(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const rows: Date[][] = [];
  const current = new Date(startDate);

  while (current <= lastDay || rows.length === 0 || rows[rows.length - 1].length < 7) {
    if (rows.length === 0 || rows[rows.length - 1].length === 7) {
      if (rows.length > 0 && current > lastDay) break;
      rows.push([]);
    }
    rows[rows.length - 1].push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Ensure all rows have 7 days
  while (rows[rows.length - 1].length < 7) {
    rows[rows.length - 1].push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return rows;
}

export function getTaskSpanForWeek(
  task: Task,
  weekStart: Date,
  weekEnd: Date,
): { startCol: number; endCol: number } | null {
  const { start, end } = getTaskDateRange(task);
  const ws = stripTime(weekStart).getTime();
  const we = stripTime(weekEnd).getTime();
  const ts = stripTime(start).getTime();
  const te = stripTime(end).getTime();

  if (te < ws || ts > we) return null;

  const clampedStart = Math.max(ts, ws);
  const clampedEnd = Math.min(te, we);

  const startCol = Math.round((clampedStart - ws) / (1000 * 60 * 60 * 24));
  const endCol = Math.round((clampedEnd - ws) / (1000 * 60 * 60 * 24));

  return { startCol: startCol + 1, endCol: endCol + 2 }; // CSS grid is 1-indexed, end is exclusive
}

export interface LaneAssignment {
  task: Task;
  lane: number;
  startCol: number;
  endCol: number;
  clippedStart: boolean;
  clippedEnd: boolean;
}

export function packTasksIntoLanes(
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date,
): LaneAssignment[] {
  const assignments: LaneAssignment[] = [];
  const lanes: number[][] = []; // Each lane tracks occupied columns

  // Sort tasks by start date, then by duration (longer first)
  const sortedTasks = [...tasks]
    .map(task => ({ task, span: getTaskSpanForWeek(task, weekStart, weekEnd) }))
    .filter((t): t is { task: Task; span: { startCol: number; endCol: number } } => t.span !== null)
    .sort((a, b) => {
      if (a.span.startCol !== b.span.startCol) return a.span.startCol - b.span.startCol;
      return (b.span.endCol - b.span.startCol) - (a.span.endCol - a.span.startCol);
    });

  for (const { task, span } of sortedTasks) {
    const { start, end } = getTaskDateRange(task);
    const ws = stripTime(weekStart).getTime();
    const we = stripTime(weekEnd).getTime();
    const ts = stripTime(start).getTime();
    const te = stripTime(end).getTime();

    let assignedLane = -1;
    for (let i = 0; i < lanes.length; i++) {
      const occupied = lanes[i];
      const conflicts = occupied.some(col => col >= span.startCol && col < span.endCol);
      if (!conflicts) {
        assignedLane = i;
        break;
      }
    }
    if (assignedLane === -1) {
      assignedLane = lanes.length;
      lanes.push([]);
    }
    for (let c = span.startCol; c < span.endCol; c++) {
      lanes[assignedLane].push(c);
    }

    assignments.push({
      task,
      lane: assignedLane,
      startCol: span.startCol,
      endCol: span.endCol,
      clippedStart: ts < ws,
      clippedEnd: te > we,
    });
  }

  return assignments;
}

export interface InsightCard {
  title: string;
  body: string;
  taskId?: number; // Links card to a task — auto-dismiss when task is completed
  agentBadge?: string; // e.g. "Prepared by Intercompany Agent"
}

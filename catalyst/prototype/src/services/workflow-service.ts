import type { WorkflowRow } from '@/types';
import { workflowData } from '@/data/workflows';

export async function getWorkflows(): Promise<WorkflowRow[]> {
  return workflowData;
}

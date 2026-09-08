import FlowStatusBadge from '@floqastinc/flow-ui_core/StatusBadge';
import type { Anomaly } from '../types';

export default function StatusBadge({ status }: { status: Anomaly['status'] }) {
  const colorMap: Record<Anomaly['status'], 'danger' | 'info' | 'success'> = {
    Open: 'danger',
    Investigating: 'info',
    Resolved: 'success',
    Deleted: 'danger',
    Dismissed: 'info',
  };

  return (
    <FlowStatusBadge color={colorMap[status]} size="sm">
      {status}
    </FlowStatusBadge>
  );
}

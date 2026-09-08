/**
 * StatusBadge — canonical model-status pill for Data Studio.
 *
 * Wraps FlowUI's `TableStatusBadge` (the filled-background variant the
 * scaffold PageHeader already uses) so Catalog cells, the Model View header,
 * Versions, and Dimensions all render status identically.
 *
 * Status → tone mapping (Catalog Search & Filter PRD, three-state model):
 *   active → success (green) · draft → warning (yellow) · archived → default (grey)
 */

import { TableStatusBadge } from '@floqastinc/flow-ui_core';
import type { ModelStatus } from '../../data/models';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'highlight';

/** Single source of truth for status label + tone, reused by the L2 header. */
export const STATUS_META: Record<ModelStatus, { label: string; tone: Tone }> = {
  active: { label: 'Active', tone: 'success' },
  draft: { label: 'Draft', tone: 'warning' },
  archived: { label: 'Archived', tone: 'default' },
};

export function StatusBadge({ status }: { status: ModelStatus }) {
  const meta = STATUS_META[status];
  return (
    <TableStatusBadge color={meta.tone} size="default" hasIcon={false}>
      {meta.label}
    </TableStatusBadge>
  );
}

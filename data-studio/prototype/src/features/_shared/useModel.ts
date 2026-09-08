/**
 * useModel — resolve a model id to its record + display-ready fields.
 *
 * Wraps the existing `getModelById` lookup so Model View sections stop
 * hardcoding name/status/lastUpdated. Falls back gracefully for unknown ids
 * (the prototype routes to arbitrary `:modelId` values).
 */

import { getModelById, type Model, type ModelStatus } from '../../data/models';
import { STATUS_META } from './StatusBadge';
import { formatLastUpdated } from './format';

export interface UseModelResult {
  /** The resolved model, or undefined if the id isn't in the mock data. */
  model: Model | undefined;
  /** Title for breadcrumb + page header. Falls back to a readable stub. */
  displayName: string;
  /** Status for the L2 header badge, or undefined when unknown. */
  status: ModelStatus | undefined;
  /** Pre-mapped { label, tone } for the L2Frame `status` prop. */
  statusBadge: (typeof STATUS_META)[ModelStatus] | undefined;
  /** Last-updated string for the L2 header. */
  lastUpdated: string | undefined;
}

export function useModel(modelId: string | undefined): UseModelResult {
  const model = modelId ? getModelById(modelId) : undefined;
  return {
    model,
    displayName: model?.name ?? (modelId ? `Model ${modelId}` : 'Untitled Model'),
    status: model?.status,
    statusBadge: model ? STATUS_META[model.status] : undefined,
    lastUpdated: model ? formatLastUpdated(model.lastUpdated) : undefined,
  };
}

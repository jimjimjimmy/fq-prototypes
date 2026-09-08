/**
 * Model View L2 sidebar items.
 *
 * Shared across every model-view section route so the sidebar is
 * consistent and the order is canonical.
 *
 * CANONICAL SET (designer decision, Natasha Clark, 2026-07-02): the six
 * items below — matches the Data Studio Scaffold Figma (frame 1:21710).
 * The "Data Studio — For Dev" file (frame 401:65326) intentionally DIVERGES:
 * it shows 7 items with an extra "Entity Mappings" tab and plural
 * "Field Mappings". That divergence is known and NOT to be applied here —
 * Entity Mappings has open IA questions (see features/entity-mapping,
 * pending IA) and the label is singular "Field Mapping". Do not "fix" this
 * list to match the For-Dev file.
 *
 * Feature owners adding a new section: append here AND create a matching
 * routes.tsx + folder under model-view/. Anything in the sidebar but not
 * registered as a route will result in a click-through to nowhere.
 */

import type { L2SidebarItem } from '../../scaffold/data-studio';

export const MODEL_VIEW_SECTIONS: L2SidebarItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'source-datasets', label: 'Source Datasets' },
  { id: 'field-mapping', label: 'Field Mapping' },
  { id: 'data-preview', label: 'Data Preview' },
  { id: 'versions', label: 'Versions' },
  { id: 'logs', label: 'Logs' },
];

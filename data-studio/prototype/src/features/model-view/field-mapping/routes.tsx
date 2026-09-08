/**
 * Field Mapping — model-view L2 route.
 *
 * Renders the ported v1 `FieldMappingView` (AG Grid + manual
 * transformation editor) inside the locked v2 `L2Frame` scaffold.
 *
 * **AI surfaces are intentionally NOT rendered right now.** The
 * `AiModeProvider`, `DevToolbar`, `AiBanner`, `DirectedTransformationDropdown`,
 * and `ConversationalAiPanel` components remain in the repo for future
 * re-enablement but are not wired into any active rendering path. To
 * resume AI work later: wrap this route in `<AiModeProvider>`, render
 * `<DevToolbar>` alongside `<L2Frame>`, and restore the AI rendering
 * blocks in FieldMappingView.tsx + TransformationWindow.tsx.
 *
 * Known visual follow-up (not addressed in the port):
 *   FieldMappingView has its own inline page header (title + Run Test /
 *   Publish / search). It visually duplicates L2Frame's section header.
 *   Cleanup options for a future polish branch:
 *     (a) refactor FieldMappingView to drop its inline header and pass
 *         action buttons via a new L2Frame `sectionRightSlot` prop
 *         (scaffold change — requires designer review)
 *     (b) refactor FieldMappingView to drop both header and title
 *         (feature-only change)
 */

import { Route, useNavigate, useParams } from 'react-router-dom';
import { L2Frame } from '../../../scaffold/data-studio';
import { MODEL_VIEW_SECTIONS } from '../sections';
import FieldMappingView from './FieldMappingView';

function FieldMappingPage() {
  const navigate = useNavigate();
  const { modelId } = useParams<{ modelId: string }>();
  const displayName = modelId ? `Model ${modelId}` : 'Untitled Model';

  return (
    <L2Frame
      breadcrumb={[
        { label: 'Catalog', href: '/data-studio/catalog' },
        { label: displayName },
      ]}
      breadcrumbHasDropdown
      onBreadcrumbDropdown={() => {
        // Real model-switcher dropdown lands when the catalog feature
        // is built out. For now, the chevron is visible but click is a no-op.
      }}
      title={displayName}
      status={{ label: 'Active', tone: 'success' }}
      lastUpdated="Mar 22, 2026"
      sidebarItems={MODEL_VIEW_SECTIONS}
      activeSectionId="field-mapping"
      onSectionChange={(id) => navigate(`/data-studio/model/${modelId}/${id}`)}
      sectionTitle="Field Mapping"
    >
      <FieldMappingView />
    </L2Frame>
  );
}

export const fieldMappingRoutes = (
  <Route
    key="mv-field-mapping"
    path="model/:modelId/field-mapping"
    element={<FieldMappingPage />}
  />
);

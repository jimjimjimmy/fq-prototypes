/**
 * ModelStubLayout — shared L2Frame wrapper for model-view section stubs.
 *
 * Centralizes the L2Frame prop wiring (breadcrumb, status, sidebarItems,
 * navigation, etc.) so each section's routes.tsx only needs to pass
 * `activeSectionId`, `sectionTitle`, and `children`.
 *
 * Model identity (name, status, last-updated) now comes from the real mock
 * data via `useModel(modelId)` — the hardcoded placeholders are retired. Falls
 * back to a readable stub name for ids not present in the mock data.
 */

import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { L2Frame } from '../../scaffold/data-studio';
import { MODEL_VIEW_SECTIONS } from './sections';
import { useModel } from '../_shared/useModel';

interface ModelStubLayoutProps {
  activeSectionId: string;
  sectionTitle: string;
  children: ReactNode;
}

export function ModelStubLayout({ activeSectionId, sectionTitle, children }: ModelStubLayoutProps) {
  const navigate = useNavigate();
  const { modelId } = useParams<{ modelId: string }>();
  const { displayName, statusBadge, lastUpdated } = useModel(modelId);

  return (
    <L2Frame
      breadcrumb={[
        { label: 'Catalog', href: '/data-studio/catalog' },
        { label: displayName },
      ]}
      breadcrumbHasDropdown
      onBreadcrumbDropdown={() => {
        // Real model-switcher dropdown lands when the catalog feature is built
        // out (Step 7+). For now, the chevron is visible but click is a no-op.
      }}
      title={displayName}
      status={statusBadge}
      lastUpdated={lastUpdated}
      sidebarItems={MODEL_VIEW_SECTIONS}
      activeSectionId={activeSectionId}
      onSectionChange={(id) => navigate(`/data-studio/model/${modelId}/${id}`)}
      sectionTitle={sectionTitle}
    >
      {children}
    </L2Frame>
  );
}

/**
 * L2Frame — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * Composition wrapper for detail routes (model/connector/dimension view).
 * Owns two local UI states: sidebar collapsed and fullscreen. Both are
 * pure-UI state with no cross-feature implications, so they live here as
 * useState rather than in a context or routing layer.
 *
 * Stacks (default — not fullscreen):
 *
 *   GlobalRail | AdminSettingsNav (with fullscreen toggle)
 *              | PageHeader (breadcrumb + title + status + lastUpdated)
 *              | L2Sidebar | Section title + content
 *
 * Fullscreen mode strips everything except the section title and content,
 * matching Figma frame 1:21849. An "Exit fullscreen" button replaces the
 * fullscreen-enter button, and Esc key also exits.
 *
 * Figma sources:
 *   Sidebar open      → 1:21710
 *   Sidebar collapsed → 1:21766
 *   Fullscreen mode   → 1:21849
 *
 * Feature usage example (in src/features/model-view/overview/OverviewPage.tsx):
 *
 *   const sectionItems = [
 *     { id: 'overview', label: 'Overview' },
 *     { id: 'source-datasets', label: 'Source Datasets' },
 *     ...
 *   ];
 *
 *   <L2Frame
 *     breadcrumb={[{ label: 'Catalog', href: '/data-studio/catalog' }, { label: 'US Accounts' }]}
 *     title="US Accounts"
 *     status={{ label: 'Active', tone: 'success' }}
 *     lastUpdated="Mar 22, 2026"
 *     sidebarItems={sectionItems}
 *     activeSectionId="overview"
 *     onSectionChange={(id) => navigate(`/data-studio/model/${modelId}/${id}`)}
 *     sectionTitle="Overview"
 *   >
 *     <OverviewContent ... />
 *   </L2Frame>
 */

import { useEffect, useState, type ReactNode } from 'react';
import { GlobalRail } from '../global/GlobalRail';
import { AdminSettingsNav } from '../global/AdminSettingsNav';
import { PageHeader, type PageHeaderBreadcrumbItem, type PageHeaderStatus } from './PageHeader';
import { L2Sidebar, type L2SidebarItem } from './L2Sidebar';

export interface L2FrameProps {
  /** Breadcrumb shown above the page title. */
  breadcrumb: PageHeaderBreadcrumbItem[];
  /** The H1 (model/connector/dimension name). */
  title: string;
  /** Optional status badge under the title. */
  status?: PageHeaderStatus;
  /** Optional last-updated date string. */
  lastUpdated?: string;
  /** Whether the breadcrumb's final item has a dropdown chevron (e.g. for switching models). */
  breadcrumbHasDropdown?: boolean;
  onBreadcrumbDropdown?: () => void;

  /** The L2 sidebar items (configurable per view type — model has 6, connector might have different). */
  sidebarItems: L2SidebarItem[];
  /** Currently active section id. */
  activeSectionId: string;
  /** Fires when the user clicks a different sidebar section. */
  onSectionChange: (id: string) => void;

  /** The title shown at the top of the section content area. */
  sectionTitle: string;
  /** Section content. */
  children: ReactNode;
}

export function L2Frame({
  breadcrumb,
  title,
  status,
  lastUpdated,
  breadcrumbHasDropdown,
  onBreadcrumbDropdown,
  sidebarItems,
  activeSectionId,
  onSectionChange,
  sectionTitle,
  children,
}: L2FrameProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Esc key exits fullscreen.
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);

  if (fullscreen) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <SectionHeader
          title={sectionTitle}
          rightSlot={
            <button
              onClick={() => setFullscreen(false)}
              aria-label="Exit fullscreen"
              className="flex items-center justify-center w-[26px] h-[26px] border border-[var(--flo-sem-color-stroke-forms)] rounded-[6px] hover:bg-[var(--flo-sem-color-light-background)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--flo-sem-color-icon-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          }
        />
        <div className="flex-1 overflow-auto px-6 py-6 bg-white">
          <div className="bg-white h-full flex flex-col">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <GlobalRail />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminSettingsNav onFullscreen={() => setFullscreen(true)} />

        <PageHeader
          title={title}
          breadcrumb={breadcrumb}
          status={status}
          lastUpdated={lastUpdated}
          breadcrumbHasDropdown={breadcrumbHasDropdown}
          onBreadcrumbDropdown={onBreadcrumbDropdown}
        />

        <div className="flex flex-1 overflow-hidden">
          <L2Sidebar
            items={sidebarItems}
            activeId={activeSectionId}
            onItemChange={onSectionChange}
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <SectionHeader title={sectionTitle} />
            <div className="flex-1 overflow-auto px-6 py-6 bg-white">
              {/* Section content sits directly on white (matches "For Dev" Figma). */}
              <div className="bg-white h-full flex flex-col">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Internal — section title row that sits above the section content.
 * Heading H3 per Figma (20px / lineHeight 26 / Museo Sans / weight 600).
 * Used by both the default L2 layout (right pane) and the fullscreen layout.
 * No border-b — section header sits flush with the content panel below.
 */
function SectionHeader({ title, rightSlot }: { title: string; rightSlot?: ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-4 px-6 bg-white shrink-0">
      <h2
        className="m-0 text-black"
        style={{ fontSize: 20, lineHeight: '26px', fontWeight: 600 }}
      >
        {title}
      </h2>
      {rightSlot}
    </div>
  );
}

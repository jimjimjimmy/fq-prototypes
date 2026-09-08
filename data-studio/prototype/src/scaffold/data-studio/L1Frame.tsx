/**
 * L1Frame — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * Composition wrapper for top-level Data Studio routes (Catalog, Dimensions,
 * Connectors, Logs). Stacks:
 *
 *   GlobalRail (56px) | AdminSettingsNav (60px)
 *                     | PageHeader "Data Studio" (title only)
 *                     | L1 tab strip + right-aligned action slot
 *                     | Content area
 *
 * Figma source: 1:14460 "Data Studio L1 Shell" in
 *   https://www.figma.com/design/JuKJL3qnOlL88CFBje5cBr/Data-Studio-Scaffold--Claude-
 *
 * Feature usage example (in src/features/catalog/CatalogPage.tsx):
 *
 *   <L1Frame
 *     activeTab="catalog"
 *     onTabChange={(t) => navigate(`/data-studio/${t}`)}
 *     rightSlot={
 *       <>
 *         <SearchField placeholder="Search by model name or type..." />
 *         <Button color="primary" variant="filled">Create Model</Button>
 *       </>
 *     }
 *   >
 *     <CatalogTable models={...} />
 *   </L1Frame>
 */

import type { ReactNode } from 'react';
import { GlobalRail } from '../global/GlobalRail';
import { AdminSettingsNav } from '../global/AdminSettingsNav';
import { PageHeader } from './PageHeader';
import { L1Tabs, type L1TabId } from './L1Tabs';

export interface L1FrameProps {
  /** Which L1 tab is active. */
  activeTab: L1TabId;
  /** Fires when the user clicks a different L1 tab. Should navigate. */
  onTabChange: (tab: L1TabId) => void;
  /**
   * Optional right-aligned content (e.g. search field + primary action
   * button). Sits on the same row as the L1 tabs.
   */
  rightSlot?: ReactNode;
  /** The route content. */
  children: ReactNode;
}

export function L1Frame({ activeTab, onTabChange, rightSlot, children }: L1FrameProps) {
  return (
    <div className="flex h-screen">
      <GlobalRail />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminSettingsNav />

        <PageHeader title="Data Studio" />

        <div className="relative flex border-b border-[var(--flo-sem-color-border)] bg-white px-6 pt-3 shrink-0">
          {/*
            Mixed alignment via positioning:
            - Tabs in normal flow with pt-3 (12px breathing room from the
              page header above). Their bottom edge naturally meets the
              bar's bottom border (no pb on parent) so the active tab's
              underline sits flush with the border.
            - Right slot is absolutely positioned and vertically centered
              relative to the bar's full height (top-1/2 -translate-y-1/2),
              which is impossible to achieve with flexbox alone when the
              parent has asymmetric pt-3 (align-self: center would only
              center within the post-padding content area).
          */}
          <L1Tabs activeTab={activeTab} onTabChange={onTabChange} />
          {rightSlot && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {rightSlot}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto bg-white p-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * PageHeader — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * Supports two modes via props:
 *
 *   L1 mode (top-level routes like Catalog/Dimensions/Connectors/Logs):
 *     <PageHeader title="Data Studio" />
 *
 *   L2 mode (detail routes like model/connector/dimension view):
 *     <PageHeader
 *       breadcrumb={[
 *         { label: 'Catalog', href: '/data-studio/catalog' },     // ← link
 *         { label: 'US Accounts' },                                // ← current
 *       ]}
 *       breadcrumbHasDropdown                                      // ← chevron next to current
 *       onBreadcrumbDropdown={() => openModelSwitcher()}
 *       title="US Accounts"
 *       status={{ label: 'Active', tone: 'success' }}
 *       lastUpdated="Mar 22, 2026"
 *     />
 *
 * Uses FlowUI components for everything visible:
 *   - `<Breadcrumbs><Breadcrumbs.Item>` for breadcrumb. Items with `href`
 *     render as React Router `<Link>` (no page reload). FlowUI handles
 *     link typography + chevron separators.
 *   - `<TableStatusBadge color>` for status. Filled-background variant
 *     matching Figma — not the dot-only `<StatusBadge>` we used before.
 *
 * Typography (per Figma variables on node 1:21732):
 *   - Title: Heading H2 — 24px / lineHeight 32 / Museo Sans / weight 600
 *   - Last Updated: Label SM Regular — 11px / lineHeight 16 / Inter
 */

import { Breadcrumbs, TableStatusBadge } from '@floqastinc/flow-ui_core';
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderBreadcrumbItem {
  label: string;
  /**
   * When provided, the breadcrumb item renders as a React Router `<Link>`
   * — clicking navigates without a full page reload. Style is FlowUI's
   * standard breadcrumb link.
   */
  href?: string;
  /**
   * Fallback callback if no `href` is provided. Useful for breadcrumb
   * items that trigger non-navigation actions.
   */
  onClick?: () => void;
}

export interface PageHeaderStatus {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'highlight';
}

export interface PageHeaderProps {
  /** Required. The H1 of the page. */
  title: string;
  /** Optional breadcrumb. When provided, shown above the title (L2 mode). */
  breadcrumb?: PageHeaderBreadcrumbItem[];
  /** Optional status badge shown below the title (L2 mode). */
  status?: PageHeaderStatus;
  /** Optional "Last Updated" date string shown next to the status badge. */
  lastUpdated?: string;
  /**
   * When true, an `ExpandMore` chevron button renders next to the last
   * breadcrumb item — useful for "switch model" / "switch connector"
   * dropdowns. The feature passes `onBreadcrumbDropdown` to handle the click.
   */
  breadcrumbHasDropdown?: boolean;
  onBreadcrumbDropdown?: () => void;
}

export function PageHeader({
  title,
  breadcrumb,
  status,
  lastUpdated,
  breadcrumbHasDropdown,
  onBreadcrumbDropdown,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const hasBreadcrumb = breadcrumb && breadcrumb.length > 0;
  const isL2 = hasBreadcrumb || status || lastUpdated;

  // FlowUI Breadcrumbs uses value/selected to determine which item is the
  // current page (styled as plain text) vs which are clickable links. The
  // last item is treated as current; others get link styling + hover.
  // onSelectionChange fires when a non-current item is clicked — we either
  // navigate (if the crumb has an href) or fire its onClick callback.
  const currentValue = breadcrumb && breadcrumb.length > 0 ? `crumb-${breadcrumb.length - 1}` : '';

  return (
    <div
      className={`bg-white flex flex-col items-start px-6 w-full shrink-0 border-b border-[var(--flo-sem-color-border)] ${
        isL2 ? 'py-4 gap-2' : 'pt-6 pb-4'
      }`}
    >
      {/* Breadcrumb (L2 only) */}
      {hasBreadcrumb && (
        <div className="flex items-center gap-1">
          <Breadcrumbs
            selected={currentValue}
            onSelectionChange={(value: string) => {
              const idx = Number(value.replace('crumb-', ''));
              const crumb = breadcrumb[idx];
              if (!crumb) return;
              if (crumb.href) {
                navigate(crumb.href);
              } else if (crumb.onClick) {
                crumb.onClick();
              }
            }}
          >
            {breadcrumb.map((crumb, idx) => (
              <Breadcrumbs.Item key={idx} value={`crumb-${idx}`}>
                {crumb.label}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
          {breadcrumbHasDropdown && (
            <button
              type="button"
              onClick={onBreadcrumbDropdown}
              aria-label="Switch"
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-[var(--flo-sem-color-background-option-hover)] transition-colors"
            >
              <ExpandMore size={16} color="var(--flo-sem-color-icon-primary, #424867)" />
            </button>
          )}
        </div>
      )}

      {/* Title + optional status row */}
      <div className="flex flex-col gap-1 items-start">
        <h1
          className="m-0 text-black"
          style={{ fontSize: 24, lineHeight: '32px', fontWeight: 600 }}
        >
          {title}
        </h1>
        {(status || lastUpdated) && (
          <div className="flex items-center gap-2">
            {status && (
              <TableStatusBadge color={status.tone ?? 'success'} size="default" hasIcon={false}>
                {status.label}
              </TableStatusBadge>
            )}
            {lastUpdated && (
              <span
                className="text-[var(--flo-sem-color-text-body-secondary)]"
                style={{ fontSize: 11, lineHeight: '16px', fontWeight: 400 }}
              >
                Last Updated {lastUpdated}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

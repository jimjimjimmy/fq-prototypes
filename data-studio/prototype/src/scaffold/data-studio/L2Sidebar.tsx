/**
 * L2Sidebar — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * The collapsible vertical sidebar inside model/connector/dimension detail
 * views. Thin wrapper around FlowUI's `<Sidebar>` primitive so we get
 * canonical FloQast styling (active-state visuals, collapse toggle,
 * typography) automatically.
 *
 * Figma sources:
 *   Sidebar open      → 1:21710 (Code Connect: Sidebar from flow-ui_core)
 *   Sidebar collapsed → 1:21766
 *
 * Earlier in this rebuild (Step 2c) we built this custom from primitives
 * because of an incorrect read of the Figma frames — see the
 * DEVIATION-LOG.md entry from 2026-05-22 (resolved 2026-05-22).
 *
 * Behavior:
 *   - Accepts the same props as before so L2Frame doesn't need to change.
 *   - FlowUI's Sidebar handles collapse toggle internally — we just pass
 *     `collapsed` + `onCollapseChange` and it renders the chevron itself.
 *   - Active-state styling is FlowUI's standard sidebar pattern (no need
 *     for the gray-fill custom treatment we had before).
 */

import { Sidebar } from '@floqastinc/flow-ui_core';

export interface L2SidebarItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface L2SidebarProps {
  items: L2SidebarItem[];
  activeId: string;
  onItemChange: (id: string) => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}

export function L2Sidebar({
  items,
  activeId,
  onItemChange,
  collapsed,
  onCollapseToggle,
}: L2SidebarProps) {
  return (
    <Sidebar collapsed={collapsed} onCollapseChange={onCollapseToggle}>
      <Sidebar.Menu>
        {items.map((item) => (
          <Sidebar.Item
            key={item.id}
            value={item.id}
            isActive={item.id === activeId}
            isDisabled={item.disabled}
            onChange={() => {
              if (!item.disabled) onItemChange(item.id);
            }}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Menu>
    </Sidebar>
  );
}

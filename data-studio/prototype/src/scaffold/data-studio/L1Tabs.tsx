/**
 * L1Tabs — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * The top-level Data Studio tab strip: Catalog / Dimensions / Connectors / Logs.
 * Thin wrapper around the FlowUI TabGroup primitive (already Code Connect–
 * mapped at the FlowUI library level).
 *
 * Figma source: 1:14468 "Tab / Tab-group" in the L1 shell, mapped to FlowUI
 * TabGroup via Code Connect.
 *
 * The tabs are driven by URL — `activeTab` is read from the route and
 * `onTabChange` should `navigate()` to the new path. L1Frame wires this up.
 *
 * The strip itself is just the tabs — the L1Frame composes it alongside any
 * right-aligned action content (search field + primary button on Catalog,
 * for example) in a flex row.
 */

import { TabGroup, Tab } from '@floqastinc/flow-ui_core';

export type L1TabId = 'catalog' | 'dimensions' | 'connectors' | 'logs';

const TABS: { id: L1TabId; label: string }[] = [
  { id: 'catalog', label: 'Catalog' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'connectors', label: 'Connectors' },
  { id: 'logs', label: 'Logs' },
];

export interface L1TabsProps {
  activeTab: L1TabId;
  onTabChange: (tab: L1TabId) => void;
}

export function L1Tabs({ activeTab, onTabChange }: L1TabsProps) {
  return (
    <TabGroup
      value={activeTab}
      onValueChange={(value: string) => onTabChange(value as L1TabId)}
    >
      {TABS.map((tab) => (
        <Tab key={tab.id} tabId={tab.id} title={tab.label}>
          {/* Tab content is rendered outside the TabGroup by the feature route,
              not inside each Tab — this avoids re-rendering feature content on
              every tab click. The Tab component just renders the tab pill. */}
          <></>
        </Tab>
      ))}
    </TabGroup>
  );
}

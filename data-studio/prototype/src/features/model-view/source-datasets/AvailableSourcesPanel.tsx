/**
 * AvailableSourcesPanel — left panel of the Source Datasets tab.
 *
 * Matched to the "Data Studio — For Dev" Figma (Empty 738:20280, Adding
 * 3053:49054 → panel node 738:20605): a searchable, connector-bucketed list of
 * the datasets a model can draw from. Each dataset is a bordered card with a
 * "+" that flips to a muted "Added" indicator once selected.
 *
 * For-Dev fidelity notes: connectors are shown EXPANDED (no per-connector
 * count), separated by dividers; the "+" is a bare icon affordance (not a
 * button). Presentational — selection state is owned by SourceDatasetsContent.
 */

import { useMemo, useState } from 'react';
import { Heading, Input } from '@floqastinc/flow-ui_core';
import Search from '@floqastinc/flow-ui_icons/material/Search';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Check from '@floqastinc/flow-ui_icons/material/Check';
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore';
import { availableSourceGroups } from '../../../data/sources';

interface AvailableSourcesPanelProps {
  /** Ids of sources already added to the model (rendered as "Added"). */
  selectedIds: Set<string>;
  /** Add a source to the model's Selected Datasets. */
  onAdd: (sourceId: string) => void;
}

export function AvailableSourcesPanel({ selectedIds, onAdd }: AvailableSourcesPanelProps) {
  const [search, setSearch] = useState('');
  // Connectors are expanded by default (matches For-Dev); track collapses only.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // FlowUI Input's onChange may hand back the raw value or an event — handle both.
  const handleSearchChange = (v: unknown) => {
    if (typeof v === 'string') setSearch(v);
    else setSearch((v as { target?: { value?: string } })?.target?.value ?? '');
  };

  const query = search.trim().toLowerCase();
  const searching = query.length > 0;

  const groups = useMemo(() => {
    if (!searching) return availableSourceGroups;
    return availableSourceGroups
      .map((g) => ({ ...g, sources: g.sources.filter((s) => s.name.toLowerCase().includes(query)) }))
      .filter((g) => g.sources.length > 0);
  }, [query, searching]);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-md border border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-white)]"
      data-figma-node="738:20605"
    >
      {/* Header */}
      <div
        className="border-b border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-light-background)] px-4 py-[18px]"
        data-figma-node="738:20606"
      >
        <Heading variant="h5" weight="semibold" data-figma-node="738:20607">
          Available Sources
        </Heading>
      </div>

      <div className="flex max-h-[620px] flex-col gap-4 overflow-y-auto p-4">
        {/* Search */}
        <Input type="search" placeholder="Search datasets" value={search} onChange={handleSearchChange}>
          <Input.LeftItem>
            <Search size={20} color="var(--flo-sem-color-icon-primary, #6b7280)" />
          </Input.LeftItem>
        </Input>

        {groups.length === 0 ? (
          <p className="m-0 py-6 text-center text-[13px] text-[var(--flo-sem-color-content-neutral-medium)]">
            No datasets match “{search}”.
          </p>
        ) : (
          groups.map((group, i) => {
            const isOpen = searching || !collapsed[group.connector];
            return (
              <div key={group.connector} className="flex flex-col gap-4">
                {i > 0 && <div className="h-px w-full bg-[var(--flo-sem-color-border)]" />}

                {/* Connector header */}
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((prev) => ({ ...prev, [group.connector]: !prev[group.connector] }))
                  }
                  className="flex w-full items-center gap-2 text-left [font-family:inherit]"
                >
                  <ExpandMore
                    size={20}
                    color="var(--flo-sem-color-icon-tertiary, #6b7280)"
                    style={{ transform: isOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 120ms' }}
                  />
                  <span className="text-[14px] font-medium leading-[20px] text-[var(--flo-sem-color-text-body)]">
                    {group.connector}
                  </span>
                  <span className="text-[12px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]">
                    · {group.transport}
                  </span>
                </button>

                {/* Dataset cards */}
                {isOpen && (
                  <div className="flex flex-col gap-3">
                    {group.sources.map((source) => {
                      const added = selectedIds.has(source.id);
                      return (
                        <div
                          key={source.id}
                          className="flex items-center gap-3 rounded border border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-white)] px-3 py-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="m-0 truncate text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-text-body)]">
                              {source.name}
                            </p>
                            <p className="m-0 truncate text-[10px] leading-[14px] text-[var(--flo-sem-color-content-neutral-medium)]">
                              {source.category}
                            </p>
                          </div>
                          {added ? (
                            <span className="inline-flex flex-shrink-0 items-center gap-1 text-[11px] leading-[16px] text-[var(--flo-sem-color-border-strong,#adb2bb)]">
                              <Check size={16} color="var(--flo-sem-color-border-strong, #adb2bb)" />
                              Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Add ${source.name}`}
                              onClick={() => onAdd(source.id)}
                              className="flex flex-shrink-0 items-center justify-center text-[var(--flo-sem-color-icon-tertiary,#6b7280)] hover:text-[var(--flo-sem-color-text-body)]"
                            >
                              <Add size={20} color="currentColor" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

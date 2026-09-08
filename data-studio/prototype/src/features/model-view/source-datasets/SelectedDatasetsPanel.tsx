/**
 * SelectedDatasetsPanel — right panel of the Source Datasets tab.
 *
 * Matched to the "Data Studio — For Dev" Figma (Empty 738:20280, Adding
 * 3053:49054; group card 738:21262): the datasets chosen for this model. One is
 * the Primary Dataset; others can be made primary or removed. Checkboxes select
 * same-schema datasets for grouping.
 *
 * Phase B post-action states:
 *   - Group card (Schema icon + name + "Primary" badge + "Group" subtitle) with
 *     a kebab menu (Ungroup / Delete) collapses grouped members.
 *   - A link summary row ("Linked on <field> · …") appears once linked.
 *   - Non-primary linked rows show a "Linked via: <field>" chip UNDER the info.
 *   - A dataset added after linking shows a not-linked warning with a
 *     "Select linked field" link that re-opens the Link modal.
 *
 * NOTE: the two modals are figma-build-stamped; these panel post-states are
 * hand-authored from the reviewed spec (no data-figma-node stamps yet).
 * Presentational — all state is owned by SourceDatasetsContent.
 */

import { useState } from 'react';
import { Button, Heading, IconButton, SubpanelDropdown, TableStatusBadge } from '@floqastinc/flow-ui_core';
import Checkbox from '@floqastinc/flow-ui_core/Checkbox';
import DeleteOutlined from '@floqastinc/flow-ui_icons/material/DeleteOutlined';
import InfoOutlined from '@floqastinc/flow-ui_icons/material/InfoOutlined';
import LinkOutlined from '@floqastinc/flow-ui_icons/material/LinkOutlined';
import WarningOutlined from '@floqastinc/flow-ui_icons/material/WarningOutlined';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import Schema from '@floqastinc/flow-ui_icons/fq/Schema';
import type { AvailableSource, DatasetGroup, LinkConfig } from '../../../data/sources';

interface SelectedDatasetsPanelProps {
  selected: AvailableSource[];
  primaryId: string | null;
  groupSelectedIds: Set<string>;
  groups: DatasetGroup[];
  linkConfig: LinkConfig | null;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onToggleGroupSelect: (id: string) => void;
  onCreateGroup: () => void;
  onLinkDatasets: () => void;
  onUngroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  /** Re-open the Link modal to fix a not-linked dataset. */
  onFixLink: () => void;
}

interface ChipStamps {
  chip?: string;
  label?: string;
  value?: string;
}

/** "Linked via: <field>" chip — bordered pill under the dataset info (Figma 738:22565). */
function LinkedViaChip({ field, stamps }: { field: string; stamps?: ChipStamps }) {
  return (
    <span
      className="mt-1 inline-flex w-fit items-center gap-1 rounded border border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-white)] px-2 py-0.5 text-[11px] leading-[16px]"
      data-figma-node={stamps?.chip}
    >
      <span className="text-[var(--flo-sem-color-content-neutral-medium)]" data-figma-node={stamps?.label}>
        Linked via:
      </span>
      <span className="font-medium text-[var(--flo-sem-color-text-body)]" data-figma-node={stamps?.value}>
        {field}
      </span>
    </span>
  );
}

/** Per-occurrence chip stamps from the linked state (738:22503). */
const CHIP_STAMPS: ChipStamps[] = [
  { chip: '738:22565', label: '738:22566', value: '738:22567' },
  { chip: '738:22582', label: '738:22583', value: '738:22584' },
];

/** Figma node stamps for the two ungrouped "Secondary Card" rows (738:20720). */
const UNGROUPED_ROW_STAMPS = [
  { row: '738:20730', checkbox: '738:20733', textBlock: '738:20734', nameRow: '738:20735', name: '738:20736', badge: '738:20737', sub: '738:20738', del: '738:20746' },
  { row: '738:20748', checkbox: '738:20751', textBlock: '738:20752', nameRow: '738:20753', name: '738:20754', sub: '738:20755', makePrimary: '738:20761', del: '738:20763' },
] as const;

export function SelectedDatasetsPanel({
  selected,
  primaryId,
  groupSelectedIds,
  groups,
  linkConfig,
  onRemove,
  onSetPrimary,
  onToggleGroupSelect,
  onCreateGroup,
  onLinkDatasets,
  onUngroup,
  onDeleteGroup,
  onFixLink,
}: SelectedDatasetsPanelProps) {
  // UI-only: which group's kebab menu is open (one at a time).
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const groupedIds = new Set(groups.flatMap((g) => g.memberIds));
  const ungrouped = selected.filter((s) => !groupedIds.has(s.id));
  // A group counts as one selected entity (matches the For-Dev "(1)" post-group state).
  const entityCount = ungrouped.length + groups.length;

  // "Create Group" requires 2+ checked datasets that share one category (schema).
  const checked = ungrouped.filter((s) => groupSelectedIds.has(s.id));
  const canGroup = checked.length >= 2 && new Set(checked.map((s) => s.category)).size === 1;
  const canLink = entityCount >= 2;

  const linkField = linkConfig
    ? linkConfig.joinFieldByDatasetId[primaryId ?? ''] ??
      Object.values(linkConfig.joinFieldByDatasetId)[0]
    : null;
  const modeText =
    linkConfig?.unmatchedMode === 'matching-only'
      ? 'Keeping only matching rows'
      : 'Keeping all rows from primary';

  // Assign the two Figma "Join field chip" stamps to linked non-primary rows, in order.
  const chipStampsById: Record<string, ChipStamps> = {};
  ungrouped
    .filter((s) => s.id !== primaryId && linkConfig?.joinFieldByDatasetId[s.id])
    .forEach((s, idx) => {
      if (CHIP_STAMPS[idx]) chipStampsById[s.id] = CHIP_STAMPS[idx];
    });

  const isEmpty = selected.length === 0;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-md border border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-white)]"
      data-figma-node="738:20720"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 border-b border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-light-background)] px-4 py-[14px]"
        data-figma-node="738:20724"
      >
        <Heading variant="h5" weight="semibold" data-figma-node="738:20725">
          Selected Datasets ({entityCount})
        </Heading>
        <div className="flex items-center gap-2" data-figma-node="738:20726">
          <Button color="dark" variant="outlined" size="md" disabled={!canGroup} onClick={onCreateGroup} data-figma-node="738:20727">
            Create Group
          </Button>
          <Button color="primary" variant="filled" size="md" disabled={!canLink} onClick={onLinkDatasets} data-figma-node="738:20728">
            {linkConfig ? 'Edit Links' : 'Link Datasets'}
          </Button>
        </div>
      </div>

      {/* Body */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-1 px-4 py-16 text-center">
          <p className="m-0 text-[14px] font-medium text-[var(--flo-sem-color-text-body)]">
            Select datasets to be mapped for this model
          </p>
          <p className="m-0 text-[13px] text-[var(--flo-sem-color-content-neutral-medium)]">
            Datasets you select can be grouped and linked as needed
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Link summary row (AI link row 772:28588) */}
          {linkConfig && linkField && (
            <div
              className="flex items-center gap-2 border-b border-[var(--flo-sem-color-border)] bg-[var(--flo-sem-color-light-background)] px-4 py-2"
              data-figma-node="772:28588"
            >
              <LinkOutlined size={16} color="var(--flo-sem-color-content-info-medium, #3d7bf7)" data-figma-node="772:28589" />
              <span className="text-[12px] leading-[16px] text-[var(--flo-sem-color-text-body)]" data-figma-node="772:28590">
                Linked on{' '}
                <span className="font-medium text-[var(--flo-sem-color-content-info-medium,#3d7bf7)]">{linkField}</span>
                {' '}· {modeText}
              </span>
            </div>
          )}

          <div className="flex flex-col px-4">
            {/* Group cards */}
            {groups.length > 0 && (
            <div className="flex flex-col gap-3 py-4">
            {groups.map((group) => {
              // Primary member first (matches Figma "Primary Card" then "Secondary Card").
              const members = group.memberIds
                .map((id) => selected.find((s) => s.id === id))
                .filter((s): s is AvailableSource => Boolean(s))
                .sort((a, b) => Number(b.id === group.primaryMemberId) - Number(a.id === group.primaryMemberId));
              const isGroupPrimary = group.memberIds.includes(primaryId ?? '');
              const groupField = linkConfig?.joinFieldByDatasetId[group.id];
              return (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-md border border-[var(--flo-sem-color-border)]"
                  data-figma-node="738:21272"
                >
                  {/* Group header (738:21273) */}
                  <div
                    className="flex items-start justify-between gap-2 border-b border-[var(--flo-sem-color-border)] px-4 py-3"
                    data-figma-node="738:21273"
                  >
                    <div className="flex items-start gap-2" data-figma-node="738:21274">
                      <Schema size={20} color="var(--flo-sem-color-icon-primary)" data-figma-node="738:21275" />
                      <div className="flex flex-col gap-0.5" data-figma-node="738:21276">
                        <span
                          className="text-[14px] font-medium leading-[20px] text-[var(--flo-sem-color-text-body)]"
                          data-figma-node="738:21277"
                        >
                          {group.name}
                        </span>
                        <span
                          className="text-[12px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]"
                          data-figma-node="738:21278"
                        >
                          Group
                        </span>
                        {groupField && !isGroupPrimary && <LinkedViaChip field={groupField} />}
                      </div>
                      {isGroupPrimary && (
                        <TableStatusBadge color="info" size="xs" hasIcon={false} data-figma-node="738:21279">
                          Primary
                        </TableStatusBadge>
                      )}
                    </div>
                    <SubpanelDropdown
                      open={openMenu === group.id}
                      onOpenChange={(o: boolean) => setOpenMenu(o ? group.id : null)}
                      align="end"
                    >
                      <SubpanelDropdown.Trigger>
                        <IconButton
                          size="table"
                          aria-label={`${group.name} options`}
                          onClick={() => {}}
                          data-figma-node="738:21284"
                        >
                          <MoreVert />
                        </IconButton>
                      </SubpanelDropdown.Trigger>
                      <SubpanelDropdown.Content>
                        <SubpanelDropdown.Item onSelect={() => onUngroup(group.id)}>
                          <SubpanelDropdown.ItemText>Ungroup</SubpanelDropdown.ItemText>
                        </SubpanelDropdown.Item>
                        <SubpanelDropdown.Item onSelect={() => onDeleteGroup(group.id)}>
                          <SubpanelDropdown.ItemText>Delete</SubpanelDropdown.ItemText>
                        </SubpanelDropdown.Item>
                      </SubpanelDropdown.Content>
                    </SubpanelDropdown>
                  </div>
                  {/* Group members (738:21285) — primary → Primary Card, rest → Secondary Card */}
                  <div className="flex flex-col" data-figma-node="738:21285">
                    {members.map((m, idx) => {
                      const isMemberPrimary = m.id === group.primaryMemberId;
                      const st = isMemberPrimary
                        ? { card: '738:21287', name: '738:21291', sub: '738:21293' }
                        : { card: '738:21294', name: '738:21300', sub: '738:21301' };
                      const isLast = idx === members.length - 1;
                      return (
                        <div
                          key={m.id}
                          className={`px-4 py-3 pl-11 ${
                            isLast ? '' : 'border-b border-[var(--flo-sem-color-border)]'
                          }`}
                          data-figma-node={st.card}
                        >
                          <span
                            className="text-[13px] leading-[18px] text-[var(--flo-sem-color-text-body)]"
                            data-figma-node={st.name}
                          >
                            {m.name}
                          </span>
                          <p
                            className="m-0 mt-0.5 text-[11px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]"
                            data-figma-node={st.sub}
                          >
                            {m.connector} · {m.category}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
            )}

            {/* Ungrouped dataset rows — divided list, generous row gap (738:20729) */}
            {ungrouped.length > 0 && (
            <div className="flex flex-col" data-figma-node="738:20729">
            {ungrouped.map((source, i) => {
              const isPrimary = source.id === primaryId;
              const field = linkConfig?.joinFieldByDatasetId[source.id];
              const notLinked = Boolean(linkConfig) && !field && !isPrimary;
              const stamps = UNGROUPED_ROW_STAMPS[i];
              const isLast = i === ungrouped.length - 1;
              return (
                <div
                  key={source.id}
                  className={`flex items-start gap-4 py-5 ${
                    isLast ? '' : 'border-b border-[var(--flo-sem-color-border)]'
                  }`}
                  data-figma-node={stamps?.row}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <Checkbox
                      checked={groupSelectedIds.has(source.id)}
                      onCheckedChange={() => onToggleGroupSelect(source.id)}
                      data-figma-node={stamps?.checkbox}
                    />
                  </div>

                  <div className="min-w-0 flex-1" data-figma-node={stamps?.textBlock}>
                    <div className="flex items-center gap-2" data-figma-node={stamps?.nameRow}>
                      <span
                        className="truncate text-[14px] font-medium leading-[20px] text-[var(--flo-sem-color-text-body)]"
                        data-figma-node={stamps?.name}
                      >
                        {source.name}
                      </span>
                      {isPrimary && (
                        <TableStatusBadge color="info" size="xs" hasIcon={false} data-figma-node={stamps?.badge}>
                          Primary
                        </TableStatusBadge>
                      )}
                    </div>
                    <p
                      className="m-0 mt-1 truncate text-[11px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]"
                      data-figma-node={stamps?.sub}
                    >
                      {source.connector} · {source.category}
                    </p>
                    {/* Linked-via chip sits UNDER the info; never on the primary */}
                    {field && !isPrimary && <LinkedViaChip field={field} stamps={chipStampsById[source.id]} />}
                    {notLinked && (
                      <p
                        className="m-0 mt-1 flex items-center gap-1 text-[11px] leading-[16px] text-[var(--flo-sem-color-text-body)]"
                        data-figma-node="738:22599"
                      >
                        <WarningOutlined
                          size={14}
                          color="var(--flo-sem-color-content-warning-medium, #ba7517)"
                          data-figma-node="738:22600"
                        />
                        <span data-figma-node="738:22601">
                          Dataset is not linked.{' '}
                          <button
                            type="button"
                            onClick={onFixLink}
                            className="font-medium underline [font-family:inherit] text-[var(--flo-sem-color-text-body)]"
                          >
                            Select linked field
                          </button>
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2 self-center">
                    {!isPrimary && (
                      <Button
                        color="dark"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetPrimary(source.id)}
                        data-figma-node={stamps && 'makePrimary' in stamps ? stamps.makePrimary : undefined}
                      >
                        Make Primary
                      </Button>
                    )}
                    <IconButton
                      size="table"
                      aria-label={`Remove ${source.name}`}
                      onClick={() => onRemove(source.id)}
                      data-figma-node={stamps?.del}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </div>
                </div>
              );
            })}
            </div>
            )}
          </div>
        </div>
      )}

      {/* Grouping hint footer (appears with 2+ selected, before linking) */}
      {canLink && !linkConfig && (
        <div
          className="flex items-center gap-1 border-t border-[var(--flo-sem-color-border)] px-4 py-3"
          data-figma-node="772:28325"
        >
          <InfoOutlined size={16} color="var(--flo-sem-color-content-neutral-medium, #6b7280)" data-figma-node="772:28326" />
          <span className="text-[10px] leading-[14px] text-[var(--flo-sem-color-content-neutral-medium)]" data-figma-node="772:28327">
            Select two or more datasets with the same schema to create a group
          </span>
        </div>
      )}
    </div>
  );
}

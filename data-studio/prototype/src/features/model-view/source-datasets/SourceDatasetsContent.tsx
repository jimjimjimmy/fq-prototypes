/**
 * SourceDatasetsContent — Model View → Source Datasets tab body.
 *
 * Two-panel layout matched to the "For Dev" Figma (Empty 738:20280,
 * Adding 3053:49054): Available Sources (left) + Selected Datasets (right).
 * Owns all selection state for the tab; the panels are presentational.
 *
 * Renders inside ModelStubLayout's L2Frame (which supplies the "Source
 * Datasets" section heading); reads the model's initial selection via the
 * per-model seed in data/sources.ts.
 *
 * Add / remove / set-primary / group-select, plus the Create Group and Link
 * Datasets dialogs — all local state. Switching models remounts the component
 * via key={modelId} (see routes.tsx), so state seeds fresh from the per-model
 * seed on mount rather than a reset effect.
 */

import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AvailableSourcesPanel } from './AvailableSourcesPanel';
import { SelectedDatasetsPanel } from './SelectedDatasetsPanel';
import { GroupDatasetsDialog } from './GroupDatasetsDialog';
import { LinkDatasetsDialog, type LinkParticipant } from './LinkDatasetsDialog';
import {
  getAvailableSource,
  getDatasetFields,
  getSelectedSourceSeed,
  type AvailableSource,
  type DatasetGroup,
  type LinkConfig,
} from '../../../data/sources';

function toParticipant(s: AvailableSource): LinkParticipant {
  return { id: s.id, name: s.name, subtitle: `${s.connector} · ${s.category}`, fields: getDatasetFields(s) };
}

function primaryFromSeed(modelId: string | undefined): string | null {
  const seed = getSelectedSourceSeed(modelId);
  return seed.find((s) => s.isPrimary)?.sourceId ?? seed[0]?.sourceId ?? null;
}

export function SourceDatasetsContent() {
  const { modelId } = useParams<{ modelId: string }>();

  const [selectedOrder, setSelectedOrder] = useState<string[]>(() =>
    getSelectedSourceSeed(modelId).map((s) => s.sourceId),
  );
  const [primaryId, setPrimaryId] = useState<string | null>(() => primaryFromSeed(modelId));
  const [groupSelectedIds, setGroupSelectedIds] = useState<Set<string>>(() => new Set());
  const [groups, setGroups] = useState<DatasetGroup[]>([]);
  const [linkConfig, setLinkConfig] = useState<LinkConfig | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  // Monotonic group-id counter (survives group delete/recreate without id reuse).
  const groupSeq = useRef(0);

  const selectedIdSet = useMemo(() => new Set(selectedOrder), [selectedOrder]);
  const selected = useMemo(
    () =>
      selectedOrder
        .map((id) => getAvailableSource(id))
        .filter((s): s is AvailableSource => Boolean(s)),
    [selectedOrder],
  );

  const handleAdd = (id: string) => {
    setSelectedOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
    // First dataset added becomes Primary.
    setPrimaryId((prev) => prev ?? id);
  };

  const handleRemove = (id: string) => {
    setSelectedOrder((prev) => prev.filter((x) => x !== id));
    setGroupSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    // Removing the Primary promotes the next remaining dataset.
    setPrimaryId((prev) => (prev === id ? selectedOrder.find((x) => x !== id) ?? null : prev));
    // Drop it from any existing link (invalidates the link if <2 remain).
    pruneLink([id]);
  };

  const handleToggleGroupSelect = (id: string) => {
    setGroupSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Phase B — Group Datasets dialog (771:27561) / Link Datasets modal (738:22136).
  const groupCandidates = useMemo(
    () => selected.filter((s) => groupSelectedIds.has(s.id)),
    [selected, groupSelectedIds],
  );
  const suggestedGroupName = groupCandidates[0]
    ? `${groupCandidates[0].connector} ${groupCandidates[0].category}`
    : '';

  // Link operates on ENTITIES: each group (primary member's fields) + each
  // ungrouped dataset. A group that contains the primary dataset is the primary
  // entity (matches the For-Dev "group as primary" state).
  const { linkPrimary, linkOthers } = useMemo(() => {
    const groupedIds = new Set(groups.flatMap((g) => g.memberIds));
    const groupEntities: LinkParticipant[] = groups.map((g) => {
      const pm = selected.find((s) => s.id === g.primaryMemberId);
      return { id: g.id, name: g.name, subtitle: 'Group', fields: pm ? getDatasetFields(pm) : [] };
    });
    const entities = [
      ...groups.map((g, i) => ({ e: groupEntities[i], isPrimary: g.memberIds.includes(primaryId ?? '') })),
      ...selected
        .filter((s) => !groupedIds.has(s.id))
        .map((s) => ({ e: toParticipant(s), isPrimary: s.id === primaryId })),
    ];
    return {
      linkPrimary: entities.find((x) => x.isPrimary)?.e ?? null,
      linkOthers: entities.filter((x) => !x.isPrimary).map((x) => x.e),
    };
  }, [selected, primaryId, groups]);

  const handleSaveGroup = ({ name, memberIds }: { name: string; memberIds: string[] }) => {
    const primaryMemberId = memberIds.includes(primaryId ?? '') ? (primaryId as string) : memberIds[0];
    const id = `group-${(groupSeq.current += 1)}`;
    setGroups((prev) => [...prev, { id, name, memberIds, primaryMemberId }]);
    setGroupSelectedIds(new Set());
  };

  // Drop the given ids from the link config; a link needs 2+ participants, so
  // fall back to null once fewer remain (keeps link state honest after teardown).
  const pruneLink = (ids: string[]) =>
    setLinkConfig((prev) => {
      if (!prev) return prev;
      const next = { ...prev.joinFieldByDatasetId };
      ids.forEach((id) => delete next[id]);
      return Object.keys(next).length < 2 ? null : { ...prev, joinFieldByDatasetId: next };
    });

  const handleSaveLink = (config: LinkConfig) => setLinkConfig(config);

  // Ungroup: dissolve the group; members return as ungrouped selected datasets.
  const handleUngroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    // The group was a link participant by its id; dropping it invalidates a link.
    pruneLink([groupId]);
  };

  // Delete: remove the group AND its member datasets from the selection.
  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const memberSet = new Set(group.memberIds);
    setSelectedOrder((prev) => prev.filter((id) => !memberSet.has(id)));
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (primaryId && memberSet.has(primaryId)) {
      setPrimaryId(selectedOrder.find((id) => !memberSet.has(id)) ?? null);
    }
    pruneLink([groupId, ...group.memberIds]);
  };

  return (
    <div className="grid grid-cols-2 items-start gap-6">
      <AvailableSourcesPanel selectedIds={selectedIdSet} onAdd={handleAdd} />
      <SelectedDatasetsPanel
        selected={selected}
        primaryId={primaryId}
        groupSelectedIds={groupSelectedIds}
        groups={groups}
        linkConfig={linkConfig}
        onRemove={handleRemove}
        onSetPrimary={setPrimaryId}
        onToggleGroupSelect={handleToggleGroupSelect}
        onCreateGroup={() => setGroupOpen(true)}
        onLinkDatasets={() => setLinkOpen(true)}
        onUngroup={handleUngroup}
        onDeleteGroup={handleDeleteGroup}
        onFixLink={() => setLinkOpen(true)}
      />

      <GroupDatasetsDialog
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        datasets={groupCandidates}
        primaryId={primaryId}
        defaultName={suggestedGroupName}
        onSave={handleSaveGroup}
      />
      <LinkDatasetsDialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        primary={linkPrimary}
        others={linkOthers}
        initialConfig={linkConfig}
        onSave={handleSaveLink}
      />
    </div>
  );
}

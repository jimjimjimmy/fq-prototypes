/**
 * LinkDatasetsDialog — the "Link Fields Across Datasets" modal (Phase B).
 *
 * Built via the figma-build pipeline from the "Data Studio — For Dev" Figma
 * Modal instance 738:22136 (extract → resolve → assemble), then STITCHED to
 * FlowUI's real APIs: the compound Modal, RadioGroup + Radio (value + sublabel
 * for the description line), and Select for each join-field picker. The
 * assembler is a static resolver; the interaction (open/close, field selection,
 * unmatched-rows choice, save) is authored here per the figma-build "stateful
 * component" seam. Every `data-figma-node` stamp is preserved for figma-diff.
 *
 * Stitch notes (first validated Modal + RadioGroup/Radio stitch — logged to the
 * testbed notebook):
 *   - Modal renders its own close button → the assembler's ClearXClose is DROPPED.
 *   - The Figma decomposed each radio into circle <div>s; those are replaced by a
 *     real <RadioGroup><Radio value sublabel> with `keep-all` auto-selected.
 *
 * Copy is current-Figma EXCEPT two designer overrides (2026-07-08): the confirm
 * button is "Save" (Figma: "Continue") and radio 2 is "Keep only matching rows"
 * (Figma: "Only show rows that match across all datasets"). Presentational.
 */

import { useEffect, useState } from 'react';
import { Divider, Modal, RadioGroup, Radio, Select } from '@floqastinc/flow-ui_core';
import Star from '@floqastinc/flow-ui_icons/material/Star';
import type { LinkConfig, UnmatchedMode } from '../../../data/sources';

/** A dataset participating in the link, with its selectable join fields. */
export interface LinkParticipant {
  id: string;
  name: string;
  /** e.g. "Group" or "Acme ERP · Transactions". */
  subtitle: string;
  /** Selectable join-field names. */
  fields: string[];
}

interface LinkDatasetsDialogProps {
  open: boolean;
  onClose: () => void;
  primary: LinkParticipant | null;
  others: LinkParticipant[];
  /** Existing config to pre-select when re-opening (e.g. from a not-linked fix). */
  initialConfig?: LinkConfig | null;
  onSave: (config: LinkConfig) => void;
}

/** Per-row stamps for the "other datasets" list (2 rows in the design). */
const OTHER_ROW_STAMPS = [
  { row: 'I738:22136;33600:41194;738:22122', nameWrap: 'I738:22136;33600:41194;738:22123', name: 'I738:22136;33600:41194;738:22124', select: 'I738:22136;33600:41194;738:22125' },
  { row: 'I738:22136;33600:41194;738:22127', nameWrap: 'I738:22136;33600:41194;738:22128', name: 'I738:22136;33600:41194;738:22129', select: 'I738:22136;33600:41194;738:22130' },
] as const;

/** Default join field for a participant — prefer a shared key like account_id. */
function defaultField(fields: string[]): string {
  return fields.find((f) => f === 'account_id') ?? fields[0] ?? '';
}

export function LinkDatasetsDialog({
  open,
  onClose,
  primary,
  others,
  initialConfig,
  onSave,
}: LinkDatasetsDialogProps) {
  const [joinFields, setJoinFields] = useState<Record<string, string>>({});
  const [unmatchedMode, setUnmatchedMode] = useState<UnmatchedMode>('keep-all');

  useEffect(() => {
    if (open) {
      const seed: Record<string, string> = {};
      const prev = initialConfig?.joinFieldByDatasetId ?? {};
      if (primary) seed[primary.id] = prev[primary.id] ?? defaultField(primary.fields);
      for (const o of others) seed[o.id] = prev[o.id] ?? defaultField(o.fields);
      setJoinFields(seed);
      setUnmatchedMode(initialConfig?.unmatchedMode ?? 'keep-all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setField = (id: string, value: string | null) =>
    setJoinFields((prev) => ({ ...prev, [id]: value ?? '' }));

  const handleSave = () => {
    onSave({ joinFieldByDatasetId: joinFields, unmatchedMode });
    onClose();
  };

  const primaryName = primary?.name ?? 'the primary dataset';
  const opt = (fields: string[]) => fields.map((f) => ({ label: f, value: f }));

  return (
    <Modal open={open} onOpenChange={() => onClose()} size="sm" data-figma-node="738:22136">
      <Modal.Header data-figma-node="I738:22136;4654:73858">Link Fields Across Datasets</Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          <p
            className="m-0 text-[12px] leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
            data-figma-node="I738:22136;4654:73866"
          >
            Select the matching field from each dataset to use for linking.
          </p>

          {/* Primary dataset — info-tinted section (semantic tokens per design) */}
          {primary && (
            <div
              className="flex flex-col gap-0.5 rounded-md px-4 py-3"
              style={{
                background: 'var(--flo-sem-color-surface-info-weakest)',
                border: '1px solid var(--flo-sem-color-border-info-medium)',
              }}
              data-figma-node="I738:22136;33600:41194;738:22113"
            >
              <div className="flex items-center gap-1" data-figma-node="I738:22136;33600:41194;738:22114">
                <Star size={20} color="var(--flo-sem-color-content-info-medium, #3d7bf7)" data-figma-node="I738:22136;33600:41194;738:22115" />
                <span
                  className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-content-info-medium,#3d7bf7)]"
                  data-figma-node="I738:22136;33600:41194;738:22116"
                >
                  Primary
                </span>
              </div>
              <div className="flex items-center gap-6" data-figma-node="I738:22136;33600:41194;738:22117">
                <div className="flex w-[180px] flex-shrink-0 flex-col" data-figma-node="I738:22136;33600:41194;767:27248">
                  <span
                    className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
                    data-figma-node="I738:22136;33600:41194;767:27249"
                  >
                    {primary.name}
                  </span>
                  <span
                    className="text-[11px] leading-[16px] text-[var(--flo-sem-color-icon-secondary)]"
                    data-figma-node="I738:22136;33600:41194;767:27250"
                  >
                    {primary.subtitle}
                  </span>
                </div>
                <div className="min-w-0 flex-1 [&_button]:w-full">
                  <Select
                    value={joinFields[primary.id]}
                    options={opt(primary.fields)}
                    onChange={(v) => setField(primary.id, v as string | null)}
                    data-figma-node="I738:22136;33600:41194;738:22120"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other datasets — one join-field picker each, split by dividers */}
          <div className="flex flex-col gap-4" data-figma-node="I738:22136;33600:41194;738:22121">
            {others.map((o, i) => {
              const stamps = OTHER_ROW_STAMPS[i];
              return (
                <div key={o.id} className="contents">
                  {i > 0 && <Divider data-figma-node="I738:22136;33600:41194;738:22126" />}
                  <div className="flex items-center gap-6 px-4" data-figma-node={stamps?.row}>
                    <div className="flex w-[180px] flex-shrink-0 items-center gap-2" data-figma-node={stamps?.nameWrap}>
                      <span
                        className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
                        data-figma-node={stamps?.name}
                      >
                        {o.name}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 [&_button]:w-full">
                      <Select
                        value={joinFields[o.id]}
                        options={opt(o.fields)}
                        onChange={(v) => setField(o.id, v as string | null)}
                        data-figma-node={stamps?.select}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unmatched-rows policy */}
          <div className="flex flex-col gap-4 py-4" data-figma-node="I738:22136;33600:41194;738:22131">
            <div
              className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
              data-figma-node="I738:22136;33600:41194;738:22132"
            >
              How should we handle unmatched rows?
            </div>
            <RadioGroup
              value={unmatchedMode}
              onValueChange={(v) => setUnmatchedMode(v as UnmatchedMode)}
              data-figma-node="I738:22136;33600:41194;738:22133"
            >
              <Radio
                value="keep-all"
                sublabel={`Keep all rows from ${primaryName} even if they don't match in the other datasets. Show blank values for fields from datasets that don't match.`}
                data-figma-node="I738:22136;33600:41194;738:22134"
              >
                Keep all rows from primary dataset
              </Radio>
              <Radio
                value="matching-only"
                sublabel={`Exclude rows from ${primaryName} if they don't have a field that matches in all other datasets`}
                data-figma-node="I738:22136;33600:41194;738:22135"
              >
                Keep only matching rows
              </Radio>
            </RadioGroup>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Modal.FooterCancelBtn onClick={() => onClose()} data-figma-node="I738:22136;4654:73869">
          Cancel
        </Modal.FooterCancelBtn>
        <Modal.FooterActionBtn color="primary" variant="filled" onClick={handleSave} data-figma-node="I738:22136;4654:73870">
          Save
        </Modal.FooterActionBtn>
      </Modal.Footer>
    </Modal>
  );
}

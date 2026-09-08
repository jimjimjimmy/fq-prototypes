/**
 * GroupDatasetsDialog — the "Create Dataset Group" modal (Phase B).
 *
 * Built via the figma-build pipeline from the "Data Studio — For Dev" Figma
 * Modal instance 771:27561 (extract → resolve → assemble), then STITCHED to
 * FlowUI's real compound Modal API (Modal.Header/Body/Footer). The assembler
 * emits a static resolver output; the interaction layer (open/close, editable
 * name, member selection, save) is authored here. Every `data-figma-node` stamp
 * is preserved on its FlowUI equivalent so figma-diff can run DOM-keyed checks.
 *
 * Stitch notes: FlowUI Modal renders its own close button (assembler's
 * ClearXClose dropped); InlineAlert renders its own info icon + close, so we
 * pass text only and hide the close (guidance is not dismissable).
 *
 * Design QA (2026-07-08): the member list uses CHECKBOXES rather than the
 * Figma's trash buttons — unchecking excludes a dataset from the group without
 * leaving the modal; the "Datasets to group (N)" count tracks checked rows.
 * Declared design-fork from the Figma.
 */

import { useEffect, useState } from 'react';
import { InlineAlert, Input, TableStatusBadge } from '@floqastinc/flow-ui_core';
import Checkbox from '@floqastinc/flow-ui_core/Checkbox';
import Modal from '@floqastinc/flow-ui_core/Modal';
import type { AvailableSource } from '../../../data/sources';

interface GroupDatasetsDialogProps {
  open: boolean;
  onClose: () => void;
  /** Candidate datasets for the group (checked in the panel, same category). */
  datasets: AvailableSource[];
  /** Which of them is the primary (drives the "Primary" badge). */
  primaryId: string | null;
  /** Suggested default name, e.g. "Acme ERP Transactions". */
  defaultName?: string;
  onSave: (payload: { name: string; memberIds: string[] }) => void;
}

/** Per-row Figma node stamps (2 rows exist in the design; applied by index). */
const ROW_STAMPS = [
  {
    row: 'I771:27561;33600:41194;771:27567',
    name: 'I771:27561;33600:41194;771:27570',
    badge: 'I771:27561;33600:41194;771:27571',
    sub: 'I771:27561;33600:41194;771:27572',
  },
  {
    row: 'I771:27561;33600:41194;771:27582',
    name: 'I771:27561;33600:41194;771:27585',
    sub: 'I771:27561;33600:41194;771:27586',
  },
] as const;

export function GroupDatasetsDialog({
  open,
  onClose,
  datasets,
  primaryId,
  defaultName,
  onSave,
}: GroupDatasetsDialogProps) {
  const [name, setName] = useState(defaultName ?? '');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set(datasets.map((d) => d.id)));

  // Reseed each time the dialog opens (the parent picks the checked datasets).
  useEffect(() => {
    if (open) {
      setName(defaultName ?? '');
      setCheckedIds(new Set(datasets.map((d) => d.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // FlowUI Input hands back either the raw value or an event — handle both.
  const handleNameChange = (v: unknown) => {
    if (typeof v === 'string') setName(v);
    else setName((v as { target?: { value?: string } })?.target?.value ?? '');
  };

  const toggle = (id: string) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const checkedCount = checkedIds.size;
  const canSave = name.trim().length > 0 && checkedCount >= 2;

  const handleSave = () => {
    if (!canSave) return;
    const memberIds = datasets.filter((d) => checkedIds.has(d.id)).map((d) => d.id);
    onSave({ name: name.trim(), memberIds });
    onClose();
  };

  return (
    <Modal open={open} onOpenChange={() => onClose()} size="sm" data-figma-node="771:27561">
      <Modal.Header data-figma-node="I771:27561;4654:73858">Create Dataset Group</Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          <p
            className="m-0 text-[12px] leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
            data-figma-node="I771:27561;4654:73866"
          >
            The combined dataset will contain all rows from the individual datasets below, including
            any duplicates.
          </p>

          <div data-figma-node="I771:27561;33600:41194;771:27596">
            <InlineAlert color="info" hideCloseButton data-figma-node="I771:27561;33600:41194;771:27597">
              Note: Only datasets with the same schema (columns and data types) should be grouped to
              prevent unexpected results.
            </InlineAlert>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
              htmlFor="group-name"
            >
              Group Name
            </label>
            <Input
              id="group-name"
              value={name}
              onChange={handleNameChange}
              placeholder="Acme ERP Transactions"
              data-figma-node="I771:27561;33600:41194;771:27563"
            />
          </div>

          <div className="mt-2 flex flex-col gap-2" data-figma-node="I771:27561;33600:41194;771:27564">
            <div
              className="text-[12px] font-medium leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
              data-figma-node="I771:27561;33600:41194;771:27565"
            >
              Datasets to group ({checkedCount})
            </div>
            <div className="flex flex-col" data-figma-node="I771:27561;33600:41194;771:27566">
              {datasets.map((d, i) => {
                const isPrimary = d.id === primaryId;
                const isLast = i === datasets.length - 1;
                const stamps = ROW_STAMPS[i];
                return (
                  <div
                    key={d.id}
                    className={`flex items-start gap-3 py-2 ${
                      isLast ? '' : 'border-b border-[var(--flo-sem-color-border)]'
                    }`}
                    data-figma-node={stamps?.row}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <Checkbox checked={checkedIds.has(d.id)} onCheckedChange={() => toggle(d.id)} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[12px] leading-[18px] text-[var(--flo-sem-color-icon-primary)]"
                          data-figma-node={stamps?.name}
                        >
                          {d.name}
                        </span>
                        {isPrimary && (
                          <TableStatusBadge
                            color="info"
                            size="xs"
                            hasIcon={false}
                            data-figma-node={stamps?.badge}
                          >
                            Primary
                          </TableStatusBadge>
                        )}
                      </div>
                      <span
                        className="text-[11px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]"
                        data-figma-node={stamps?.sub}
                      >
                        {d.connector}  ·  {d.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Modal.FooterCancelBtn onClick={() => onClose()} data-figma-node="I771:27561;4654:73869">
          Cancel
        </Modal.FooterCancelBtn>
        <Modal.FooterActionBtn
          color="primary"
          variant="filled"
          disabled={!canSave}
          onClick={handleSave}
          data-figma-node="I771:27561;4654:73870"
        >
          Save
        </Modal.FooterActionBtn>
      </Modal.Footer>
    </Modal>
  );
}

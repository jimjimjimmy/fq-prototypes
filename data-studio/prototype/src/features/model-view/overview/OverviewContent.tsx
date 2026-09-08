/**
 * OverviewContent — Model View → Overview tab body.
 *
 * Editable model-details form matched to the "For Dev" Figma (frame 401:65370):
 * Model Name (input) · FloQast Model (read-only) · Description (textarea +
 * helper) · divider · 2×2 metadata grid (Created / Last Updated / Total
 * Records / Active Version) · Save Changes button.
 *
 * Renders inside ModelStubLayout's L2Frame; reads the model via useModel.
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input, TextArea, Button } from '@floqastinc/flow-ui_core';
import { useModel } from '../../_shared/useModel';
import { formatRecords, formatLongDate } from '../../_shared/format';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-semibold leading-[18px] text-[var(--flo-sem-color-content-neutral-strong)]">{children}</span>
  );
}

function MetaCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <span className="text-[12px] leading-[18px] text-[var(--flo-sem-color-text-body)]">{value}</span>
    </div>
  );
}

export function OverviewContent() {
  const { modelId } = useParams<{ modelId: string }>();
  const { model, displayName } = useModel(modelId);

  const [name, setName] = useState(model?.name ?? displayName);
  const [description, setDescription] = useState('');

  // FlowUI Input/TextArea onChange may hand back the raw value or an event.
  const readValue = (v: unknown) =>
    typeof v === 'string' ? v : (v as { target?: { value?: string } })?.target?.value ?? '';

  const dirty = (model ? name !== model.name : false) || description.trim() !== '';

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 635 }}>
      {/* Model Name */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Model Name</FieldLabel>
        {/* FlowUI Input emits a benign dev-only propType warning when used
            without an adornment child (its `children` slot). The field has no
            icon by design, so we accept the warning rather than add dead DOM —
            it does not affect rendering (same class as FlowUI's defaultProps
            warnings). */}
        <Input value={name} onChange={(v: unknown) => setName(readValue(v))} />
      </div>

      {/* FloQast Model (read-only) */}
      <div className="flex flex-col gap-2">
        <FieldLabel>FloQast Model</FieldLabel>
        <span className="text-[12px] leading-[18px] text-[var(--flo-sem-color-text-body)]">{model?.domain ?? '—'}</span>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Description</FieldLabel>
        <TextArea
          value={description}
          onChange={(v: unknown) => setDescription(readValue(v))}
          placeholder="Add a description for this model..."
          autoGrowVertical
          autoGrowVerticalMinHeight="120px"
        />
        <span className="text-[11px] leading-[16px] text-[var(--flo-sem-color-content-neutral-medium)]">
          Provide context about the data source, transformation logic, or business purpose.
        </span>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-6 border-t border-[var(--flo-sem-color-border)] pt-[17px]">
        <MetaCell label="Created" value={formatLongDate(model?.created)} />
        <MetaCell label="Last Updated" value={formatLongDate(model?.lastUpdated)} />
        <MetaCell label="Total Records" value={formatRecords(model?.records)} />
        {/* Overview metadata shows the bare version integer (e.g. "3"), unlike
            the Catalog column's "Version N" — per frame 401:65326. */}
        <MetaCell label="Active Version" value={model?.version ?? '—'} />
      </div>

      {/* Save */}
      <div>
        <Button color="primary" variant="filled" size="lg" disabled={!dirty} onClick={() => { /* persist lands in a later phase */ }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

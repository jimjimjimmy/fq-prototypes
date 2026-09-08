/**
 * CatalogPage — L1 Catalog tab (Data Studio landing).
 *
 * Owns the global search string (rendered in the L1Frame rightSlot alongside
 * Create Model). Per-column filtering lives inside CatalogTable as a custom
 * header filter row (matching the "For Dev" Figma — no separate filter
 * toolbar). The Catalog table is the page's only body content.
 *
 * Sources: knowledge/prd-suite/prd-catalog-search-filter.md +
 * prd-catalog-lineage-merge.md; visual match figma-session-2026-06-30.md.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@floqastinc/flow-ui_core';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Search from '@floqastinc/flow-ui_icons/material/Search';
import { L1Frame } from '../../scaffold/data-studio';
import { allModels } from '../../data/models';
import CatalogTable from './CatalogTable';

export function CatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // FlowUI Input's onChange may hand back the raw value or an event — handle both.
  const handleSearchChange = (v: unknown) => {
    if (typeof v === 'string') setSearch(v);
    else setSearch((v as { target?: { value?: string } })?.target?.value ?? '');
  };

  const rightSlot = (
    <>
      <div style={{ width: 280 }}>
        <Input
          mute
          type="search"
          placeholder="Search by model name or type..."
          value={search}
          onChange={handleSearchChange}
        >
          <Input.LeftItem>
            <Search size={16} color="var(--flo-sem-color-icon-primary, #6b7280)" />
          </Input.LeftItem>
        </Input>
      </div>
      <Button color="primary" variant="filled" onClick={() => { /* Create Model flow lands in a later phase */ }}>
        <span className="inline-flex items-center gap-1">
          <Add size={16} color="var(--flo-sem-color-white)" />
          Create Model
        </span>
      </Button>
    </>
  );

  const hasNoModels = allModels.length === 0;

  return (
    <L1Frame
      activeTab="catalog"
      onTabChange={(t) => navigate(`/data-studio/${t}`)}
      rightSlot={rightSlot}
    >
      {hasNoModels ? (
        <EmptyCatalog />
      ) : (
        <CatalogTable search={search} onClearSearch={() => setSearch('')} />
      )}
    </L1Frame>
  );
}

/** No-models-yet empty state (PRD AC-ML-11-01). */
function EmptyCatalog() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <h2 className="m-0 text-[16px] font-semibold text-[var(--flo-sem-color-text-body)]">No models yet</h2>
      <p className="m-0 text-[13px] text-[var(--flo-sem-color-content-neutral-medium)]">
        Create your first model to start mapping source data into FloQast.
      </p>
      <div className="mt-3">
        <Button color="primary" variant="filled" onClick={() => { /* Create Model flow lands in a later phase */ }}>
          <span className="inline-flex items-center gap-1">
            <Add size={16} color="var(--flo-sem-color-white)" />
            Create Model
          </span>
        </Button>
      </div>
    </div>
  );
}

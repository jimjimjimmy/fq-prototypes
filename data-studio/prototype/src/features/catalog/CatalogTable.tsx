/**
 * CatalogTable — the Catalog landing model table.
 *
 * Matched to the "Data Studio — For Dev" Figma (frame 5:30130): columns
 * Model · Version · Status · Records · Linked Datasets · Last Updated · ⋮,
 * 42px single-line rows, single-line group headers "Name (N)".
 *
 * Models are grouped by FQ Model type using AG Grid Community's full-width-row
 * pattern (native row grouping is Enterprise). Because native AG Grid filtering
 * would hide the full-width group rows, ALL filtering is done in React: a
 * two-row custom header (label + per-column filter input) reports changes via
 * `headerComponentParams.onChange`, and the derived `rowData` useMemo applies
 * search + per-column "contains" filters + within-group sort.
 *
 * NOTE: AG Grid renders custom header/cell components in a detached React tree,
 * so React Context does NOT reach them — callbacks must be passed through
 * `headerComponentParams`, and each header input keeps its own local state.
 */

import { useState, useMemo, useCallback, useEffect, type ReactNode, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from '@ag-grid-community/react';
import type { ColDef, IsFullWidthRowParams, SortChangedEvent, RowClickedEvent, IHeaderParams } from '@ag-grid-community/core';
import { LinkButton } from '@floqastinc/flow-ui_core';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import FilterList from '@floqastinc/flow-ui_icons/material/FilterList';
import { floqastGridTheme } from '../../scaffold/grid/floqastGridTheme';
import { modelData, type Model } from '../../data/models';
import { StatusBadge, STATUS_META } from '../_shared/StatusBadge';
import { formatRecords, formatLastUpdated, formatVersion } from '../_shared/format';

// AG Grid modules (ClientSideRowModelModule) are registered globally in src/main.tsx.

// ── Filter model ─────────────────────────────────────────────────────────────

/** Column filter keys map to Model fields (status matches the badge label). */
type FilterField = 'name' | 'version' | 'status' | 'records' | 'linkedFiles' | 'lastUpdated';
type ColumnFilters = Partial<Record<FilterField, string>>;

// ── Figma node stamps ────────────────────────────────────────────────────────
// `data-figma-node` maps rendered DOM back to nodes in the "Data Studio — For
// Dev" frame (5:30130), so figma-diff can run node-keyed structural checks on
// this hand-authored screen (it isn't figma-build-generated, so it wouldn't
// otherwise carry stamps). Only nodes with a real Figma counterpart are stamped:
// the grid container, the per-column headers, and the per-column floating
// filters. The grouped category rows are a prototype-specific rendering with no
// 1:1 Figma node, so they are intentionally left unstamped rather than mislabeled.
const FIGMA_GRID_NODE = '5:30140'; // Models Table - AG Grid
const FIGMA_ACTIONS_HEADER_NODE = '5:30151'; // 7th column header (actions)
const FIGMA_HEADER_NODE: Record<FilterField, string> = {
  name: '5:30145', version: '5:30146', status: '5:30147',
  records: '5:30148', linkedFiles: '5:30149', lastUpdated: '5:30150',
};
const FIGMA_FILTER_NODE: Record<FilterField, string> = {
  name: '5:30154', version: '5:30155', status: '5:30156',
  records: '5:30157', linkedFiles: '5:30158', lastUpdated: '5:30159',
};

/** Searchable text per field — what the per-column filter matches against. */
function fieldText(model: Model, field: FilterField): string {
  switch (field) {
    case 'status': return STATUS_META[model.status].label;
    case 'version': return formatVersion(model.version);
    case 'records': return String(model.records);
    case 'linkedFiles': return String(model.linkedFiles);
    case 'lastUpdated': return formatLastUpdated(model.lastUpdated);
    default: return String(model[field] ?? '');
  }
}

// ── Row types ──────────────────────────────────────────────────────────────

interface GroupRow {
  _rowType: 'group';
  id: string;
  domain: string;
  matchCount: number;
  isExpanded: boolean;
}
type ModelRow = Model & { _rowType: 'model' };
type GridRow = GroupRow | ModelRow;

interface SortState {
  colId: string;
  dir: 'asc' | 'desc';
}

// ── Custom header: label row (sortable) + filter input row ────────────────────

interface CatalogHeaderParams extends IHeaderParams {
  field: FilterField;
  onFilterChange: (field: FilterField, value: string) => void;
}

function CatalogHeader(props: CatalogHeaderParams) {
  const { displayName, field, column, progressSort, onFilterChange } = props;
  const [value, setValue] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc' | null>(() => column.getSort() ?? null);

  useEffect(() => {
    const onChanged = () => setSort(column.getSort() ?? null);
    column.addEventListener('sortChanged', onChanged);
    return () => column.removeEventListener('sortChanged', onChanged);
  }, [column]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'var(--flo-sem-color-light-background)' }}>
      {/* Label row (click to sort) + column menu affordance. */}
      <div
        data-figma-node={FIGMA_HEADER_NODE[field]}
        onClick={(e) => progressSort(e.shiftKey)}
        style={{
          height: 50, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 16, paddingRight: 8,
          borderBottom: '1px solid var(--flo-sem-color-border)', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-body)', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
          {sort === 'asc' && <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--flo-sem-color-icon-tertiary)' }}>▲</span>}
          {sort === 'desc' && <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--flo-sem-color-icon-tertiary)' }}>▼</span>}
        </span>
        <button
          type="button"
          aria-label="Column menu"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <MoreVert size={16} color="var(--flo-sem-color-icon-tertiary)" />
        </button>
      </div>
      {/* Filter input row (white input on the grey header strip). */}
      <div data-figma-node={FIGMA_FILTER_NODE[field]} style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, paddingRight: 12 }}>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); onFilterChange(field, e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1, minWidth: 0, height: 40, padding: '0 8px',
            border: '1px solid var(--flo-sem-color-border)', borderRadius: 6, fontSize: 12,
            color: 'var(--flo-sem-color-text-body)', outline: 'none', background: 'var(--flo-sem-color-white)',
          }}
        />
        <FilterList size={20} color="var(--flo-sem-color-icon-tertiary)" />
      </div>
    </div>
  );
}

/** Empty header for the actions column (grey strip, no label/filter). */
function BlankHeader() {
  return <div data-figma-node={FIGMA_ACTIONS_HEADER_NODE} style={{ width: '100%', height: '100%', background: 'var(--flo-sem-color-light-background)' }} />;
}

// ── Group header renderer (single line: chevron + "Name (N)") ─────────────────

function GroupRowRenderer({ data, toggleGroup }: { data: GroupRow; toggleGroup: (domain: string) => void }) {
  return (
    <div
      onClick={() => toggleGroup(data.domain)}
      style={{
        height: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        cursor: 'pointer', background: 'white', borderBottom: '1px solid var(--flo-sem-color-border)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--flo-sem-color-light-background)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
    >
      <svg
        style={{
          width: 16, height: 16, color: 'var(--flo-sem-color-icon-tertiary)', flexShrink: 0,
          transform: data.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s',
        }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--flo-sem-color-text-body)', lineHeight: '18px' }}>
        {data.domain} ({data.matchCount})
      </span>
    </div>
  );
}

// ── Within-group sort ────────────────────────────────────────────────────────

function sortModels(models: Model[], sort: SortState | null): Model[] {
  if (!sort) return models;
  const { colId, dir } = sort;
  const factor = dir === 'asc' ? 1 : -1;
  return [...models].sort((a, b) => {
    const av = a[colId as keyof Model];
    const bv = b[colId as keyof Model];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
    return String(av ?? '').localeCompare(String(bv ?? '')) * factor;
  });
}

interface CatalogTableProps {
  /** Global search string (matches Model Name, case-insensitive). */
  search: string;
  /** Clears the global search (column filters are cleared internally). */
  onClearSearch: () => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CatalogTable({ search, onClearSearch }: CatalogTableProps) {
  const navigate = useNavigate();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const s = new Set<string>();
    modelData.forEach((g) => { if (g.defaultExpanded) s.add(g.domain); });
    return s;
  });
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [filters, setFilters] = useState<ColumnFilters>({});
  // Bumping this remounts the header components (clearing their local inputs).
  const [filterEpoch, setFilterEpoch] = useState(0);

  const handleFilterChange = useCallback((field: FilterField, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters({});
    setFilterEpoch((e) => e + 1);
    onClearSearch();
  }, [onClearSearch]);

  const toggleGroup = useCallback((domain: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain); else next.add(domain);
      return next;
    });
  }, []);

  const query = search.trim().toLowerCase();
  const activeColumnFilters = useMemo(
    () => Object.entries(filters).filter(([, v]) => v && v.trim()) as [FilterField, string][],
    [filters],
  );
  const filterActive = query.length > 0 || activeColumnFilters.length > 0;

  const { rows, totalMatches } = useMemo(() => {
    const out: GridRow[] = [];
    let matches = 0;
    for (const group of modelData) {
      const filtered = group.models.filter((m) => {
        if (query && !m.name.toLowerCase().includes(query)) return false;
        for (const [field, value] of activeColumnFilters) {
          if (!fieldText(m, field).toLowerCase().includes(value.trim().toLowerCase())) return false;
        }
        return true;
      });
      matches += filtered.length;
      if (filterActive && filtered.length === 0) continue;

      out.push({
        _rowType: 'group',
        id: `group-${group.domain}`,
        domain: group.domain,
        matchCount: filtered.length,
        isExpanded: expandedGroups.has(group.domain),
      });
      if (expandedGroups.has(group.domain)) {
        for (const model of sortModels(filtered, sortState)) {
          out.push({ ...model, _rowType: 'model' });
        }
      }
    }
    return { rows: out, totalMatches: matches };
  }, [query, activeColumnFilters, filterActive, expandedGroups, sortState]);

  const isFullWidthRow = useCallback(
    (params: IsFullWidthRowParams) => (params.rowNode.data as GridRow)?._rowType === 'group',
    [],
  );
  const fullWidthCellRendererParams = useMemo(() => ({ toggleGroup }), [toggleGroup]);
  const fullWidthCellRenderer = useCallback(
    (params: { data: GroupRow; toggleGroup: (domain: string) => void }) => (
      <GroupRowRenderer data={params.data} toggleGroup={params.toggleGroup} />
    ),
    [],
  );

  // Neutralize AG Grid's physical sort; we reorder within groups ourselves.
  // NOTE: headerComponent is set per-column (NOT here) — pairing it with each
  // column's headerComponentParams; a defaultColDef headerComponent does not
  // receive the per-column params and also blocks per-column overrides.
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      comparator: () => 0,
      cellStyle: { display: 'flex', alignItems: 'center' },
    }),
    [],
  );

  const cellText = (text: ReactNode, indent = 0) => (
    <span
      style={{
        fontSize: 12, color: 'var(--flo-sem-color-text-body-secondary)', lineHeight: '16px',
        paddingLeft: indent, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );

  const hp = (field: FilterField) => ({ field, onFilterChange: handleFilterChange });

  const columnDefs = useMemo<ColDef<Model>[]>(
    () => [
      {
        headerName: 'Model', field: 'name', colId: 'name', flex: 2, minWidth: 200,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('name'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return cellText(row.name, 16);
        },
      },
      {
        headerName: 'Version', field: 'version', colId: 'version', flex: 1, minWidth: 110,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('version'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return cellText(formatVersion(row.version));
        },
      },
      {
        headerName: 'Status', field: 'status', colId: 'status', flex: 1, minWidth: 120,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('status'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return <StatusBadge status={row.status} />;
        },
      },
      {
        headerName: 'Records', field: 'records', colId: 'records', flex: 1, minWidth: 110,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('records'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return cellText(row.lastRunDate ? formatRecords(row.records) : '—');
        },
      },
      {
        headerName: 'Linked Datasets', field: 'linkedFiles', colId: 'linkedFiles', flex: 1, minWidth: 140,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('linkedFiles'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          // FlowUI LinkButton — adopts the FlowUI link color token, focus ring,
          // and a11y semantics (replaces a hand-rolled underlined <button>).
          // stopPropagation keeps the link click from also triggering the row's
          // navigate-to-overview (onRowClicked).
          return (
            <LinkButton
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                navigate(`/data-studio/model/${row.id}/source-datasets`);
              }}
              styleOverrides={{ text: { fontSize: 12, lineHeight: '16px' } }}
            >
              {`${row.linkedFiles} Linked Datasets`}
            </LinkButton>
          );
        },
      },
      {
        headerName: 'Last Updated', field: 'lastUpdated', colId: 'lastUpdated', flex: 1, minWidth: 130,
        headerComponent: CatalogHeader,
        headerComponentParams: hp('lastUpdated'),
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return cellText(formatLastUpdated(row.lastUpdated));
        },
      },
      {
        headerName: '', colId: 'actions', width: 56, sortable: false, resizable: false,
        headerComponent: BlankHeader,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        cellRenderer: (p: { data: GridRow }) => {
          const row = p.data as ModelRow;
          if (!row || row._rowType !== 'model') return null;
          return (
            <button
              type="button"
              aria-label="Model actions"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 6, background: 'transparent',
                border: 'none', cursor: 'pointer',
              }}
            >
              <MoreVert size={18} color="var(--flo-sem-color-icon-tertiary)" />
            </button>
          );
        },
      },
    ],
    // filterEpoch in deps → columns rebuild on "Clear", remounting headers (clears inputs).
    [navigate, handleFilterChange, filterEpoch],
  );

  const onSortChanged = useCallback((event: SortChangedEvent) => {
    const sorted = event.api.getColumnState().find((c) => c.sort);
    setSortState(sorted ? { colId: sorted.colId, dir: sorted.sort as 'asc' | 'desc' } : null);
  }, []);

  const onRowClicked = useCallback(
    (event: RowClickedEvent<Model>) => {
      const row = event.data as GridRow | undefined;
      if (!row || row._rowType === 'group') return;
      navigate(`/data-studio/model/${row.id}/overview`);
    },
    [navigate],
  );

  if (filterActive && totalMatches === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="m-0 text-[14px] font-semibold text-[var(--flo-sem-color-text-body)]">No models match your search or filters</p>
        <p className="m-0 text-[13px] text-[var(--flo-sem-color-content-neutral-medium)]">Try a different search term, or clear your filters to see all models.</p>
        <button
          type="button"
          onClick={clearAll}
          className="mt-2 text-[13px] font-semibold text-[var(--flo-sem-color-primary-active)] hover:underline bg-transparent border-none cursor-pointer"
        >
          Clear search and filters
        </button>
      </div>
    );
  }

  return (
    <div data-figma-node={FIGMA_GRID_NODE} style={{ width: '100%' }}>
      <AgGridReact<Model>
        theme={floqastGridTheme}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rows as Model[]}
        headerHeight={100}
        getRowHeight={() => 42}
        domLayout="autoHeight"
        isFullWidthRow={isFullWidthRow}
        fullWidthCellRenderer={fullWidthCellRenderer}
        fullWidthCellRendererParams={fullWidthCellRendererParams}
        onSortChanged={onSortChanged}
        onRowClicked={onRowClicked}
        suppressCellFocus
        getRowId={(params) => (params.data as GridRow).id}
      />
    </div>
  );
}

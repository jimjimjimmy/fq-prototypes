import { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import type { ReconciliationRow, Assignee } from '../data/types.ts'
import { getCurrencyTier, TIER_WIDTHS, STICKY_WIDTHS, RIGHT_COLS } from '../data/types.ts'
import { SideDrawer, FX_RATES, FUNCTIONAL_CURRENCY, companyToCurrency } from './SideDrawer.tsx'

type ViewMode = 'functional' | 'local' | 'reporting' | 'all'

/** Pure helper - exported for unit tests */
export function getColumnFlags(viewMode: ViewMode) {
  return {
    isMultiCurrency: viewMode === 'local' || viewMode === 'all',
    isShowAll: viewMode === 'all' || viewMode === 'reporting',
  }
}

interface RecsTableProps {
  data: ReconciliationRow[]
  viewMode: ViewMode
  fxRatesLoaded?: boolean
  reviewTrigger?: number
  /** Reporting currency to render in the Reporting column group. Default 'USD'. */
  reportingCurrency?: string
  /** Whether the FloQast Tie Out (functional) column group is visible. Default true. */
  funcRendered?: boolean
  /** Current demo scenario id ('admin' | 'preparer' | 'controller'). Drives scenario-specific UI states. */
  scenarioId?: string
  /** When false (Admin pre-setup), suppress all MC features: no asterisks, no RateNaCell,
   *  no currency_exchange icons. Defaults to true so all other personas are unaffected. */
  multiCurrencyActive?: boolean
  /** When true, shows demo-only UI like "Tag currencies" hint and banners. Default false. */
  showBanners?: boolean
}

// ── Currency formatting ────────────────────────────────────────

/** Format with accounting-style parentheses for negatives */
function formatCurrencyShort(currency: string, value: number | null): string {
  if (value == null) return '–'
  const abs = Math.abs(value)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs)
  return value < 0 ? `${currency} (${formatted})` : `${currency} ${formatted}`
}

/** Format local currency (JPY: no decimals, large numbers) */
function formatLocalCurrency(currency: string, value: number | null): string {
  if (value == null) return '–'
  if (currency === 'JPY' || currency === 'KRW') {
    const abs = Math.abs(value)
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(abs)
    return value < 0 ? `${currency} (${formatted})` : `${currency} ${formatted}`
  }
  return formatCurrencyShort(currency, value)
}

// ── Group data by folder ───────────────────────────────────────

interface RowGroup {
  folder: string
  rows: ReconciliationRow[]
}

function groupByFolder(data: ReconciliationRow[]): RowGroup[] {
  const map = new Map<string, ReconciliationRow[]>()
  for (const row of data) {
    const key = row.folder
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(row)
  }
  return Array.from(map.entries()).map(([folder, rows]) => ({ folder, rows }))
}

// ── Column width calculations ─────────────────────────────────

function getFinancialWidths(localCurrency: string) {
  const tier = getCurrencyTier(localCurrency)
  return TIER_WIDTHS[tier]
}

/**
 * Compute the table's total width as the EXACT sum of <col> widths.
 * Pass animated col widths so the table width tracks the cols across the animation.
 */
function getTableMinWidth(
  mcRendered: boolean,
  repRendered: boolean,
  localCurrency: string,
  mcRecBalW: number,
  mcRecItemsW: number,
  repPerGLW: number,
  repRecBalW: number,
  repRecItemsW: number,
  repDiffW: number,
  funcRendered: boolean = true,
): number {
  const sticky = STICKY_WIDTHS.periodFolder + STICKY_WIDTHS.account
  const rightW = RIGHT_COLS.assignees.min + RIGHT_COLS.dueDate.min + RIGHT_COLS.completed.min + 168
  const w = getFinancialWidths(localCurrency)
  const financial = funcRendered ? (w.perGL + w.recBalance + w.recItems + w.difference) : 0
  const local = mcRendered ? (mcRecBalW + mcRecItemsW) : 0
  const reporting = repRendered ? (repPerGLW + repRecBalW + repRecItemsW + repDiffW) : 0
  return sticky + financial + local + reporting + rightW
}

// ── Sticky column styles ──────────────────────────────────────

const stickyPeriod: React.CSSProperties = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  backgroundColor: 'inherit',
}

const stickyAccount: React.CSSProperties = {
  position: 'sticky',
  left: STICKY_WIDTHS.periodFolder,
  zIndex: 2,
  backgroundColor: 'inherit',
}

// Column group background: alternating gray | white | gray
// Local and Reporting share the same neutral gray; Functional is white (no bg override).
const TINTED_BG = '#f8fafc'
const GROUP_BORDER = '1px solid #e1e6ef'

// ── Main table component ───────────────────────────────────────

export function RecsTable({ data: rawData, viewMode, fxRatesLoaded = true, reviewTrigger, reportingCurrency = 'USD', funcRendered = true, scenarioId, multiCurrencyActive = true, showBanners = false }: RecsTableProps) {
  // Stored reporting values are USD. Multiply by USD->target rate from the Cooper
  // table so the Reporting column group renders in the selected reporting currency.
  const repMultiplier = useMemo(() => {
    if (reportingCurrency === 'MXN') return parseFloat(DEMO_FX_RATE_MAP['USD-MXN']) // 21.5517
    if (reportingCurrency === 'JPY') return parseFloat(DEMO_FX_RATE_MAP['USD-JPY']) // 144.9275
    return 1
  }, [reportingCurrency])
  const data = useMemo(() => rawData.map(r => ({
    ...r,
    perGL_reporting: r.perGL_reporting != null ? r.perGL_reporting * repMultiplier : null,
    recBalance_reporting: r.recBalance_reporting != null ? r.recBalance_reporting * repMultiplier : null,
    recItems_reporting: r.recItems_reporting != null ? r.recItems_reporting * repMultiplier : null,
    reportingCurrency: reportingCurrency,
  })), [rawData, repMultiplier, reportingCurrency])
  const groups = useMemo(() => groupByFolder(data), [data])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(groups.map(g => g.folder)))
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerAccountName, setDrawerAccountName] = useState('')
  const [drawerRowId, setDrawerRowId] = useState('')
  const [drawerIsGroup, setDrawerIsGroup] = useState(false)
  const [drawerFlashSection, setDrawerFlashSection] = useState<'currency' | undefined>(undefined)
  const [rowTargetCompanies, setRowTargetCompanies] = useState<Record<string, string | null>>({})
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  const handleSettingsClick = useCallback((rowId: string, accountName: string, isParent: boolean, flashSection?: 'currency') => {
    setDrawerRowId(rowId)
    setDrawerAccountName(accountName)
    setDrawerIsGroup(isParent)
    setDrawerFlashSection(flashSection)
    setDrawerOpen(true)
  }, [])

  // Actions column hover - expands the sticky panel from 48px to 168px
  const [actionsHovered, setActionsHovered] = useState(false)
  const [isScrolledRight, setIsScrolledRight] = useState(false)
  // Actions column is always 168px in the layout (matches tableMinWidth assumption).
  // The overlay clips itself to 48px visually when collapsed; no col reflow ever happens.
  const actionsColWidth = 168
  const actionsHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleActionsEnter = useCallback(() => {
    if (actionsHoverTimer.current) clearTimeout(actionsHoverTimer.current)
    setActionsHovered(true)
  }, [])
  const handleActionsLeave = useCallback(() => {
    actionsHoverTimer.current = setTimeout(() => setActionsHovered(false), 80)
  }, [])

  const handleDrawerApply = useCallback((targetCompanies: (string | null)[]) => {
    if (!drawerRowId) return
    if (drawerIsGroup) {
      const parentRow = data.find(r => r.id === drawerRowId)
      if (parentRow) {
        const childRows = data.filter(r => !r.isParentRow && r.assignees.length === 0 && r.folder === parentRow.folder)
        setRowTargetCompanies(prev => {
          const next = { ...prev }
          childRows.forEach((child, i) => {
            next[child.id] = targetCompanies[i] ?? null
          })
          return next
        })
      }
    } else {
      setRowTargetCompanies(prev => ({ ...prev, [drawerRowId]: targetCompanies[0] ?? null }))
    }
  }, [drawerRowId, drawerIsGroup, data])

  // Column order: Local | Functional | Reporting
  // Local block: shown in 'local' and 'all' views
  const isMultiCurrency = viewMode === 'local' || viewMode === 'all'
  // Reporting block: shown in 'all' and 'reporting' views
  const isShowAll = viewMode === 'all' || viewMode === 'reporting'

  // ── Local column animation ─────────────────────────────────
  const [mcRendered, setMcRendered] = useState(isMultiCurrency)
  const [mcColFraction, setMcColFraction] = useState(isMultiCurrency ? 1 : 0)
  const mcRafRef = useRef<number | null>(null)

  // Remove the column from the DOM synchronously (before the browser paints) when
  // isMultiCurrency becomes false. This prevents the one-frame flicker that occurred
  // because the useEffect hide path only fired after paint.
  useLayoutEffect(() => {
    if (!isMultiCurrency) {
      if (mcRafRef.current != null) { cancelAnimationFrame(mcRafRef.current); mcRafRef.current = null }
      setMcRendered(false)
      setMcColFraction(0)
    }
  }, [isMultiCurrency])

  // Slide-in animation when isMultiCurrency becomes true. Hide is handled by the
  // useLayoutEffect above, so we only need the show path here.
  useEffect(() => {
    if (!isMultiCurrency) return
    if (mcRafRef.current != null) cancelAnimationFrame(mcRafRef.current)
    const duration = 240
    const startTime = performance.now()

    setMcRendered(true)
    setMcColFraction(0)
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setMcColFraction(eased)
      if (t < 1) mcRafRef.current = requestAnimationFrame(tick)
      else { setMcColFraction(1); mcRafRef.current = null }
    }
    mcRafRef.current = requestAnimationFrame(tick)

    return () => { if (mcRafRef.current != null) cancelAnimationFrame(mcRafRef.current) }
  }, [isMultiCurrency])

  // ── Reporting column animation ─────────────────────────────
  const [repRendered, setRepRendered] = useState(isShowAll)
  const [repColFraction, setRepColFraction] = useState(isShowAll ? 1 : 0)
  const repRafRef = useRef<number | null>(null)

  useEffect(() => {
    if (repRafRef.current != null) cancelAnimationFrame(repRafRef.current)
    const duration = 240
    const startTime = performance.now()

    if (isShowAll) {
      setRepRendered(true)
      setRepColFraction(0)
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        setRepColFraction(eased)
        if (t < 1) repRafRef.current = requestAnimationFrame(tick)
        else { setRepColFraction(1); repRafRef.current = null }
      }
      repRafRef.current = requestAnimationFrame(tick)
    } else {
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        setRepColFraction(1 - eased)
        if (t < 1) repRafRef.current = requestAnimationFrame(tick)
        else { setRepColFraction(0); setRepRendered(false); repRafRef.current = null }
      }
      repRafRef.current = requestAnimationFrame(tick)
    }

    return () => { if (repRafRef.current != null) cancelAnimationFrame(repRafRef.current) }
  }, [isShowAll])

  const funcCurrency = data[0]?.functionalCurrency ?? 'MXN'
  const localCurrency = data.find(r => r.localCurrency && r.localCurrency !== r.functionalCurrency)?.localCurrency ?? 'JPY'
  const repCurrency = data[0]?.reportingCurrency ?? 'USD'
  const fw = getFinancialWidths(localCurrency)

  // Animated col widths
  const mcRecBalW = Math.round(fw.recBalance * mcColFraction)
  const mcRecItemsW = Math.round(fw.recItems * mcColFraction)
  const repPerGLW = Math.round(fw.perGL * repColFraction)
  const repRecBalW = Math.round(fw.recBalance * repColFraction)
  const repRecItemsW = Math.round(fw.recItems * repColFraction)
  const repDiffW = Math.round(fw.difference * repColFraction)

  const tableMinWidth = getTableMinWidth(mcRendered, repRendered, localCurrency, mcRecBalW, mcRecItemsW, repPerGLW, repRecBalW, repRecItemsW, repDiffW, funcRendered)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setIsScrolled(el.scrollLeft > 0)
    const atRight = el.scrollWidth - el.clientWidth - el.scrollLeft < 2
    setIsScrolledRight(atRight)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function toggleGroup(folder: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })
  }

  // 2 sticky + (2 local if mc) + (4 functional if func) + (4 reporting if rep) + 4 right
  const totalCols =
    2
    + (mcRendered ? 2 : 0)
    + (funcRendered ? 4 : 0)
    + (repRendered ? 4 : 0)
    + 4

  const mcConfiguredRows = useMemo(
    () => data.filter(r => !r.isParentRow && r.localCurrency !== r.functionalCurrency),
    [data],
  )
  const missingTagRows = useMemo(
    () => data.filter(r => !r.isParentRow && r.localCurrency === ''),
    [data],
  )

  // When parent triggers a review (from the banner above the page title), open the drawer
  useEffect(() => {
    if (!reviewTrigger) return
    const first = missingTagRows[0]
    if (first) handleSettingsClick(first.id, first.accountName, first.isParentRow, 'currency')
  }, [reviewTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Row position measurement for the Actions overlay ──────────
  const [rowPositions, setRowPositions] = useState<Array<{
    id: string
    top: number
    height: number
    isChild: boolean
    isTotal: boolean
    isExpandedParent: boolean
    accountName: string
    isParentRow: boolean
  }>>([])
  const [headerHeights, setHeaderHeights] = useState({ groupingBottom: 37, primaryBottom: 83 })

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const measure = () => {
      const containerRect = container.getBoundingClientRect()

      // +1 offsets the overlay's 1px top border so absolute children align with table TR borders
      const refTop = containerRect.top + 1

      // Measure actual header TR heights relative to refTop
      const headerTrs = container.querySelectorAll<HTMLTableRowElement>('thead tr')
      let groupingBottom = 0
      let primaryBottom = 0
      headerTrs.forEach((tr, i) => {
        const r = tr.getBoundingClientRect()
        // Math.floor (not round) because border-collapse renders the shared 1px border
        // at a sub-pixel boundary (e.g. 36.5px). Math.round would round up to 37 leaving
        // a 0.5px gap; Math.floor snaps to 36 so the overlay header div's borderTop
        // lands exactly on top of the visible table separator line.
        // When two rows: i=0 is the grouping row, i=1 is the primary row.
        // When one row (mcRendered=false): i=0 IS the primary row - always take last row.
        if (i === 0 && headerTrs.length > 1) groupingBottom = Math.floor(r.bottom - refTop)
        primaryBottom = Math.round(r.bottom - refTop)
      })
      // Always update to clear stale values when header row count changes
      if (primaryBottom > 0) setHeaderHeights({ groupingBottom, primaryBottom })

      // Data rows
      const trs = container.querySelectorAll<HTMLTableRowElement>('tr[data-row-id]')
      const positions: typeof rowPositions = []
      trs.forEach(tr => {
        const id = tr.getAttribute('data-row-id') || ''
        const isChild = tr.getAttribute('data-is-child') === 'true'
        const row = data.find(r => r.id === id)
        if (!row) return
        const rect = tr.getBoundingClientRect()
        // Parent rows with expanded group: no bottom border (group continues below)
        const isExpandedParent = row.isParentRow && expandedGroups.has(row.folder ?? '')
        positions.push({ id, top: Math.round(rect.top - refTop), height: Math.round(rect.height), isChild, isTotal: false, isExpandedParent, accountName: row.accountName, isParentRow: row.isParentRow })
      })

      // Total/footer rows
      const totalTrs = container.querySelectorAll<HTMLTableRowElement>('tr[data-total-row]')
      totalTrs.forEach(tr => {
        const rect = tr.getBoundingClientRect()
        positions.push({ id: `total-${Math.round(rect.top)}`, top: Math.round(rect.top - refTop), height: Math.round(rect.height), isChild: false, isTotal: true, isExpandedParent: false, accountName: '', isParentRow: false })
      })

      setRowPositions(positions.sort((a, b) => a.top - b.top))
    }
    measure()
    const timer = setTimeout(measure, 300)

    // Re-measure when the scroll container resizes (window resize, browser zoom, etc.)
    // Without this, rowPositions and headerHeights go stale when column widths change.
    const ro = new ResizeObserver(() => measure())
    ro.observe(container)

    return () => { clearTimeout(timer); ro.disconnect() }
  }, [data, expandedGroups, viewMode, mcRendered, repRendered]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
      <div ref={scrollRef} onScroll={handleScroll} className={`border border-[#e1e6ef] rounded-[6px] overflow-x-auto bg-white ${isScrolled ? 'is-scrolled' : ''}`}>
      <style>{`
.is-scrolled [data-sticky-account]::after {
  content: '';
  position: absolute;
  top: 0;
  right: -7px;
  bottom: 0;
  width: 7px;
  border-left: 1px solid #e1e6ef;
  background: linear-gradient(to right, rgba(0,0,0,0.06), transparent);
  pointer-events: none;
}
`}</style>
      <table
        className="border-collapse"
        style={{
          fontFamily: 'Inter, sans-serif',
          width: tableMinWidth,
          tableLayout: 'fixed',
        }}
      >
        {/* Column order: sticky | Local (animated) | Functional | Reporting (animated) | right */}
        <colgroup>
          <col style={{ width: STICKY_WIDTHS.periodFolder }} />
          <col style={{ width: STICKY_WIDTHS.account }} />
          {/* Local block (animated) */}
          {mcRendered && (
            <>
              <col style={{ width: mcRecBalW }} />
              <col style={{ width: mcRecItemsW }} />
            </>
          )}
          {/* Functional block */}
          {funcRendered && (
            <>
              <col style={{ width: fw.perGL }} />
              <col style={{ width: fw.recBalance }} />
              <col style={{ width: fw.recItems }} />
              <col style={{ width: fw.difference }} />
            </>
          )}
          {/* Reporting block (animated) */}
          {repRendered && (
            <>
              <col style={{ width: repPerGLW }} />
              <col style={{ width: repRecBalW }} />
              <col style={{ width: repRecItemsW }} />
              <col style={{ width: repDiffW }} />
            </>
          )}
          {/* Right columns */}
          <col style={{ width: RIGHT_COLS.assignees.min }} />
          <col style={{ width: RIGHT_COLS.dueDate.min }} />
          <col style={{ width: RIGHT_COLS.completed.min }} />
          <col style={{ width: actionsColWidth }} />
        </colgroup>

        {/* Row 1: column group labels (shown when more than one currency block is rendered) */}
        {((mcRendered ? 1 : 0) + (funcRendered ? 1 : 0) + (repRendered ? 1 : 0)) > 1 && (
          <thead>
            <tr className="border-b border-[#e1e6ef]" style={{ backgroundColor: '#fff' }}>
              <th style={{ ...stickyPeriod, backgroundColor: '#fff' }} />
              <th data-sticky-account="" style={{ ...stickyAccount, backgroundColor: '#fff', borderRight: mcRendered ? GROUP_BORDER : undefined }} />
              {/* Local group: hidden when local cols are off (Controller scenario) */}
              {mcRendered && <th
                colSpan={2}
                className="text-center text-[11px] font-semibold py-[8px] text-[#6b7280]"
                style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}
              >
                Workbook Balance
              </th>}
              {/* Functional group: white, bordered on right when reporting follows */}
              {funcRendered && (
                <th
                  colSpan={4}
                  className="text-center text-[11px] font-semibold py-[8px] text-[#6b7280]"
                  style={{ backgroundColor: '#fff', borderRight: repRendered ? GROUP_BORDER : undefined }}
                >
                  FloQast Tie Out
                </th>
              )}
              {/* Reporting group: gray tint (Show All only) */}
              {repRendered && (
                <th
                  colSpan={4}
                  className="text-center text-[11px] font-semibold py-[8px] text-[#6b7280]"
                  style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}
                >
                  Reporting ({repCurrency})
                </th>
              )}
              <th style={{ backgroundColor: '#fff' }} />
              <th style={{ backgroundColor: '#fff' }} />
              <th style={{ backgroundColor: '#fff' }} />
              <th style={{ backgroundColor: '#fff' }} />
            </tr>
          </thead>
        )}

        {/* Row 2: individual column labels */}
        <thead>
          <tr className="border-b border-[#e1e6ef]" style={{ backgroundColor: '#fff' }}>
            <th
              className="text-left text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]"
              style={{ ...stickyPeriod, backgroundColor: '#fff' }}
            >
              Period/ Folder
            </th>
            <th
              className="text-left text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]"
              data-sticky-account="" style={{ ...stickyAccount, backgroundColor: '#fff', borderRight: mcRendered ? GROUP_BORDER : undefined }}
            >
              Account
            </th>

            {/* Local headers */}
            {mcRendered && (
              <>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }}>Rec. Balance</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}>Rec. Items</th>
              </>
            )}

            {/* Functional headers */}
            {funcRendered && (
              <>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Per GL</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Rec. Balance</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Rec. Items</th>
                <th
                  className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]"
                  style={repRendered ? { borderRight: GROUP_BORDER } : undefined}
                >
                  Difference
                </th>
              </>
            )}

            {/* Reporting headers */}
            {repRendered && (
              <>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }}>Per GL</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }}>Rec. Balance</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }}>Rec. Items</th>
                <th className="text-right text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]" style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}>Difference</th>
              </>
            )}

            <th className="text-left text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Assignees</th>
            <th className="text-left text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Due Date</th>
            <th className="text-left text-[12px] font-semibold text-[#1b1f27] px-[16px] py-[12px]">Completed</th>
            <th style={{ position: 'sticky', right: 0, zIndex: 6, padding: 0, width: actionsColWidth, backgroundColor: 'transparent', border: 'none' }} />
          </tr>
        </thead>

        <tbody>
          {groups.map(group => (
            <GroupRows
              key={group.folder}
              group={group}
              expanded={expandedGroups.has(group.folder)}
              onToggle={() => toggleGroup(group.folder)}
              viewMode={viewMode}
              isMultiCurrency={isMultiCurrency}
              isShowAll={isShowAll}
              mcRendered={mcRendered}
              mcColFraction={mcColFraction}
              funcRendered={funcRendered}
              scenarioId={scenarioId}
              repRendered={repRendered}
              repColFraction={repColFraction}
              totalCols={totalCols}
              funcCurrency={funcCurrency}
              localCurrency={localCurrency}
              repCurrency={repCurrency}
              onSettingsClick={handleSettingsClick}
              rowTargetCompanies={rowTargetCompanies}
              fxRatesLoaded={fxRatesLoaded}
              multiCurrencyActive={multiCurrencyActive}
              showBanners={showBanners}
              actionsColWidth={actionsColWidth}
              hoveredRowId={hoveredRowId}
              onRowHover={setHoveredRowId}
            />
          ))}
        </tbody>
      </table>
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        accountName={drawerAccountName}
        isGroup={drawerIsGroup}
        onApply={handleDrawerApply}
      />
    </div>
      <ActionsOverlay
        actionsHovered={actionsHovered}
        scrolledRight={isScrolledRight}
        onEnter={handleActionsEnter}
        onLeave={handleActionsLeave}
        rowPositions={rowPositions}
        onSettingsClick={handleSettingsClick}
        mcRendered={mcRendered}
        headerGroupingBottom={headerHeights.groupingBottom}
        headerPrimaryBottom={headerHeights.primaryBottom}
        hoveredRowId={hoveredRowId}
        onRowHover={setHoveredRowId}
      />
    </div>
    </>
  )
}

// ── Group rows (folder accordion) ──────────────────────────────

function GroupRows({
  group,
  expanded,
  onToggle,
  isMultiCurrency,
  isShowAll,
  mcRendered,
  mcColFraction,
  funcRendered,
  repRendered,
  repColFraction,
  totalCols,
  scenarioId,
  funcCurrency,
  localCurrency,
  repCurrency,
  onSettingsClick,
  rowTargetCompanies,
  viewMode,
  fxRatesLoaded = true,
  multiCurrencyActive = true,
  showBanners = false,
  actionsColWidth = RIGHT_COLS.actions.min,
  hoveredRowId,
  onRowHover,
}: {
  group: RowGroup
  expanded: boolean
  onToggle: () => void
  viewMode: ViewMode
  isMultiCurrency: boolean
  isShowAll: boolean
  mcRendered: boolean
  mcColFraction: number
  funcRendered: boolean
  repRendered: boolean
  repColFraction: number
  totalCols: number
  scenarioId?: string
  funcCurrency: string
  localCurrency: string
  repCurrency: string
  onSettingsClick: (rowId: string, accountName: string, isParent: boolean, flashSection?: 'currency') => void
  rowTargetCompanies: Record<string, string | null>
  fxRatesLoaded?: boolean
  multiCurrencyActive?: boolean
  showBanners?: boolean
  actionsColWidth?: number
  hoveredRowId?: string | null
  onRowHover?: (id: string | null) => void
}) {
  const fw = getFinancialWidths(localCurrency)
  const isReporting = viewMode === 'reporting'

  const totals = useMemo(() => {
    const rows = group.rows.filter(r => !r.isParentRow && r.assignees.length === 0)
    return {
      perGL: rows.reduce((s, r) => s + (r.perGL_functional ?? 0), 0),
      recBalance: rows.reduce((s, r) => s + (r.recBalance_functional ?? 0), 0),
      recItems: rows.reduce((s, r) => s + (r.recItems_functional ?? 0), 0),
      perGL_reporting: rows.reduce((s, r) => s + (r.perGL_reporting ?? 0), 0),
      recBalance_reporting: rows.reduce((s, r) => s + (r.recBalance_reporting ?? 0), 0),
      recItems_reporting: rows.reduce((s, r) => s + (r.recItems_reporting ?? 0), 0),
      recBalance_local: rows.filter(r => r.localCurrency !== r.functionalCurrency).reduce((s, r) => s + (r.recBalance_local ?? 0), 0),
      recItems_local: rows.filter(r => r.localCurrency !== r.functionalCurrency).reduce((s, r) => s + (r.recItems_local ?? 0), 0),
      count: rows.length,
    }
  }, [group.rows])

  // Source workbook currency that contributed to the FloQast Tie Out total.
  // Used for the "* JPY -> MXN" disclaimer on aggregated remeasured totals.
  // Falls back to funcCurrency (suppressing the disclaimer) when no row needs remeasurement.
  const totalSourceCurrency =
    group.rows.find(r => !r.isParentRow && r.localCurrency && r.localCurrency !== r.functionalCurrency)?.localCurrency
    ?? funcCurrency

  // FloQast Tie Out group totals always render in functional currency, regardless of
  // the active Reporting view. The Reporting totals (below) use repCurrency instead.
  const displayPerGL = totals.perGL
  const displayRecBalance = totals.recBalance
  const displayRecItems = totals.recItems
  const displayCurrency = funcCurrency

  const nonChildRows = group.rows.filter(r => r.isParentRow || r.assignees.length > 0)
  const childRows = group.rows.filter(r => !r.isParentRow && r.assignees.length === 0)

  // Split standalone rows around the parent group so rows after the parent
  // render below the group Total row (with a divider), not above the children.
  const parentIdx = nonChildRows.findIndex(r => r.isParentRow)
  const rowsUpToParent = parentIdx >= 0 ? nonChildRows.slice(0, parentIdx + 1) : nonChildRows
  const rowsAfterParent = parentIdx >= 0 ? nonChildRows.slice(parentIdx + 1) : []

  return (
    <>
      {rowsUpToParent.map(row => (
        <DataRow
          key={row.id}
          row={row}
          viewMode={viewMode}
          isMultiCurrency={isMultiCurrency}
          isShowAll={isShowAll}
          mcRendered={mcRendered}
          mcColFraction={mcColFraction}
          funcRendered={funcRendered}
          repRendered={repRendered}
          repColFraction={repColFraction}
          localCurrency={localCurrency}
          repCurrency={repCurrency}
          onSettingsClick={onSettingsClick}
          targetCompany={rowTargetCompanies[row.id] ?? null}
          parentTotals={row.isParentRow && !expanded ? totals : undefined}
          fxRatesLoaded={fxRatesLoaded}
          multiCurrencyActive={multiCurrencyActive}
          isHovered={hoveredRowId === row.id}
          onHover={onRowHover}
        />
      ))}

      {/* Slide container - CSS grid height animation */}
      {/* clip-path clips overflow visually WITHOUT creating a scroll container */}
      <tr>
        <td colSpan={totalCols} style={{ padding: 0, border: 'none' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: expanded ? '1fr' : '0fr',
              transition: 'grid-template-rows 240ms ease',
              clipPath: 'inset(0 0 0 0)',
            }}
          >
            <div style={{ minHeight: 0 }}>
              <table
                className="border-collapse"
                style={{
                  width: '100%',
                  tableLayout: 'fixed',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {/* Inner table colgroup mirrors outer table column order */}
                <colgroup>
                  <col style={{ width: STICKY_WIDTHS.periodFolder, minWidth: STICKY_WIDTHS.periodFolder }} />
                  <col style={{ width: STICKY_WIDTHS.account, minWidth: STICKY_WIDTHS.account }} />
                  {mcRendered && (
                    <>
                      <col style={{ width: Math.round(fw.recBalance * mcColFraction) }} />
                      <col style={{ width: Math.round(fw.recItems * mcColFraction) }} />
                    </>
                  )}
                  <col style={{ width: fw.perGL, minWidth: fw.perGL }} />
                  <col style={{ width: fw.recBalance, minWidth: fw.recBalance }} />
                  <col style={{ width: fw.recItems, minWidth: fw.recItems }} />
                  <col style={{ width: fw.difference, minWidth: fw.difference }} />
                  {repRendered && (
                    <>
                      <col style={{ width: Math.round(fw.perGL * repColFraction) }} />
                      <col style={{ width: Math.round(fw.recBalance * repColFraction) }} />
                      <col style={{ width: Math.round(fw.recItems * repColFraction) }} />
                      <col style={{ width: Math.round(fw.difference * repColFraction) }} />
                    </>
                  )}
                  <col style={{ width: RIGHT_COLS.assignees.min }} />
                  <col style={{ width: RIGHT_COLS.dueDate.min }} />
                  <col style={{ width: RIGHT_COLS.completed.min }} />
                  <col style={{ width: actionsColWidth }} />
                </colgroup>
                <tbody>
                  {childRows.map(row => (
                    <DataRow
                      key={row.id}
                      row={row}
                      viewMode={viewMode}
                      isMultiCurrency={isMultiCurrency}
                      isShowAll={isShowAll}
                      mcRendered={mcRendered}
                      mcColFraction={mcColFraction}
                      funcRendered={funcRendered}
              scenarioId={scenarioId}
                      repRendered={repRendered}
                      repColFraction={repColFraction}
                      localCurrency={localCurrency}
                      repCurrency={repCurrency}
                      onSettingsClick={onSettingsClick}
                      targetCompany={rowTargetCompanies[row.id] ?? null}
                      fxRatesLoaded={fxRatesLoaded}
                      multiCurrencyActive={multiCurrencyActive}
                      showBanners={showBanners}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>

      {/* Footer / Total row */}
      <tr className="bg-white hover:bg-[#f8fafc]" data-total-row="true">
        <td style={{ ...stickyPeriod, backgroundColor: 'inherit' }} />
        <td className="px-[16px] py-[12px]" data-sticky-account="" style={{ ...stickyAccount, backgroundColor: 'inherit', borderTop: '1px solid #eef0f4', borderRight: mcRendered ? GROUP_BORDER : undefined }}>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium text-[#1d2433]">Total</span>
            <button
              onClick={onToggle}
              className="flex items-center gap-[4px] text-[12px] text-[#3b82f6] font-medium hover:underline"
            >
              <span className="material-icons-outlined" style={{ fontSize: 16, color: '#3b82f6' }}>schema</span>
              {expanded ? 'Close Group' : 'Expand Group'}
            </button>
          </div>
        </td>
        {expanded ? (
          <>
            {/* Local totals */}
            {mcRendered && (
              <>
                <TotalCell value={totals.recBalance_local} currency={localCurrency} tinted borderTop style={{ overflow: 'hidden' }} />
                <TotalCell value={totals.recItems_local} currency={localCurrency} tinted borderTop style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
            {/* Functional totals - aggregated from FloQast-remeasured values.
                Disclaimer suppresses itself when source equals display (no remeasurement). */}
            {funcRendered && (
              <>
                <TotalCell value={displayPerGL} currency={displayCurrency} borderTop />
                <TotalCell value={displayRecBalance} currency={displayCurrency} borderTop
                  disclaimer={totalSourceCurrency !== funcCurrency && multiCurrencyActive}
                  disclaimerType="remeasurement"
                  disclaimerFrom={totalSourceCurrency}
                  disclaimerTo={funcCurrency}
                />
                <TotalCell value={displayRecItems} currency={displayCurrency} borderTop
                  disclaimer={totalSourceCurrency !== funcCurrency && multiCurrencyActive}
                  disclaimerType="remeasurement"
                  disclaimerFrom={totalSourceCurrency}
                  disclaimerTo={funcCurrency}
                />
                <TotalCell value={(displayPerGL ?? 0) - (displayRecBalance ?? 0) - (displayRecItems ?? 0)} currency={displayCurrency} borderTop
                  style={repRendered ? { borderRight: GROUP_BORDER } : undefined}
                />
              </>
            )}
            {/* Reporting totals - aggregated functional values translated to reporting
                currency. Source = funcCurrency (not the original local) because the total
                rolls up rows with potentially different locals through the functional step. */}
            {repRendered && (
              <>
                <TotalCell value={totals.perGL_reporting} currency={repCurrency} tinted borderTop style={{ overflow: 'hidden' }} />
                <TotalCell value={totals.recBalance_reporting} currency={repCurrency} tinted borderTop
                  disclaimer={funcCurrency !== repCurrency}
                  disclaimerType="translation"
                  disclaimerFrom={funcCurrency}
                  disclaimerTo={repCurrency}
                  style={{ overflow: 'hidden' }}
                />
                <TotalCell value={totals.recItems_reporting} currency={repCurrency} tinted borderTop
                  disclaimer={funcCurrency !== repCurrency}
                  disclaimerType="translation"
                  disclaimerFrom={funcCurrency}
                  disclaimerTo={repCurrency}
                  style={{ overflow: 'hidden' }}
                />
                <TotalCell value={(totals.perGL_reporting ?? 0) - (totals.recBalance_reporting ?? 0) - (totals.recItems_reporting ?? 0)} currency={repCurrency} tinted borderTop
                  style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }}
                />
              </>
            )}
          </>
        ) : (
          <>
            {mcRendered && (
              <>
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
            <td style={{ borderTop: '1px solid #eef0f4' }} />
            <td style={{ borderTop: '1px solid #eef0f4' }} />
            <td style={{ borderTop: '1px solid #eef0f4' }} />
            <td style={{ borderTop: '1px solid #eef0f4', ...(repRendered ? { borderRight: GROUP_BORDER } : {}) }} />
            {repRendered && (
              <>
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ borderTop: '1px solid #eef0f4', backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
          </>
        )}

        <td colSpan={4} />
      </tr>

      {/* Standalone rows after the parent group, separated by a full-width rule */}
      {rowsAfterParent.length > 0 && (
        <>
          <tr>
            <td colSpan={totalCols} style={{ padding: 0, height: 0, borderTop: '1px solid #e1e6ef' }} />
          </tr>
          {rowsAfterParent.map(row => (
            <DataRow
              key={row.id}
              row={row}
              viewMode={viewMode}
              isMultiCurrency={isMultiCurrency}
              isShowAll={isShowAll}
              mcRendered={mcRendered}
              mcColFraction={mcColFraction}
              funcRendered={funcRendered}
              scenarioId={scenarioId}
              repRendered={repRendered}
              repColFraction={repColFraction}
              localCurrency={localCurrency}
              repCurrency={repCurrency}
              onSettingsClick={onSettingsClick}
              targetCompany={rowTargetCompanies[row.id] ?? null}
              fxRatesLoaded={fxRatesLoaded}
              multiCurrencyActive={multiCurrencyActive}
              isHovered={hoveredRowId === row.id}
              onHover={onRowHover}
            />
          ))}
        </>
      )}
    </>
  )
}

// Single data row

interface ParentTotals {
  perGL: number
  recBalance: number
  recItems: number
  perGL_reporting: number
  recBalance_reporting: number
  recItems_reporting: number
  recBalance_local: number
  recItems_local: number
  count: number
}

function DataRow({
  row, viewMode, isMultiCurrency, isShowAll, mcRendered, mcColFraction,
  funcRendered, repRendered, repColFraction, localCurrency, repCurrency, scenarioId,
  onSettingsClick, targetCompany, parentTotals, fxRatesLoaded = true,
  multiCurrencyActive = true, showBanners = false, isHovered = false, onHover,
}: {
  row: ReconciliationRow
  viewMode: ViewMode
  isMultiCurrency: boolean
  isShowAll: boolean
  mcRendered: boolean
  mcColFraction: number
  funcRendered: boolean
  repRendered: boolean
  repColFraction: number
  localCurrency: string
  repCurrency: string
  onSettingsClick: (rowId: string, accountName: string, isParent: boolean, flashSection?: 'currency') => void
  targetCompany: string | null
  parentTotals?: ParentTotals
  fxRatesLoaded?: boolean
  multiCurrencyActive?: boolean
  showBanners?: boolean
  isHovered?: boolean
  onHover?: (id: string | null) => void
  scenarioId?: string
}) {
  const isReporting = viewMode === 'reporting'
  // rec-005 (1020) is shown in an "untagged" state in the Preparer demo so we
  // can demo the "Tag currencies" hint. Drives blank Workbook Balance / FloQast
  // Tie Out cells and the hint in the Account column.
  const isUntaggedDemo = scenarioId === 'preparer' && row.id === 'rec-005'
  const showTagCurrenciesHint = isUntaggedDemo && showBanners
  const funcCurrency = row.functionalCurrency
  const hasLocalValues = row.recBalance_local != null
  const needsRemeasurement = row.localCurrency !== row.functionalCurrency && row.recBalance_local != null

  // FloQast Tie Out columns always render in functional currency, regardless of the
  // active Reporting view. The Reporting column group is the only place that reflects
  // the selected reporting currency.
  const displayCurrency = funcCurrency
  const displayPerGL = row.perGL_functional
  const displayRecBalance = row.recBalance_functional
  const displayRecItems = row.recItems_functional

  const targetCurrencyKey = targetCompany ? companyToCurrency(targetCompany) : null
  const isTranslated = !isReporting && targetCurrencyKey && targetCurrencyKey !== FUNCTIONAL_CURRENCY
  const fx = isTranslated ? FX_RATES[targetCurrencyKey] : null
  const funcFx = FX_RATES[FUNCTIONAL_CURRENCY]

  function convertValue(usdValue: number | null): number | null {
    if (usdValue == null || !fx) return usdValue
    return usdValue * fx.rate
  }

  const isChildRow = !row.isParentRow && row.assignees.length === 0
  const isGroupedRow = row.isParentRow || isChildRow
  const cellBorder = isGroupedRow ? '1px solid #eef0f4' : undefined

  // Suppress asterisks and conversion labels when MC features are inactive (Admin pre-setup).
  const funcRecDisclaimer = needsRemeasurement && multiCurrencyActive

  const rowBg = isHovered ? '#f8fafc' : '#ffffff'

  return (
    <tr
      data-row-id={row.id}
      data-is-child={isChildRow ? 'true' : 'false'}
      className={isGroupedRow ? undefined : 'border-b border-[#e1e6ef]'}
      style={{ backgroundColor: rowBg }}
      onMouseEnter={() => onHover?.(row.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Period / Folder */}
      <td className="px-[16px] py-[10px] align-top" style={{ ...stickyPeriod, backgroundColor: 'inherit' }}>
        {!isChildRow ? (
          <div className="text-[12px] text-[#1d2433] leading-[18px]">
            <span className="font-semibold">{row.period}:</span>
            <br />
            {row.folder}
          </div>
        ) : null}
      </td>

      {/* Account */}
      <td className="px-[16px] py-[10px] align-top" data-sticky-account="" style={{ ...stickyAccount, backgroundColor: 'inherit', borderTop: cellBorder, borderRight: mcRendered ? GROUP_BORDER : undefined }}>
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-start gap-[4px] w-full">
            <span className="flex-1 min-w-0 text-[12px] font-medium text-[#1d2433] leading-[18px]">
              {row.accountName}
            </span>
          </div>
          {row.isParentRow ? (
            parentTotals && (
              <span className="text-[11px] text-[#6b7280] leading-[16px]">
                {parentTotals.count} Account{parentTotals.count !== 1 ? 's' : ''}
              </span>
            )
          ) : (
            <>
              <span className="text-[11px] text-[#6b7280] leading-[16px]">
                <span className="font-semibold">Company:</span> {row.entityName}
              </span>
              {(row.accountType !== 'Standard' || row.controls) && (
                <span className="text-[11px] text-[#6b7280] leading-[16px]">
                  <span className="font-semibold">Reporting Book:</span> GAAP Accounting, (No Value)
                </span>
              )}
              <span className="text-[11px] text-[#6b7280] leading-[16px]">
                <span className="font-semibold">Bank Account:</span> {row.tags.includes('Bank') ? 'BofA' : '(No Value)'}
              </span>
              {row.controls && (
                <span className="text-[11px] text-[#6b7280] leading-[16px]">
                  <span className="font-semibold">Revenue Category:</span> Opex
                </span>
              )}
              {targetCompany && (
                <span className="text-[11px] text-[#6b7280] leading-[16px]">
                  <span className="font-semibold">Target Company:</span> {targetCompany}
                </span>
              )}
            </>
          )}
          <div className="flex items-center gap-[4px] mt-[2px]">
            <span className="text-[10px] text-[#94a3b8]">#FQ-adf2304-123213</span>
            <CopyIcon />
          </div>
          {/* "Tag currencies" hint - shown only on untagged accounts in the
              Preparer demo flow. The ⓘ icon shows a real hover tooltip
              (HintTooltip) instead of the browser default. */}
          {showTagCurrenciesHint && (
            <div className="flex items-center gap-[4px] mt-[2px]">
              <HintTooltip text="Add #FQ(JPY) to your workbook to track foreign currency balances here.">
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: 12, color: '#3b82f6', cursor: 'default' }}
                >info</span>
              </HintTooltip>
              <span className="text-[10px] text-[#3b82f6]">Tag currencies</span>
            </div>
          )}
        </div>
      </td>

      {/* Column order: Local | Functional | Reporting */}
      {row.isParentRow ? (
        parentTotals ? (
          <>
            {/* Local block */}
            {mcRendered && (
              parentTotals.recBalance_local !== 0 ? (
                <>
                  <CurrencyCell value={parentTotals.recBalance_local} currency={localCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ overflow: 'hidden' }} />
                  <CurrencyCell value={parentTotals.recItems_local} currency={localCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }} />
                </>
              ) : (
                <>
                  <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, overflow: 'hidden' }}>-</td>
                  <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}>-</td>
                </>
              )
            )}
            {/* Functional block - always functional currency, never affected by Reporting view */}
            {funcRendered && (
              <>
                <CurrencyCell value={parentTotals.perGL} currency={displayCurrency} borderTop={cellBorder} />
                <CurrencyCell value={parentTotals.recBalance} currency={displayCurrency} borderTop={cellBorder} />
                <CurrencyCell value={parentTotals.recItems} currency={displayCurrency} borderTop={cellBorder} />
                <CurrencyCell value={(parentTotals.perGL ?? 0) - (parentTotals.recBalance ?? 0) - (parentTotals.recItems ?? 0)} currency={displayCurrency} borderTop={cellBorder} style={repRendered ? { borderRight: GROUP_BORDER } : undefined} />
              </>
            )}
            {/* Reporting block */}
            {repRendered && (
              <>
                <CurrencyCell value={parentTotals.perGL_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={parentTotals.recBalance_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} disclaimer disclaimerType="translation" disclaimerFrom={displayCurrency} disclaimerTo={repCurrency} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={parentTotals.recItems_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} disclaimer disclaimerType="translation" disclaimerFrom={displayCurrency} disclaimerTo={repCurrency} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={(parentTotals.perGL_reporting ?? 0) - (parentTotals.recBalance_reporting ?? 0) - (parentTotals.recItems_reporting ?? 0)} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
          </>
        ) : (
          <>
            {mcRendered && (
              <>
                <td style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
            <td colSpan={4} style={repRendered ? { borderRight: GROUP_BORDER } : undefined} />
            {repRendered && (
              <>
                <td style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ backgroundColor: TINTED_BG, overflow: 'hidden' }} />
                <td style={{ backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )}
          </>
        )
      ) : (
        <>
          {/* Local block - Workbook Balance values are independent of FX rate
              availability. No error state here even when rates are missing. */}
          {mcRendered && (
            isUntaggedDemo ? (
              /* Untagged account in Preparer demo: blank cells. */
              <>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, overflow: 'hidden' }}>-</td>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}>-</td>
              </>
            ) : hasLocalValues ? (
              <>
                {/* Row 1010 (rec-004) has workbook uploads in 5 currencies.
                    The Rec. Balance cell expands to a multi-currency view with
                    a popover for the full breakdown. */}
                {row.id === 'rec-004' ? (
                  <WorkbookMultiCurrencyCell borderTop={cellBorder} bgColor={TINTED_BG} />
                ) : (
                  <CurrencyCell value={row.recBalance_local} currency={row.localCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ overflow: 'hidden' }} />
                )}
                {row.id === 'rec-004' ? (
                  <WorkbookRecItemsCell borderTop={cellBorder} bgColor={TINTED_BG} borderRight={GROUP_BORDER} />
                ) : (
                  <CurrencyCell value={row.recItems_local} currency={row.localCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }} />
                )}
              </>
            ) : row.localCurrency === '' ? (
              <>
                <AddCurrencyTagCell borderTop={cellBorder} onClick={() => onSettingsClick(row.id, row.accountName, row.isParentRow, 'currency')} />
                <AddCurrencyTagCell borderTop={cellBorder} borderRight={GROUP_BORDER} onClick={() => onSettingsClick(row.id, row.accountName, row.isParentRow, 'currency')} />
              </>
            ) : (
              <>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, overflow: 'hidden' }}>-</td>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, backgroundColor: TINTED_BG, borderRight: GROUP_BORDER, overflow: 'hidden' }}>-</td>
              </>
            )
          )}

          {/* Functional block */}
          {funcRendered && (
            isUntaggedDemo ? (
              /* Untagged account in Preparer demo: Per GL shown, Rec. Balance,
                 Rec. Items, Difference remain blank. */
              <>
                <CurrencyCell value={displayPerGL} currency={displayCurrency} borderTop={cellBorder} />
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, overflow: 'hidden' }}>-</td>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, overflow: 'hidden' }}>-</td>
                <td className="text-right px-[16px] py-[10px] text-[12px] text-[#94a3b8]" style={{ borderTop: cellBorder, overflow: 'hidden', ...(repRendered ? { borderRight: GROUP_BORDER } : {}) }}>-</td>
              </>
            ) : !fxRatesLoaded && needsRemeasurement && multiCurrencyActive ? (
              <>
                <CurrencyCell value={displayPerGL} currency={displayCurrency} borderTop={cellBorder} />
                <RateNaCell borderTop={cellBorder} />
                <RateNaCell borderTop={cellBorder} />
                <CurrencyCell
                  value={null}
                  currency={displayCurrency}
                  borderTop={cellBorder}
                  style={repRendered ? { borderRight: GROUP_BORDER } : undefined}
                />
              </>
            ) : (
              <>
                <CurrencyCell value={isReporting ? displayPerGL : convertValue(displayPerGL)} currency={isTranslated && fx ? fx.code : displayCurrency} borderTop={cellBorder} />
                {/* Row 1010 (rec-004) shows the aggregated converted total of its
                    multi-currency workbook (sum of all 5 currencies converted to MXN).
                    No popover or "Show details" affordance per spec. */}
                {row.id === 'rec-004' ? (
                  <CurrencyCell
                    value={ROW_1010_TOTAL_MXN}
                    currency={ROW_1010_FUNCTIONAL_CURRENCY}
                    borderTop={cellBorder}
                    disclaimer={multiCurrencyActive}
                    disclaimerType="remeasurement"
                    disclaimerFrom="Multiple"
                    disclaimerTo={funcCurrency}
                    disclaimerSourceCurrencies={ROW_1010_SOURCE_CURRENCIES}
                  />
                ) : (
                  <CurrencyCell
                    value={isReporting ? displayRecBalance : convertValue(displayRecBalance)}
                    currency={isTranslated && fx ? fx.code : displayCurrency}
                    borderTop={cellBorder}
                    translationBadge={isTranslated && fx && funcFx ? { from: funcFx.code, to: fx.code, targetCompany: targetCompany!, rate: fx.rateDisplay, fromCode: funcFx.code } : undefined}
                    disclaimer={funcRecDisclaimer}
                    disclaimerType="remeasurement"
                    disclaimerFrom={row.localCurrency}
                    disclaimerTo={funcCurrency}
                  />
                )}
                <CurrencyCell
                  value={isReporting ? displayRecItems : convertValue(displayRecItems)}
                  currency={isTranslated && fx ? fx.code : displayCurrency}
                  borderTop={cellBorder}
                  disclaimer={funcRecDisclaimer}
                  disclaimerType="remeasurement"
                  disclaimerFrom={row.localCurrency}
                  disclaimerTo={funcCurrency}
                />
                <CurrencyCell
                  value={(() => { const pg = isReporting ? displayPerGL : convertValue(displayPerGL); const rb = isReporting ? displayRecBalance : convertValue(displayRecBalance); const ri = isReporting ? displayRecItems : convertValue(displayRecItems); return pg != null && rb != null ? pg - rb - (ri ?? 0) : null })()}
                  currency={isTranslated && fx ? fx.code : displayCurrency}
                  borderTop={cellBorder}
                  style={repRendered ? { borderRight: GROUP_BORDER } : undefined}
                />
              </>
            )
          )}

          {/* Reporting block */}
          {repRendered && (
            !fxRatesLoaded && needsRemeasurement && multiCurrencyActive ? (
              /* Per GL comes from the ERP and is always available in local currency.
                 Computed columns (Rec Balance, Rec Items, Difference) still require
                 an FX rate to render in the reporting currency. */
              <>
                <CurrencyCell value={row.perGL_local} currency={row.localCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ overflow: 'hidden' }} />
                <RateNaCell borderTop={cellBorder} bgColor={TINTED_BG} />
                <RateNaCell borderTop={cellBorder} bgColor={TINTED_BG} />
                <RateNaCell borderTop={cellBorder} bgColor={TINTED_BG} borderRight={GROUP_BORDER} />
              </>
            ) : (
              <>
                <CurrencyCell value={row.perGL_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={row.recBalance_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} disclaimer={row.localCurrency !== repCurrency} disclaimerType="translation" disclaimerFrom={row.localCurrency} disclaimerTo={repCurrency} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={row.recItems_reporting} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} disclaimer={row.localCurrency !== repCurrency} disclaimerType="translation" disclaimerFrom={row.localCurrency} disclaimerTo={repCurrency} style={{ overflow: 'hidden' }} />
                <CurrencyCell value={row.perGL_reporting != null ? (row.perGL_reporting ?? 0) - (row.recBalance_reporting ?? 0) - (row.recItems_reporting ?? 0) : null} currency={repCurrency} borderTop={cellBorder} bgColor={TINTED_BG} style={{ borderRight: GROUP_BORDER, overflow: 'hidden' }} />
              </>
            )
          )}
        </>
      )}

      {/* Assignees */}
      <td className="px-[16px] py-[10px] align-top">
        <div className="flex flex-col gap-[16px]">
          {row.assignees.slice(0, 2).map((a, i) => (
            <AssigneeCell key={i} assignee={a} />
          ))}
        </div>
      </td>

      {/* Due Date */}
      <td className="px-[16px] py-[10px] align-top">
        <div className="flex flex-col gap-[16px]">
          {row.assignees.slice(0, 2).map((_, i) => (
            <div key={i} className="h-[28px] flex items-center">
              <span className="text-[12px] text-[#1d2433] leading-[18px]">
                {row.dueDate}
              </span>
            </div>
          ))}
        </div>
      </td>

      {/* Completed */}
      <td className="px-[16px] py-[10px] align-top">
        <div className="flex flex-col gap-[16px]">
          {row.assignees.slice(0, 2).map((a, i) => (
            <CompletedCell key={i} assignee={a} />
          ))}
        </div>
      </td>

      {/* Actions spacer - visual content provided by ActionsOverlay */}
      <td style={{ position: 'sticky', right: 0, padding: 0, zIndex: 4, backgroundColor: 'transparent', border: 'none' }} />
    </tr>
  )
}

// ── Cell components ────────────────────────────────────────────

interface TranslationBadge {
  from: string
  to: string
  targetCompany: string
  rate: string
  fromCode: string
}

const PERIOD_END = 'Oct 31, 2025'

// Demo FX rates for tooltip rate lines
// Only rates explicitly uploaded by the admin are included here.
// Cross-rates (e.g. JPY-MXN derived from JPY-USD + USD-MXN) are intentionally absent.
export const DEMO_FX_RATE_MAP: Record<string, string> = {
  'MXN-USD': '0.0464',
  'USD-MXN': '21.5517',
  'JPY-USD': '0.0069',
  'USD-JPY': '144.9275',
  'GBP-USD': '1.2654',
  'USD-GBP': '0.7903',
  'EUR-USD': '1.0821',
  'USD-EUR': '0.9241',
  'CAD-USD': '0.7321',
  'USD-CAD': '1.3659',
}

// Effective conversion rates used for popover display. Includes cross-currency pairs
// that FloQast derives internally via the USD pivot (not shown on the FX Rates page).
// Rates: JPY→MXN = 0.0069 × 21.5517, EUR→MXN = 1.0821 × 21.5517, etc.
const DEMO_EFFECTIVE_RATES: Record<string, string> = {
  ...DEMO_FX_RATE_MAP,
  'JPY-MXN': '0.1487',
  'MXN-JPY': '6.7249',
  'EUR-MXN': '23.32',
  'MXN-EUR': '0.0429',
  'GBP-MXN': '27.27',
  'MXN-GBP': '0.0367',
  'CAD-MXN': '15.78',
  'MXN-CAD': '0.0634',
}

// Period-end date shown once below the rate table in the Converted Balance popover
const PERIOD_END_LABEL = 'Oct 31, 2025'

// Demo converted MXN amounts for the "Multiple" popover (row 1010).
// Shown in the detailed view when the user clicks "Show amounts".
const DEMO_ROW_1010_AMOUNTS: Record<string, string> = {
  'JPY': '2,344,268',
  'EUR': '191,224',
  'GBP': '84,537',
  'CAD': '173,580',
}

function DisclaimerTooltip({
  type = 'translation',
  fromCurrency,
  toCurrency,
  sourceCurrencies,
}: {
  type?: 'remeasurement' | 'translation'
  fromCurrency?: string
  toCurrency?: string
  /** For the "Multiple" case: the individual source currencies to list rates for. */
  sourceCurrencies?: string[]
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [showAmounts, setShowAmounts] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Reset amounts toggle whenever the popover closes
  useEffect(() => {
    if (!open) setShowAmounts(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (
        cardRef.current && !cardRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 })
    }
    setOpen(prev => !prev)
  }

  const isMultiple = fromCurrency === 'Multiple' && sourceCurrencies && sourceCurrencies.length > 0
  // Single conversion: look up the direct rate pair
  const rateKey = !isMultiple && fromCurrency && toCurrency ? `${fromCurrency}-${toCurrency}` : null
  const rateValue = rateKey ? DEMO_EFFECTIVE_RATES[rateKey] : null

  const title = 'Converted Balance'

  // Rate lines - table rows: FROM | → | TO | rate (right-aligned)
  const rateLines: { from: string; to: string; rate: string }[] = isMultiple
    ? sourceCurrencies!.flatMap(src => {
        const key = `${src}-${toCurrency}`
        const r = DEMO_EFFECTIVE_RATES[key]
        return r && toCurrency ? [{ from: src, to: toCurrency, rate: r }] : []
      })
    : rateValue && fromCurrency && toCurrency
      ? [{ from: fromCurrency, to: toCurrency, rate: rateValue }]
      : []

  const INTER = 'Inter, sans-serif'
  const MUSEO = "'Museo Sans', sans-serif"

  // For the "Multiple" case, show first source currency + remaining count
  const displayFrom = isMultiple && sourceCurrencies && sourceCurrencies.length > 0
    ? `${sourceCurrencies[0]} (+${sourceCurrencies.length - 1})`
    : fromCurrency

  return (
    <span
      ref={triggerRef}
      onClick={handleClick}
      className="inline-flex items-center gap-[2px]"
      style={{ fontSize: 10, lineHeight: '14px', color: '#94a3b8', cursor: 'pointer' }}
    >
      <span>{displayFrom}</span>
      <span style={{ fontSize: 9 }}>{'→'}</span>
      <span>{toCurrency}</span>
      {open && pos && createPortal(
        <div
          ref={cardRef}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            background: 'white',
            border: '1px solid #e1e6ef',
            borderRadius: 6,
            boxShadow: '0px 1px 2px rgba(0,0,0,0.05), 0px 8px 20px rgba(0,0,0,0.1)',
            width: 300,
            whiteSpace: 'normal',
            textAlign: 'left',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '12px 16px',
            borderBottom: '1px solid #e1e6ef',
          }}>
            <p style={{
              flex: 1, margin: 0,
              fontFamily: MUSEO, fontWeight: 700, fontSize: 16, lineHeight: '20px',
              color: '#1d2433', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {title}
            </p>
            <button
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20, padding: 0, border: 'none',
                background: 'transparent', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <span className="material-icons-outlined" style={{ fontSize: 16, color: '#6b7280' }}>close</span>
            </button>
          </div>
          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Rate table rows: FROM | arrow | TO | rate | [amount] */}
            {rateLines.length > 0 && (
              <div>
                {rateLines.map((line, i) => {
                  const amount = DEMO_ROW_1010_AMOUNTS[line.from]
                  return (
                    <div
                      key={`${line.from}-${line.to}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 16px',
                        borderBottom: i < rateLines.length - 1 ? '1px solid #eef0f4' : undefined,
                      }}
                    >
                      <span style={{ width: 36, flexShrink: 0, fontFamily: INTER, fontWeight: 600, fontSize: 12, lineHeight: '18px', color: '#1d2433' }}>{line.from}</span>
                      <span style={{ fontFamily: INTER, fontSize: 12, lineHeight: '18px', color: '#9ca3af', flexShrink: 0 }}>{'→'}</span>
                      <span style={{ flex: 1, fontFamily: INTER, fontWeight: 500, fontSize: 12, lineHeight: '18px', color: '#1d2433' }}>{line.to}</span>
                      {/* Rate: muted gray, fixed width */}
                      <span style={{ width: 44, textAlign: 'right', fontFamily: INTER, fontWeight: 400, fontSize: 12, lineHeight: '18px', color: '#6b7280', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{line.rate}</span>
                      {/* Amounts column - extra left margin separates it from the rate column */}
                      {isMultiple && showAmounts && (
                        <span style={{ width: 76, textAlign: 'right', marginLeft: 12, fontFamily: INTER, fontWeight: 400, fontSize: 12, lineHeight: '18px', color: '#1d2433', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                          {amount ? `${amount}*` : ''}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {/* Footer: period label + See all rates (left) / Show-Hide amounts toggle (right) */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #e1e6ef' }}>
              <p style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontSize: 11, lineHeight: '16px', color: '#9ca3af' }}>
                Period end, {PERIOD_END_LABEL}
              </p>
              {type === 'translation' && (
                <p style={{ margin: 0, fontFamily: INTER, fontWeight: 400, fontSize: 11, lineHeight: '16px', color: '#9ca3af' }}>
                  Informational only. Balances are converted using your uploaded period-end rates.
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  onClick={() => {
                    setOpen(false)
                    window.dispatchEvent(new Event('navigate-to-fx-rates'))
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                >
                  <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 12, lineHeight: '18px', color: '#1d2433', textDecoration: 'underline' }}>
                    See all rates
                  </span>
                  <span className="material-icons-outlined" style={{ fontSize: 14, color: '#1d2433' }}>chevron_right</span>
                </div>
                {isMultiple && (
                  <button
                    onClick={e => { e.stopPropagation(); setShowAmounts(prev => !prev) }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: INTER, fontWeight: 400, fontSize: 12, lineHeight: '18px', color: '#9ca3af' }}
                  >
                    {showAmounts ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </span>
  )
}

function TranslationInfoPopover({ badge }: { badge: TranslationBadge }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleOpen(e: React.MouseEvent) {
    e.stopPropagation()
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.top - 6, left: rect.right - 280 })
    }
    setOpen(!open)
  }

  return (
    <span ref={ref} style={{ display: 'inline-flex' }}>
      <span
        ref={triggerRef}
        className="material-icons-outlined"
        style={{ fontSize: 12, color: '#9ca3af', cursor: 'pointer' }}
        onClick={handleOpen}
      >
        info
      </span>
      {open && pos && (
        <div style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          transform: 'translateY(-100%)',
          background: 'white', border: '1px solid #e1e6ef', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '12px 14px',
          width: 280, whiteSpace: 'normal', textAlign: 'left',
        }}>
          <p style={{ fontSize: 12, lineHeight: '18px', color: '#1d2433', margin: 0 }}>
            This balance has been converted to the reporting currency of {badge.targetCompany}.
          </p>
          <p style={{ fontSize: 11, lineHeight: '16px', color: '#6b7280', margin: '6px 0 0' }}>
            Rate: 1 {badge.fromCode} = {badge.rate} {badge.to} · As of {PERIOD_END}
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e1e6ef', margin: '10px 0' }} />
          <p style={{ fontSize: 11, lineHeight: '16px', color: '#9ca3af', margin: 0 }}>
            Calculated by FloQast using your uploaded FX rate. For reference only - not from your GL.
          </p>
        </div>
      )}
    </span>
  )
}

// Shown in functional columns when local values exist but no FX rate is uploaded
/**
 * Lightweight hover tooltip - portal-rendered card above the trigger child.
 * Replaces the browser default `title` tooltip (which is slow and forces a
 * help cursor). Uses pointer events so the cursor stays default.
 */
function HintTooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  function handleEnter() {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 })
    }
    setOpen(true)
  }
  function handleLeave() {
    setOpen(false)
  }

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {children}
      {open && pos && createPortal(
        <div
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            background: '#1d2433',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 4,
            fontSize: 11,
            lineHeight: '16px',
            fontFamily: 'Inter, sans-serif',
            maxWidth: 240,
            whiteSpace: 'normal',
            pointerEvents: 'none',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {text}
        </div>,
        document.body,
      )}
    </span>
  )
}

function RateNaCell({ borderTop, borderRight, bgColor }: { borderTop?: string; borderRight?: string; bgColor?: string }) {
  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ borderTop, borderRight, backgroundColor: bgColor, overflow: 'hidden' }}
    >
      <span style={{ fontSize: 12, lineHeight: '18px', color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
        Rate unavailable
      </span>
    </td>
  )
}

// Shown in the group Total row when some (or all) child rows couldn't be converted
// because rates were unavailable. Matches the translation prototype's "Partial conversion"
// amber badge pattern (FlowUI warning Badge - node 4137:101082).
function UnavailableAggregateCell({ borderTop, borderRight, bgColor }: { borderTop?: string; borderRight?: string; bgColor?: string }) {
  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ borderTop, borderRight, backgroundColor: bgColor, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
        <span style={{ fontSize: 12, lineHeight: '18px', color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>–</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span className="material-icons-outlined" style={{ fontSize: 12, color: '#db7712' }}>report_problem</span>
          <span style={{
            background: '#fff8eb', border: '1px solid #db7712', borderRadius: 4,
            padding: '1px 5px', fontSize: 11, lineHeight: '16px',
            color: '#db7712', fontWeight: 500, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}>
            Unconverted
          </span>
        </div>
      </div>
    </td>
  )
}

function AddCurrencyTagCell({ borderTop, borderRight, onClick }: { borderTop?: string; borderRight?: string; onClick?: () => void }) {
  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ borderTop, borderRight, backgroundColor: TINTED_BG, overflow: 'hidden' }}
    >
      <button
        onClick={onClick}
        className="text-[12px] leading-[18px] text-[#6b7280] hover:text-[#1d2433]"
      >
        + Add currency tag
      </button>
    </td>
  )
}

// ── Multi-currency workbook breakdown (row 1010 / rec-004) ────────────
// The 1010 account has workbook uploads in 5 different currencies. The
// Rec. Balance cell shows the top two values with a "Show N more" link
// that opens a popover with the full breakdown.
const ROW_1010_BREAKDOWN = [
  { code: 'MXN', value: 20000,    converted: null,  isFunctional: true },
  { code: 'JPY', value: 15767245, converted: 12400 },
  { code: 'EUR', value: 8200,     converted: 6800 },
  { code: 'GBP', value: 3100,     converted: 5200 },
  { code: 'CAD', value: 11000,    converted: 3600 },
] as const

const ROW_1010_TOTAL_MXN = 48000
const ROW_1010_FUNCTIONAL_CURRENCY = 'MXN'
// Non-functional source currencies in the row 1010 workbook breakdown.
// Passed to DisclaimerTooltip as sourceCurrencies for the "Multiple" popover.
const ROW_1010_SOURCE_CURRENCIES: string[] = ROW_1010_BREAKDOWN
  .filter(r => !('isFunctional' in r && r.isFunctional))
  .map(r => r.code as string)

// Rec. Items breakdown for row 1010 - 4 currencies, raw values only.
const ROW_1010_REC_ITEMS_BREAKDOWN = [
  { code: 'JPY', value: 48000 },
  { code: 'EUR', value: 1200 },
  { code: 'GBP', value: 500 },
  { code: 'CAD', value: 800 },
] as const

/**
 * Shared popover card chrome - header + subtitle + close button + portal positioning.
 * The body grid is supplied by the caller so Workbook Balance and FloQast Tie Out
 * can share the same shell with different row layouts.
 */
function MultiCurrencyPopover({
  title,
  subtitle,
  pos,
  cardRef,
  onClose,
  children,
}: {
  title: string
  subtitle: string
  pos: { top: number; right: number }
  cardRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  children: React.ReactNode
}) {
  return createPortal(
    <div
      ref={cardRef}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos.top,
        right: pos.right,
        transform: 'translateY(-100%)',
        zIndex: 9999,
        background: 'white',
        border: '1px solid #e1e6ef',
        borderRadius: 8,
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05), 0px 8px 20px rgba(0,0,0,0.1)',
        width: 320,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
        <span style={{ fontFamily: "'Museo Sans', sans-serif", fontWeight: 700, fontSize: 14, color: '#1d2433' }}>
          {title}
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
        >
          <span className="material-icons-outlined" style={{ fontSize: 18, color: '#6b7280' }}>close</span>
        </button>
      </div>
      <div style={{ padding: '0 16px 8px', borderBottom: '1px solid #eef0f4' }}>
        <span style={{ fontSize: 11, color: '#6b7280' }}>{subtitle}</span>
      </div>
      {children}
    </div>,
    document.body
  )
}

function useMultiCurrencyPopover() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (
        cardRef.current && !cardRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.top - 8, right: window.innerWidth - rect.right })
    }
    setOpen(prev => !prev)
  }
  return { open, pos, triggerRef, cardRef, setOpen, handleClick }
}

function formatBreakdownValue(code: string, value: number): string {
  if (code === 'JPY' || code === 'KRW') return new Intl.NumberFormat('en-US').format(value)
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

/**
 * Workbook Balance Rec. Balance cell for rec-004 - shows the top two workbook
 * currencies in the cell with a "Show N more" link. Popover lists raw tagged
 * currency values only (no conversion, no total).
 */
function WorkbookMultiCurrencyCell({
  borderTop,
  borderRight,
  bgColor,
}: {
  borderTop?: string
  borderRight?: string
  bgColor?: string
}) {
  const { open, pos, triggerRef, cardRef, setOpen, handleClick } = useMultiCurrencyPopover()

  const [first, _second, ...rest] = ROW_1010_BREAKDOWN
  const extraCount = rest.length + 1

  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ fontVariantNumeric: 'tabular-nums', borderTop, borderRight, backgroundColor: bgColor, overflow: 'hidden' }}
    >
      <div className="flex flex-col items-end gap-[2px]">
        <span className="text-[12px] leading-[18px] text-[#1d2433]">
          {formatCurrencyShort(first.code, first.value)}
        </span>
        <button
          ref={triggerRef}
          onClick={handleClick}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontSize: 12, lineHeight: '18px', color: '#94a3b8', fontWeight: 400,
          }}
        >
          +{extraCount} more currencies
        </button>
      </div>

      {open && pos && (
        <MultiCurrencyPopover
          title="Workbook Currencies"
          subtitle={`${ROW_1010_BREAKDOWN.length} Currencies`}
          pos={pos}
          cardRef={cardRef}
          onClose={() => setOpen(false)}
        >
          {/* Raw values only - no arrows, no converted column, no total. Each
              row is its own block so a light divider and hover highlight can sit
              between/on rows. */}
          <div style={{ padding: '4px 0 8px' }}>
            {ROW_1010_BREAKDOWN.map((r, i) => (
              <div
                key={r.code}
                className="hover:bg-[#f8fafc]"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 16px',
                  fontSize: 11,
                  lineHeight: '16px',
                  fontWeight: 500,
                  color: '#424867',
                  borderBottom: i < ROW_1010_BREAKDOWN.length - 1 ? '1px solid #f1f3f9' : undefined,
                }}
              >
                <span>{r.code}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {formatBreakdownValue(r.code, r.value)}
                </span>
              </div>
            ))}
          </div>
        </MultiCurrencyPopover>
      )}
    </td>
  )
}

/**
 * Workbook Balance Rec. Items cell for rec-004 - shows first 2 currencies inline
 * with a "Show 2 more" toggle that expands to reveal all 4. Clicking the toggle
 * also opens a popover with the full raw breakdown (no conversion, no asterisks).
 */
function WorkbookRecItemsCell({
  borderTop,
  borderRight,
  bgColor,
}: {
  borderTop?: string
  borderRight?: string
  bgColor?: string
}) {
  const { open, pos, triggerRef, cardRef, setOpen, handleClick } = useMultiCurrencyPopover()

  const [first, _second, ...rest] = ROW_1010_REC_ITEMS_BREAKDOWN

  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ fontVariantNumeric: 'tabular-nums', borderTop, borderRight, backgroundColor: bgColor, overflow: 'hidden' }}
    >
      <div className="flex flex-col items-end gap-[2px]">
        <span className="text-[12px] leading-[18px] text-[#1d2433]">
          {first.code} {new Intl.NumberFormat('en-US').format(first.value)}
        </span>
        <button
          ref={triggerRef}
          onClick={handleClick}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontSize: 12, lineHeight: '18px', color: '#94a3b8', fontWeight: 400,
          }}
        >
          +{rest.length + 1} more currencies
        </button>
      </div>

      {open && pos && (
        <MultiCurrencyPopover
          title="Rec. Items"
          subtitle={`${ROW_1010_REC_ITEMS_BREAKDOWN.length} Currencies`}
          pos={pos}
          cardRef={cardRef}
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: '4px 0 8px' }}>
            {ROW_1010_REC_ITEMS_BREAKDOWN.map((r, i) => (
              <div
                key={r.code}
                className="hover:bg-[#f8fafc]"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 16px',
                  fontSize: 11,
                  lineHeight: '16px',
                  fontWeight: 500,
                  color: '#424867',
                  borderBottom: i < ROW_1010_REC_ITEMS_BREAKDOWN.length - 1 ? '1px solid #f1f3f9' : undefined,
                }}
              >
                <span>{r.code}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {new Intl.NumberFormat('en-US').format(r.value)}
                </span>
              </div>
            ))}
          </div>
        </MultiCurrencyPopover>
      )}
    </td>
  )
}

/**
 * FloQast Tie Out Rec. Balance cell for rec-004 - shows the converted MXN value
 * in the cell with a "Show details" link. Popover lists each source currency
 * converted into the functional currency, plus a Total row.
 */
function TieOutMultiCurrencyCell({
  borderTop,
  borderRight,
  bgColor,
  style,
}: {
  borderTop?: string
  borderRight?: string
  bgColor?: string
  style?: React.CSSProperties
}) {
  const { open, pos, triggerRef, cardRef, setOpen, handleClick } = useMultiCurrencyPopover()

  return (
    <td
      className="text-right px-[16px] py-[10px] align-top"
      style={{ fontVariantNumeric: 'tabular-nums', borderTop, borderRight, backgroundColor: bgColor, overflow: 'hidden', ...style }}
    >
      <div className="flex flex-col items-end gap-[2px]">
        <span className="text-[12px] leading-[18px] text-[#1d2433] inline-flex items-center gap-[2px]">
          {ROW_1010_FUNCTIONAL_CURRENCY} {new Intl.NumberFormat('en-US').format(ROW_1010_TOTAL_MXN)}
          <span style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1, alignSelf: 'flex-start', paddingTop: 2 }}>*</span>
        </span>
        <button
          ref={triggerRef}
          onClick={handleClick}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontSize: 12, lineHeight: '18px', color: '#94a3b8', fontWeight: 400,
          }}
        >
          Show details
        </button>
      </div>

      {open && pos && (
        <MultiCurrencyPopover
          title="FloQast Tie Out"
          subtitle={`${ROW_1010_BREAKDOWN.length} Currencies`}
          pos={pos}
          cardRef={cardRef}
          onClose={() => setOpen(false)}
        >
          {/* Conversion layout: each row is its own grid with the same column
              template, so a light divider and hover highlight can sit on each row
              while keeping the columns aligned across rows. */}
          <div style={{ padding: '4px 0' }}>
            {ROW_1010_BREAKDOWN.map((r, i) => (
              <div
                key={r.code}
                className="hover:bg-[#f8fafc]"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 16px auto auto',
                  columnGap: 16,
                  alignItems: 'center',
                  padding: '6px 16px',
                  fontSize: 11,
                  lineHeight: '16px',
                  fontWeight: 500,
                  color: '#424867',
                  borderBottom: i < ROW_1010_BREAKDOWN.length - 1 ? '1px solid #f1f3f9' : undefined,
                }}
              >
                <span>{r.code}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {formatBreakdownValue(r.code, r.value)}
                </span>
                {'isFunctional' in r && r.isFunctional ? (
                  <span style={{ gridColumn: '3 / span 3', textAlign: 'right' }}>
                    ( FloQast Tie Out )
                  </span>
                ) : (
                  <>
                    <span style={{ color: '#94a3b8', textAlign: 'center' }}>→</span>
                    <span>{ROW_1010_FUNCTIONAL_CURRENCY}</span>
                    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {new Intl.NumberFormat('en-US').format(r.converted ?? 0)}
                      <span style={{ fontSize: 9, color: '#94a3b8', marginLeft: 1 }}>*</span>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: '1px solid #eef0f4',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 16px auto auto',
              columnGap: 16,
              alignItems: 'center',
              padding: '10px 16px',
              fontSize: 11,
              lineHeight: '16px',
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#1d2433' }}>Total</span>
            <span />
            <span />
            <span style={{ color: '#424867' }}>{ROW_1010_FUNCTIONAL_CURRENCY}</span>
            <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#424867' }}>
              {new Intl.NumberFormat('en-US').format(ROW_1010_TOTAL_MXN)}
              <span style={{ fontSize: 9, color: '#94a3b8', marginLeft: 1, fontWeight: 400 }}>*</span>
            </span>
          </div>
        </MultiCurrencyPopover>
      )}
    </td>
  )
}

function CurrencyCell({
  value, currency, borderTop, translationBadge, bgColor, style, disclaimer, disclaimerType = 'translation',
  disclaimerFrom, disclaimerTo, disclaimerSourceCurrencies,
}: {
  value: number | null
  currency: string
  borderTop?: string
  translationBadge?: TranslationBadge
  bgColor?: string
  style?: React.CSSProperties
  disclaimer?: boolean
  disclaimerType?: 'remeasurement' | 'translation'
  disclaimerFrom?: string
  disclaimerTo?: string
  disclaimerSourceCurrencies?: string[]
}) {
  const formatted = formatCurrencyShort(currency, value)
  const isNull = value == null

  return (
    <td className="text-right px-[16px] py-[10px] align-top" style={{ fontVariantNumeric: 'tabular-nums', borderTop, backgroundColor: bgColor, ...style }}>
      <div className="flex flex-col items-end">
        <span className={`text-[12px] leading-[18px] inline-flex items-center gap-[2px] ${isNull ? 'text-[#94a3b8]' : 'text-[#1d2433]'}`}>
          {formatted}
          {disclaimer && value != null && (
            <span style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1, alignSelf: 'flex-start', paddingTop: 2 }}>*</span>
          )}
        </span>
        {disclaimer && value != null && (
          <DisclaimerTooltip type={disclaimerType} fromCurrency={disclaimerFrom} toCurrency={disclaimerTo} sourceCurrencies={disclaimerSourceCurrencies} />
        )}
        {translationBadge && (
          <span className="text-[10px] leading-[14px] text-[#6b7280] flex items-center gap-[2px]">
            {translationBadge.from} <span className="text-[#9ca3af]">-&gt;</span> {translationBadge.to}
            <TranslationInfoPopover badge={translationBadge} />
          </span>
        )}
      </div>
    </td>
  )
}

function TotalCell({
  value, currency, tinted, borderTop, style,
  disclaimer, disclaimerType = 'translation', disclaimerFrom, disclaimerTo, disclaimerSourceCurrencies,
}: {
  value: number | null
  currency: string
  tinted?: boolean
  borderTop?: boolean
  style?: React.CSSProperties
  disclaimer?: boolean
  disclaimerType?: 'remeasurement' | 'translation'
  disclaimerFrom?: string
  disclaimerTo?: string
  disclaimerSourceCurrencies?: string[]
}) {
  const formatted = formatCurrencyShort(currency, value)
  return (
    <td
      className="text-right px-[16px] py-[12px] text-[12px] text-[#1d2433] align-top"
      style={{ fontVariantNumeric: 'tabular-nums', borderTop: borderTop ? '1px solid #eef0f4' : undefined, backgroundColor: tinted ? TINTED_BG : undefined, ...style }}
    >
      <div className="flex flex-col items-end">
        <span className="inline-flex items-center gap-[2px]">
          {formatted}
          {disclaimer && value != null && (
            <span style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1, alignSelf: 'flex-start', paddingTop: 2 }}>*</span>
          )}
        </span>
        {disclaimer && value != null && (
          <DisclaimerTooltip type={disclaimerType} fromCurrency={disclaimerFrom} toCurrency={disclaimerTo} sourceCurrencies={disclaimerSourceCurrencies} />
        )}
      </div>
    </td>
  )
}

function AssigneeCell({ assignee }: { assignee: Assignee }) {
  return (
    <div className="flex items-center gap-[8px]">
      <img
        src={assignee.avatarUrl}
        alt={assignee.initials}
        className="size-[28px] rounded-full shrink-0"
      />
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-[#1d2433] leading-[16px]">{assignee.name}</span>
        <span className="text-[11px] text-[#6b7280] leading-[14px]">{assignee.role}</span>
      </div>
      {/* Toggle */}
      <div className={`ml-auto w-[36px] h-[20px] rounded-full relative cursor-pointer ${assignee.signedOff ? 'bg-[#1FAC76]' : 'bg-[#cbd2e1]'}`}>
        <div className={`absolute top-[2px] size-[16px] rounded-full bg-white shadow-sm transition-all ${assignee.signedOff ? 'left-[18px]' : 'left-[2px]'}`} />
      </div>
    </div>
  )
}

function CompletedCell({ assignee }: { assignee: Assignee }) {
  return (
    <div className="flex items-center gap-[8px]">
      <img
        src={assignee.avatarUrl}
        alt={assignee.initials}
        className="size-[28px] rounded-full shrink-0"
      />
      <div className="flex flex-col gap-[2px]">
        <span className="text-[12px] font-medium text-[#1d2433] leading-[16px]">{assignee.name}</span>
        <div className="flex items-center gap-[4px]">
          {assignee.signedOff ? (
            <span className="material-icons-outlined" style={{ fontSize: 14, color: '#1FAC76' }}>check_circle</span>
          ) : (
            <span className="material-icons-outlined" style={{ fontSize: 14, color: '#f97316' }}>error_outline</span>
          )}
          <span className="text-[11px] text-[#6b7280] leading-[14px]">
            {assignee.signOffDate ?? ''}
          </span>
        </div>
      </div>
    </div>
  )
}

// Full-height Actions overlay

function ActionsOverlay({
  actionsHovered,
  scrolledRight,
  onEnter,
  onLeave,
  rowPositions,
  onSettingsClick,
  mcRendered,
  headerGroupingBottom,
  headerPrimaryBottom,
  hoveredRowId,
  onRowHover,
}: {
  actionsHovered: boolean
  scrolledRight: boolean
  onEnter: () => void
  onLeave: () => void
  rowPositions: Array<{ id: string; top: number; height: number; isChild: boolean; isTotal: boolean; isExpandedParent: boolean; accountName: string; isParentRow: boolean }>
  onSettingsClick: (rowId: string, accountName: string, isParent: boolean) => void
  mcRendered: boolean
  headerGroupingBottom: number
  headerPrimaryBottom: number
  hoveredRowId?: string | null
  onRowHover?: (id: string | null) => void
}) {
  const isExpanded = actionsHovered || scrolledRight

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: actionsHovered || scrolledRight ? 168 : 48,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'flex-end',
        background: '#fff',
        // Integrated (scrolled to end): left/right/top borders match the scroll container.
        // Floating (collapsed or hover-expanded): full border + shadow + radius
        ...(scrolledRight
          ? { borderRight: '1px solid #e1e6ef', borderTop: '1px solid #e1e6ef', borderBottom: '1px solid #e1e6ef' }
          : { border: '1px solid #e1e6ef', borderBottom: 'none' }
        ),
        borderTopRightRadius: scrolledRight ? 0 : 6,
        borderBottomRightRadius: scrolledRight ? 0 : 6,
        boxSizing: 'border-box',
        boxShadow: scrolledRight ? 'none' : '0px 1px 2px 0px rgba(0,0,0,0.05)',
        transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10,
      }}
    >
      {/* Inner content: always 168px wide, right-aligned so left side clips */}
      <div style={{ width: 168, flexShrink: 0, height: '100%', position: 'relative' }}>

        {/* Primary header row - "Actions" label, bottom-aligned to match other column headers */}
        {/* borderTop separates the grouping row from the primary row in MC mode */}
        <div style={{
          position: 'absolute',
          top: mcRendered ? headerGroupingBottom : 0,
          left: 0, right: 0,
          height: headerPrimaryBottom - (mcRendered ? headerGroupingBottom : 0),
          boxSizing: 'border-box',
          borderTop: mcRendered ? '1px solid #e1e6ef' : undefined,
          borderBottom: '1px solid #e1e6ef',
          background: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
          paddingLeft: 12,
          paddingBottom: 8,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1b1f27', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
            Actions
          </span>
        </div>

        {/* Icon slots - absolutely positioned to match each table row's y offset */}
        {rowPositions.map(pos => (
          <div
            key={pos.id}
            onMouseEnter={!pos.isChild && !pos.isTotal ? () => onRowHover?.(pos.id) : undefined}
            onMouseLeave={!pos.isChild && !pos.isTotal ? () => onRowHover?.(null) : undefined}
            style={{
              position: 'absolute',
              top: pos.top,
              left: 0,
              right: 0,
              height: pos.height,
              boxSizing: 'border-box',
              // Expanded parent rows: no bottom border (group continues below)
              // Child rows: no border - they have no actions, lines would be noise
              // Total rows and standalone rows: full bottom border
              borderBottom: pos.isExpandedParent ? 'none' : pos.isChild ? 'none' : '1px solid #e1e6ef',
              // Total row: match the #eef0f4 borderTop drawn by the table's Total cells
              borderTop: pos.isTotal ? '1px solid #eef0f4' : undefined,
              backgroundColor: (!pos.isChild && !pos.isTotal && hoveredRowId === pos.id) ? '#f8fafc' : undefined,
            }}
          >
            {!pos.isChild && !pos.isTotal && (
              <>
                {/* Left group: note, attach, settings - fades out when collapsed */}
                {/* Figma: p-[12px] cell, icons flush (no gap). 3x36=108px starting at left:12 */}
                <div style={{
                  position: 'absolute', left: 12, top: 12,
                  display: 'flex', gap: 0,
                  opacity: isExpanded ? 1 : 0,
                  transition: 'opacity 150ms ease',
                  pointerEvents: isExpanded ? 'auto' : 'none',
                }}>
                  <ActionIcon icon="note" />
                  <ActionIcon icon="attach" />
                  <ActionIcon icon="settings" onClick={() => onSettingsClick(pos.id, pos.accountName, pos.isParentRow)} />
                </div>
                {/* more_vert: right:12 aligns with 12px cell padding. In minimized (48px), */}
                {/* visible area = inner[120..168], so ⋮ at inner[120..156] is flush-left */}
                <div style={{ position: 'absolute', right: 12, top: 12 }}>
                  <ActionIcon icon="more" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionIcon({ icon, onClick }: { icon: string; onClick?: () => void }) {
  const iconName = icon === 'note' ? 'add_comment' : icon === 'attach' ? 'attach_file' : icon === 'settings' ? 'settings' : 'more_vert'
  return (
    <button onClick={onClick} className="relative flex items-center justify-center size-[36px] rounded hover:bg-[#f1f3f9]">
      <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6b7280' }}>{iconName}</span>
    </button>
  )
}

// ── Misc icons ─────────────────────────────────────────────────

function CopyIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ display: 'block', cursor: 'pointer' }}>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#94a3b8"/>
    </svg>
  )
}

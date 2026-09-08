import { useState, useRef, useEffect } from 'react'
import { GlobalNavSidebar } from '@shared/components/GlobalNavSidebar/GlobalNavSidebar'
import { MOCK_DATA } from './data/mockData.ts'
import { RecsTable } from './components/RecsTable.tsx'
import { AdminSettings } from './components/AdminSettings.tsx'
import { FxRatesModal } from './components/FxRatesModal.tsx'
import { FxRatesPage } from './components/FxRatesPage.tsx'
import Checkbox from '@floqastinc/flow-ui_core/Checkbox'
import RadioGroup from '@floqastinc/flow-ui_core/RadioGroup'
import { Radio } from '@floqastinc/flow-ui_core/RadioGroup/subcomponents'
import { SetupWizardModal } from './components/SetupWizardModal.tsx'
import type { ReconciliationRow } from './data/types.ts'

type ViewMode = 'functional' | 'local' | 'reporting' | 'all'
type Page = 'recs' | 'admin' | 'fx-rates'
type ReportingCurrency = 'USD' | 'MXN' | 'JPY'

const MUSEO = "'Museo Sans', sans-serif"

const REPORTING_CURRENCIES: ReportingCurrency[] = ['USD', 'MXN', 'JPY']

function viewModeLabel(mode: ViewMode, reportingCurrency: ReportingCurrency): string {
  switch (mode) {
    case 'local': return 'Workbook Balance'
    case 'functional': return 'FloQast Tie Out'
    case 'reporting': return `Reporting (${reportingCurrency})`
    case 'all': return 'Show All'
  }
}

/** Derive an active label for the Currency button from the three independent toggles. */
function currencyButtonLabel(showWorkbook: boolean, showFunctional: boolean, showReporting: boolean, reportingCurrency: ReportingCurrency): string {
  const parts: string[] = []
  if (showWorkbook) parts.push('Workbook Balance')
  if (showFunctional) parts.push('FloQast Tie Out')
  if (showReporting) parts.push(`Reporting (${reportingCurrency})`)
  if (parts.length === 0) return 'None'
  if (parts.length === 1) return parts[0]
  return `${parts.length} views`
}

/** Initial toggle state derived from a scenario's default ViewMode. */
function defaultTogglesFromView(mode: ViewMode): { workbook: boolean; functional: boolean; reporting: boolean } {
  switch (mode) {
    case 'local':      return { workbook: true,  functional: true,  reporting: false }
    case 'functional': return { workbook: false, functional: true,  reporting: false }
    case 'reporting':  return { workbook: false, functional: true,  reporting: true }
    case 'all':        return { workbook: true,  functional: true,  reporting: true }
  }
}
// Order: Local (transactions) -> Functional (entity books) -> Reporting (consolidated) -> Show All.
// Single-currency views first, combined "Show All" last as the comprehensive option.

const CLOSE_TABS = [
  'Dashboard',
  'Folders',
  'Checklist',
  'Reconciliations',
  'Notes',
  'Journal Entries',
  'Flux Analysis',
]

export type Scenario = 'preparer' | 'admin' | 'controller'

export const SCENARIOS: {
  id: Scenario
  label: string
  description: string
  defaultView: ViewMode
  fxRatesLoaded: boolean
  adminRole: boolean
}[] = [
  {
    id: 'admin',
    label: 'Admin',
    description: 'Rates missing - upload FX rates to unblock preparers',
    defaultView: 'functional',
    fxRatesLoaded: false,
    adminRole: true,
  },
  {
    id: 'preparer',
    label: 'Preparer',
    description: 'Current FQ view - FloQast Tie Out only',
    defaultView: 'functional',
    fxRatesLoaded: true,
    adminRole: false,
  },
  {
    id: 'controller',
    label: 'Controller',
    description: 'Reporting view, everything normalized',
    defaultView: 'reporting',
    fxRatesLoaded: true,
    adminRole: false,
  },
]

export default function App() {
  // Demo Scenarios: Admin is the default starting persona.
  const [scenario, setScenario] = useState<Scenario>('admin')
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false)
  // Derived from scenario - drives table warnings, admin access, alert banner
  const cfg = SCENARIOS.find(s => s.id === scenario)!
  const isAdmin = cfg.adminRole

  const [viewMode, setViewMode] = useState<ViewMode>(cfg.defaultView)
  // Independent toggles for the three currency views. Initialized from the
  // scenario's defaultView so existing scenario presets keep working.
  const initToggles = defaultTogglesFromView(cfg.defaultView)
  const [showWorkbook, setShowWorkbook] = useState<boolean>(initToggles.workbook)
  const [showFunctional, setShowFunctional] = useState<boolean>(initToggles.functional)
  const [showReporting, setShowReporting] = useState<boolean>(initToggles.reporting)
  const [_data] = useState<ReconciliationRow[]>(MOCK_DATA)
  const [page, setPage] = useState<Page>('recs')
  const [menuOpen, setMenuOpen] = useState(false)
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  const [reportingCurrency, setReportingCurrency] = useState<ReportingCurrency>('USD')
  const [fxRatesOpen, setFxRatesOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [multiCurrencyEnabled, setMultiCurrencyEnabled] = useState(true)
  const [setupComplete, setSetupComplete] = useState(false)
  // Demo toggle: show/hide all setup + contextual banners across all personas
  const [showBanners, setShowBanners] = useState(false)
  // Setup checklist steps - Admin scenario only. Both reset when scenario changes.
  const [step1Complete, setStep1Complete] = useState(false)
  const [step2Complete, setStep2Complete] = useState(false)
  // Admin: MC features are hidden until both setup steps are done.
  // Other personas always have MC active (their fxRatesLoaded controls rate errors).
  const multiCurrencyActive = scenario !== 'admin' || (step1Complete && step2Complete)
  // Admin: FX rates are considered loaded only after Step 2 completes.
  // Other personas use the scenario config value directly.
  const effectiveFxRatesLoaded = scenario === 'admin' ? step2Complete : cfg.fxRatesLoaded
  // True when at least one account row has a foreign currency workbook tag
  // (localCurrency present and differs from functionalCurrency). Used to
  // decide whether to show the Preparer contextual banner.
  const hasForeignCurrencyAccounts = _data.some(
    r => r.localCurrency && r.localCurrency !== '' && r.localCurrency !== r.functionalCurrency
  )
  // Preparer contextual banner - dismissed when user clicks X, resets on scenario switch
  const [preparerBannerDismissed, setPreparerBannerDismissed] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterMultiCurrency, setFilterMultiCurrency] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const currencyMenuRef = useRef<HTMLDivElement>(null)
  const scenarioMenuRef = useRef<HTMLDivElement>(null)

  function applyScenario(s: Scenario) {
    const c = SCENARIOS.find(x => x.id === s)!
    setScenario(s)
    setViewMode(c.defaultView)
    const toggles = defaultTogglesFromView(c.defaultView)
    setShowWorkbook(toggles.workbook)
    setShowFunctional(toggles.functional)
    setShowReporting(toggles.reporting)
    setReportingCurrency('USD')
    setScenarioMenuOpen(false)
    setStep1Complete(false)
    setStep2Complete(false)
    setPreparerBannerDismissed(false)
  }

  // Map Workbook/Reporting toggles to the viewMode enum that drives RecsTable's
  // mcRendered (Workbook block) and repRendered (Reporting block). Functional
  // visibility is a separate funcRendered prop and doesn't enter into viewMode.
  useEffect(() => {
    let next: ViewMode
    if (showWorkbook && showReporting) next = 'all'
    else if (showWorkbook) next = 'local'
    else if (showReporting) next = 'reporting'
    else next = 'functional'
    setViewMode(next)
  }, [showWorkbook, showReporting])

  // Reporting checkbox semantics: checking it resets to the first radio (USD).
  // Unchecking it resets the radio selection back to USD so when re-checked the
  // first option is selected again.
  function toggleReportingCheckbox(next: boolean) {
    setShowReporting(next)
    setReportingCurrency('USD')
  }

  // Clicking a radio while Reporting is unchecked auto-checks Reporting and
  // selects that currency. Clicking while checked just changes the selection.
  function selectReportingCurrency(curr: ReportingCurrency) {
    if (!showReporting) setShowReporting(true)
    setReportingCurrency(curr)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false)
      }
      if (scenarioMenuRef.current && !scenarioMenuRef.current.contains(e.target as Node)) {
        setScenarioMenuOpen(false)
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for "See all rates" link in conversion tooltip - navigates to FX Rates page
  useEffect(() => {
    function handleNavigateToFxRates() { setPage('fx-rates') }
    window.addEventListener('navigate-to-fx-rates', handleNavigateToFxRates)
    return () => window.removeEventListener('navigate-to-fx-rates', handleNavigateToFxRates)
  }, [])


  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Global nav sidebar */}
      <GlobalNavSidebar activeApp="close" avatarFallback="BE" />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Close sub-nav - hidden only when Admin Settings is open (matches Figma).
            FX Rates page keeps the sub-nav so the app shell stays consistent. */}
        {page !== 'admin' && <div className="bg-white border-b border-[#e1e6ef] flex items-center pl-[24px] h-[48px] shrink-0">
          <div className="flex items-center h-full shrink-0">
            <div className="flex items-center gap-[12px] h-[29.77px]">
              <CloseAppIcon />
              <p
                className="text-[16px] leading-[20px] text-[#1d2433] text-center whitespace-nowrap"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                Close
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center h-full min-w-0 px-[24px]">
            <div className="flex items-center gap-[24px] h-full">
              {CLOSE_TABS.map((tab) => {
                const isActive = tab === 'Reconciliations'
                return (
                  <div key={tab} className="flex items-center h-full shrink-0">
                    <button
                      className="flex items-center justify-center h-full py-[8px] gap-[8px] cursor-pointer whitespace-nowrap"
                      style={{
                        fontFamily: MUSEO,
                        fontWeight: 700,
                        borderBottom: isActive ? '2px solid #186749' : '2px solid transparent',
                      }}
                    >
                      <p
                        className={`text-[12px] leading-[18px] tracking-[-0.12px] text-center whitespace-nowrap ${
                          isActive ? 'text-[#1d2433]' : 'text-[#424867]'
                        }`}
                      >
                        {tab}
                      </p>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

        </div>}

        {/* Demo Scenarios dropdown - always visible, fixed top-right */}
        <div ref={scenarioMenuRef} style={{ position: 'fixed', top: 8, right: 24, zIndex: 9998 }}>
          <button
            onClick={() => setScenarioMenuOpen(prev => !prev)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 32, padding: '0 12px',
              background: '#1d4ed8', border: '1px solid #1d4ed8',
              borderRadius: 6, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontWeight: 600,
              boxShadow: '0 1px 3px rgba(29,78,216,0.25)',
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 14, color: 'white' }}>smart_toy</span>
            <span style={{ fontSize: 11, color: 'white', whiteSpace: 'nowrap' }}>
              Demo: {cfg.label}
            </span>
            <span className="material-icons-outlined" style={{ fontSize: 14, color: 'white' }}>expand_more</span>
          </button>
          {scenarioMenuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'white', border: '1px solid #e1e6ef', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              width: 280, zIndex: 9999, padding: 8,
              fontFamily: "'Inter', sans-serif",
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px 8px', margin: 0 }}>
                Demo Scenarios
              </p>
              {/* Banner visibility toggle */}
              <div style={{ borderBottom: '1px solid #e1e6ef', margin: '4px 0 8px', paddingBottom: 8 }}>
                <button
                  onClick={() => setShowBanners(prev => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '6px 10px', border: 'none', cursor: 'pointer',
                    borderRadius: 6, background: 'transparent', gap: 8,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#1d2433' }}>Show banners</span>
                  {/* pill toggle */}
                  <div style={{
                    width: 32, height: 18, borderRadius: 9,
                    background: showBanners ? '#3d7bf7' : '#cbd2e1',
                    position: 'relative', flexShrink: 0, transition: 'background 0.15s',
                  }}>
                    <div style={{
                      position: 'absolute', top: 2,
                      left: showBanners ? 16 : 2,
                      width: 14, height: 14, borderRadius: '50%',
                      background: 'white', transition: 'left 0.15s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </button>
              </div>

              {SCENARIOS.map(s => {
                const isActive = scenario === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => applyScenario(s.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      width: '100%', padding: '8px 10px', border: 'none', cursor: 'pointer',
                      borderRadius: 6, textAlign: 'left', gap: 2,
                      background: isActive ? '#eff6ff' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f8fafc' }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                      {isActive && (
                        <span className="material-icons-outlined" style={{ fontSize: 14, color: '#1d4ed8', flexShrink: 0 }}>check</span>
                      )}
                      {!isActive && <span style={{ width: 14, flexShrink: 0 }} />}
                      <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#1d4ed8' : '#1d2433' }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#6b7280', paddingLeft: 20 }}>{s.description}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {page === 'admin' ? (
          <AdminSettings
            onBack={() => setPage('recs')}
            isAdmin={isAdmin}
            onSettingsSaved={() => setStep1Complete(true)}
          />
        ) : page === 'fx-rates' ? (
          <FxRatesPage
            onBack={() => setPage('recs')}
            period="Oct 2025"
            isAdmin={isAdmin}
            fxRatesLoaded={effectiveFxRatesLoaded}
            onUploadComplete={() => setStep2Complete(true)}
          />
        ) : (<>

        {/* Entity & period selectors */}
        <div className="bg-white px-[24px] pt-[16px] pb-[16px] border-b border-[#e1e6ef] flex items-center gap-[12px]">
          <SelectButton label="All Entities" icon={<CalendarIcon />} />
          <SelectButton label="By Period" icon={<CalendarIcon />} />
          <SelectButton label="October 2025" icon={<CalendarIcon />} />
        </div>

        {/* Setup banner - Admin scenario only. Shows one step at a time, hides when both complete. */}
        {showBanners && isAdmin && !step1Complete && (
          <div className="mx-[16px] mt-[12px]">
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6,
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span className="material-icons-outlined shrink-0" style={{ fontSize: 20, color: '#3d7bf7' }}>info</span>
              <p style={{ flex: 1, fontSize: 12, lineHeight: '18px', color: '#1b1f27', fontFamily: 'Inter, sans-serif', fontWeight: 400, margin: 0 }}>
                <strong>Step 1 of 2:</strong> Enable entities and set up reporting views so FloQast knows which currencies to convert to.
              </p>
              <button
                onClick={() => setPage('admin')}
                style={{
                  height: 28, padding: '0 12px', borderRadius: 6, border: 'none',
                  fontSize: 11, fontWeight: 700, color: 'white', background: '#3d7bf7',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: MUSEO,
                }}
              >
                Configure
              </button>
            </div>
          </div>
        )}
        {showBanners && isAdmin && step1Complete && !step2Complete && (
          <div className="mx-[16px] mt-[12px]">
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6,
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span className="material-icons-outlined shrink-0" style={{ fontSize: 20, color: '#3d7bf7' }}>info</span>
              <p style={{ flex: 1, fontSize: 12, lineHeight: '18px', color: '#1b1f27', fontFamily: 'Inter, sans-serif', fontWeight: 400, margin: 0 }}>
                <strong>Step 2 of 2:</strong> Upload FX rates for Oct 2025 so FloQast can convert workbook balances for this period.
              </p>
              <button
                onClick={() => setPage('fx-rates')}
                style={{
                  height: 28, padding: '0 12px', borderRadius: 6, border: 'none',
                  fontSize: 11, fontWeight: 700, color: 'white', background: '#3d7bf7',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: MUSEO,
                }}
              >
                Upload FX Rates
              </button>
            </div>
          </div>
        )}

        {/* Preparer contextual banner - shown when foreign currency accounts exist
            but Workbook Balance view is not currently selected. Dismisses automatically
            when the user enables Workbook Balance via the currency selector. */}
        {showBanners && scenario === 'preparer' && hasForeignCurrencyAccounts && !showWorkbook && !preparerBannerDismissed && (
          <div className="mx-[16px] mt-[12px]">
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6,
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <span className="material-icons-outlined shrink-0" style={{ fontSize: 20, color: '#3d7bf7' }}>info</span>
              <p style={{ flex: 1, fontSize: 12, lineHeight: '18px', color: '#1b1f27', fontFamily: 'Inter, sans-serif', fontWeight: 400, margin: 0 }}>
                Multiple currencies detected. Add Workbook Balance view to see them.
              </p>
              <button
                onClick={() => setPreparerBannerDismissed(true)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280', flexShrink: 0 }}
                aria-label="Dismiss"
              >
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="bg-white px-[24px] pt-[20px] pb-[16px]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start shrink-0">
              <p
                className="text-[24px] leading-[32px] text-black whitespace-nowrap"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                Reconciliations: Multi Currency
              </p>
              <div className="h-[24px] flex flex-col items-start justify-center">
                <p
                  className="text-[12px] leading-[16px] text-[#adb2bb] capitalize whitespace-nowrap"
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  1/100
                </p>
              </div>
            </div>

            {/* Toolbar buttons */}
            <div className="flex items-center gap-[12px]">
              {/* Filter button + panel */}
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setFilterOpen(prev => !prev)}
                  className={`flex items-center justify-center gap-[8px] h-[40px] border-[1.4px] rounded-[6px] px-[12px] bg-white shrink-0 hover:bg-[#f8fafc] ${filterOpen ? 'border-[#3d7bf7] bg-[#f0f5ff]' : 'border-[#cbd2e1]'} ${filterMultiCurrency ? 'border-[#3d7bf7]' : ''}`}
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  <FilterIcon />
                  <span className={`text-[12px] leading-[18px] tracking-[-0.12px] whitespace-nowrap ${filterMultiCurrency ? 'text-[#3d7bf7]' : 'text-[#6b7280]'}`}>
                    Filter{filterMultiCurrency ? ': 1' : ''}
                  </span>
                </button>
                {filterOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    background: 'white', border: '1px solid #e1e6ef', borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    width: 260, zIndex: 200, padding: '16px 0 12px',
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 16px 8px', fontFamily: MUSEO }}>Filters</p>

                    {/* Status filter - placeholder */}
                    <div style={{ padding: '4px 16px' }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#1d2433', marginBottom: 6, fontFamily: MUSEO }}>Status</p>
                      {['Open', 'Completed', 'Rejected'].map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                          <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid #cbd2e1', background: 'white', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: '#1d2433', fontFamily: "'Inter', sans-serif" }}>{s}</span>
                        </label>
                      ))}
                    </div>

                    <div style={{ height: 1, background: '#e1e6ef', margin: '10px 0' }} />

                    {/* Multi-currency filter */}
                    <div style={{ padding: '4px 16px' }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#1d2433', marginBottom: 6, fontFamily: MUSEO }}>Account type</p>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }} onClick={() => setFilterMultiCurrency(prev => !prev)}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 3,
                          border: `1.5px solid ${filterMultiCurrency ? '#1c895f' : '#cbd2e1'}`,
                          background: filterMultiCurrency ? '#1c895f' : 'white',
                          flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {filterMultiCurrency && <span className="material-icons-outlined" style={{ fontSize: 10, color: 'white' }}>check</span>}
                        </div>
                        <span style={{ fontSize: 12, color: '#1d2433', fontFamily: "'Inter', sans-serif" }}>Multi-currency accounts</span>
                      </label>
                    </div>

                    <div style={{ height: 1, background: '#e1e6ef', margin: '10px 0' }} />

                    <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        onClick={() => { setFilterMultiCurrency(false); setFilterOpen(false) }}
                        style={{ height: 28, padding: '0 10px', borderRadius: 6, border: '1px solid #e1e6ef', fontSize: 11, fontWeight: 700, color: '#6b7280', fontFamily: MUSEO, cursor: 'pointer', background: 'white' }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        style={{ height: 28, padding: '0 10px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700, color: 'white', fontFamily: MUSEO, cursor: 'pointer', background: '#1c895f' }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <HeaderButton icon={<RefreshIcon />} label="Refresh" hasChevron />

              {/* Currency dropdown: three independent checkboxes (Workbook Balance,
                  FloQast Tie Out, Reporting) with a radio sub-group under Reporting.
                  Only visible when Multi Currency is enabled. */}
              {multiCurrencyEnabled && <div ref={currencyMenuRef} className="relative">
                <button
                  onClick={() => setCurrencyMenuOpen(prev => !prev)}
                  className={`flex items-center justify-center gap-[8px] h-[40px] border-[1.4px] border-[#cbd2e1] rounded-[6px] px-[12px] bg-white hover:bg-[#f8fafc] shrink-0 ${currencyMenuOpen ? 'bg-[#f8fafc]' : ''}`}
                  style={{ fontFamily: MUSEO, fontWeight: 700 }}
                >
                  <span className="text-[12px] leading-[18px] text-[#6b7280] tracking-[-0.12px] whitespace-nowrap">
                    Currency: <span className="text-[#1d2433]">{currencyButtonLabel(showWorkbook, showFunctional, showReporting, reportingCurrency)}</span>
                  </span>
                  <ChevronDownIcon color="#6b7280" />
                </button>
                {currencyMenuOpen && (
                  <div
                    className="absolute right-0 top-[44px] bg-white border border-[#e1e6ef] rounded-[6px] z-50 overflow-visible"
                    style={{
                      // Panel sizing matches Figma 5680:20666 (Form / Dropdown-panels):
                      // 260x274 with 16px internal padding and ~12px gap between rows.
                      width: 260,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      boxShadow: '0px 4px 20px -2px rgba(0,0,0,0.05), 0px 10px 25px -3px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* FlowUI Checkbox: Workbook Balance */}
                    <Checkbox
                      checked={showWorkbook}
                      onCheckedChange={(c: boolean) => setShowWorkbook(c)}
                      label="Workbook Balance"
                    />
                    {/* FlowUI Checkbox: FloQast Tie Out */}
                    <Checkbox
                      checked={showFunctional}
                      onCheckedChange={(c: boolean) => setShowFunctional(c)}
                      label="FloQast Tie Out"
                    />
                    {/* FlowUI Checkbox: Reporting (controls the radio group below) */}
                    <Checkbox
                      checked={showReporting}
                      onCheckedChange={(c: boolean) => toggleReportingCheckbox(c)}
                      label="Reporting"
                    />
                    {/* Indented FlowUI RadioGroup. Aligned ~32px from the panel's left edge
                        so radios sit under the Reporting label text. When Reporting is
                        unchecked, the group is muted but still clickable - clicking a
                        radio auto-checks Reporting and selects that currency. */}
                    <div
                      style={{
                        paddingLeft: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                      }}
                    >
                      {/* When Reporting is unchecked, no radio shows selected -
                          matches Figma 5680:20666. Clicking any radio still
                          auto-checks Reporting and selects that currency. */}
                      <RadioGroup
                        value={showReporting ? reportingCurrency : ''}
                        onValueChange={(v: string) => selectReportingCurrency(v as ReportingCurrency)}
                      >
                        {REPORTING_CURRENCIES.map(curr => (
                          <Radio key={curr} value={curr}>
                            {`${curr} - ${reportingCurrencyLabel(curr)}`}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>}

              <HeaderButton icon={<RefreshIcon />} label="Completeness" hasChevron />

              {/* Add button */}
              <button
                className="flex items-center justify-center gap-[8px] h-[40px] bg-[#1fac76] rounded-[6px] px-[12px] overflow-hidden hover:bg-[#17935f]"
                style={{ fontFamily: MUSEO, fontWeight: 700 }}
              >
                <span className="text-[12px] leading-[18px] text-white text-center tracking-[-0.12px] whitespace-nowrap">
                  Add
                </span>
                <ChevronDownIcon color="white" />
              </button>

              {/* More */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className={`flex items-center justify-center size-[40px] rounded-[50px] shrink-0 hover:bg-[#f1f3f9] ${menuOpen ? 'bg-[#f1f3f9]' : ''}`}
                >
                  <MoreVertIcon />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[44px] bg-white border border-[#e1e6ef] rounded-[6px] pb-[4px] z-50 min-w-[260px] overflow-hidden"
                    style={{ boxShadow: '0px 4px 20px -2px rgba(0,0,0,0.05), 0px 10px 25px -3px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(0,0,0,0.05)' }}
                  >
                    {/* Bulk Actions */}
                    <button
                      className="w-full flex items-center gap-[8px] h-[45px] px-[16px] text-left hover:bg-[#f8fafc]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <ChecklistIcon />
                      <span className="flex-1 text-[12px] leading-[18px] text-[#424867] overflow-hidden text-ellipsis whitespace-nowrap">Bulk Actions</span>
                      <ChevronRightIcon />
                    </button>
                    {/* Export */}
                    <button
                      className="w-full flex items-center gap-[8px] h-[45px] px-[16px] text-left hover:bg-[#f8fafc]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <DownloadIcon />
                      <span className="flex-1 text-[12px] leading-[18px] text-[#424867] overflow-hidden text-ellipsis whitespace-nowrap">Export</span>
                      <ChevronRightIcon />
                    </button>
                    {/* Collapse All */}
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-[8px] h-[45px] px-[16px] text-left hover:bg-[#f8fafc]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <CollapseIcon />
                      <span className="flex-1 text-[12px] leading-[18px] text-[#424867] overflow-hidden text-ellipsis whitespace-nowrap">Collapse All</span>
                    </button>
                    {/* Settings */}
                    <button
                      onClick={() => { setPage('admin'); setMenuOpen(false) }}
                      className="w-full flex items-center gap-[8px] h-[45px] px-[16px] text-left hover:bg-[#f8fafc]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <SettingsMenuIcon />
                      <span className="flex-1 text-[12px] leading-[18px] text-[#424867] overflow-hidden text-ellipsis whitespace-nowrap">Settings</span>
                    </button>
                    {/* FX Rates */}
                    <button
                      onClick={() => { setPage('fx-rates'); setMenuOpen(false) }}
                      className="w-full flex items-center gap-[8px] h-[45px] px-[16px] text-left hover:bg-[#f8fafc]"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <FxRatesMenuIcon />
                      <span className="flex-1 text-[12px] leading-[18px] text-[#424867] overflow-hidden text-ellipsis whitespace-nowrap">FX Rates</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-[24px] pb-[24px]">
          <RecsTable data={_data} viewMode={viewMode} funcRendered={showFunctional} fxRatesLoaded={effectiveFxRatesLoaded} multiCurrencyActive={multiCurrencyActive} reportingCurrency={reportingCurrency} scenarioId={scenario} showBanners={showBanners} />
        </div>

        </>)}
      </div>

      {/* FX Rates modal (period-level rate management) */}
      <FxRatesModal
        open={fxRatesOpen}
        onClose={() => setFxRatesOpen(false)}
        hasUploadedRates={effectiveFxRatesLoaded}
        onUpload={() => { /* upload handled through scenario selection */ }}
        isAdmin={isAdmin}
      />



      {/* Multi-Currency setup wizard */}
      <SetupWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={() => setSetupComplete(true)}
        onRatesUploaded={() => { /* handled via scenario selection */ }}
      />

    </div>
  )
}

// ── Currency dropdown helpers ─────────────────────────────────

function reportingCurrencyLabel(curr: ReportingCurrency): string {
  switch (curr) {
    case 'USD': return 'US Dollars'
    case 'MXN': return 'Mexican Peso'
    case 'JPY': return 'Japanese Yen'
  }
}

// ── Close app icon ─────────────────────────────────────────────

function CloseAppIcon() {
  return (
    <svg width={24} height={18} style={{ display: 'block', flexShrink: 0 }} viewBox="0 0 19.9682 20.8142" fill="none">
      <path d="M19.9682 12.5031V12.4947L9.98409 4.18359L0 12.4947V12.5031L9.98409 20.8142L19.9682 12.5031Z" fill="url(#cnav-g1)"/>
      <path d="M19.9682 8.31951V8.31112L9.98409 0L0 8.31112V8.31951L9.98409 16.6306L19.9682 8.31951Z" fill="url(#cnav-g2)"/>
      <path d="M16.3998 2.80273L9.09498 8.95818L6.5063 6.85841L4.92383 8.20574L9.09498 11.6209L17.9708 4.143V4.11193L16.3998 2.80273Z" fill="#224030"/>
      <defs>
        <linearGradient id="cnav-g1" x1="4.98995" y1="17.4931" x2="14.9782" y2="7.50476" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B834C"/><stop offset="0.999814" stopColor="#A8D6AC"/>
        </linearGradient>
        <linearGradient id="cnav-g2" x1="4.98995" y1="13.3095" x2="14.9782" y2="3.32117" gradientUnits="userSpaceOnUse">
          <stop offset="0.000186" stopColor="#A8D6AC"/><stop offset="1" stopColor="#4B834C"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Toolbar components ─────────────────────────────────────────

function SelectButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-[8px] h-[36px] border border-[#cbd2e1] rounded-[6px] px-[12px] bg-white hover:bg-[#f8fafc] text-[12px] text-[#424867] whitespace-nowrap"
      style={{ fontFamily: "'Museo Sans', sans-serif", fontWeight: 700 }}
    >
      {icon}
      {label}
      <ChevronDownIcon color="#6b7280" />
    </button>
  )
}

function HeaderButton({ icon, label, hasChevron }: { icon: React.ReactNode; label: string; hasChevron?: boolean }) {
  return (
    <button
      className="flex items-center justify-center gap-[8px] h-[40px] border-[1.4px] border-[#cbd2e1] rounded-[6px] px-[12px] bg-white hover:bg-[#f8fafc] shrink-0"
      style={{ fontFamily: "'Museo Sans', sans-serif", fontWeight: 700 }}
    >
      {icon}
      <span className="text-[12px] leading-[18px] text-[#6b7280] text-center tracking-[-0.12px] whitespace-nowrap">
        {label}
      </span>
      {hasChevron && <ChevronDownIcon color="#6b7280" />}
    </button>
  )
}

// ── SVG Icons ──────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="#6b7280" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#6b7280" />
    </svg>
  )
}

function CollapseIcon() {
  // Material Symbols Outlined: table_rows (FlowUI Assets node 7176:93270)
  // Rounded rect with 2 horizontal dividers = 3 rows
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" stroke="#6b7280" strokeWidth="1.5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" stroke="#6b7280" strokeWidth="1.5" />
      <line x1="4" y1="14.5" x2="20" y2="14.5" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  )
}

function ChevronDownIcon({ color = '#6b7280' }: { color?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill={color} />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="#6b7280" />
    </svg>
  )
}

function MoreVertIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <circle cx="12" cy="5" r="2" fill="#6b7280" />
      <circle cx="12" cy="12" r="2" fill="#6b7280" />
      <circle cx="12" cy="19" r="2" fill="#6b7280" />
    </svg>
  )
}

function ChecklistIcon() {
  // Material Symbols Outlined: checklist (stroked, thin)
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M3 7l2 2 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17l2 2 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8h8M13 16h8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  // Material Symbols Outlined: download (stroked, thin)
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M12 4v11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  // Figma spec: 20x20 slot, inner inset 26.46% top/bottom + 36.04% left/right = ~5.58x9.42px rendered
  return (
    <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={6} height={10} viewBox="0 0 5.58333 9.41667" fill="none" style={{ display: 'block' }}>
        <path d="M0.875 9.41667L0 8.54167L3.83333 4.70833L0 0.875L0.875 0L5.58333 4.70833L0.875 9.41667Z" fill="#1D2433" fillOpacity="0.8" />
      </svg>
    </div>
  )
}

function FxRatesMenuIcon() {
  // Figma: money-dollar custom SVG (dollar sign path, filled #6b7280)
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="#6b7280" />
    </svg>
  )
}

function SettingsMenuIcon() {
  // Material Symbols Outlined: settings (stroked, thin) - simplified gear
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.02 7.02 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  )
}

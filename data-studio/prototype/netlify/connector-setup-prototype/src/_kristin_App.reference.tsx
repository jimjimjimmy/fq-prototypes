import React, { useState, useCallback, useRef } from 'react';
import type {
  EndpointState,
  Param,
  HttpMethod,
  Ingestion,
  DateFormat,
  ResponseFormat,
  SyncMode,
  SyncFrequency,
  FirstRun,
} from './types';
import { buildInitialEndpoints, CLUSTER_DEFAULTS, CLUSTER_LABELS, TEST_RESULTS } from './data';
import WizardStepper from './components/WizardStepper';
import ConnectStep from './components/ConnectStep';
import CdcConnectStep from './components/cdc/CdcConnectStep';
import CdcSelectTables from './components/cdc/CdcSelectTables';
import EndpointSetup from './components/EndpointSetup';
import type { SetupRow } from './components/EndpointSetup';
import Sidebar from './components/Sidebar';
import SectionStepper from './components/SectionStepper';
import RequestDetails from './components/RequestDetails';
import QueryParams from './components/QueryParams';
import Schedule from './components/Schedule';
import GuidePanel from './components/GuidePanel';
import FooterActions from './components/FooterActions';

const initialSetupRows = (): SetupRow[] => [{ id: 0, name: '', path: '', cluster: 'occasionally' }];

const App: React.FC = () => {
  const [screen, setScreen] = useState<'select' | 'dc-wizard' | 'cdc-wizard'>('select');
  const [cdcStep, setCdcStep] = useState(0); // 0=Connect, 1=SelectTables, 2=Validate
  const [wizardStep, setWizardStep] = useState(0); // 0=Connect, 1=Manage endpoints, 2=Review
  const [manageSubStep, setManageSubStep] = useState(0); // 0=endpoint setup list, 1=per-endpoint detail
  const [setupRows, setSetupRows] = useState<SetupRow[]>(initialSetupRows);
  const [endpoints, setEndpoints] = useState<EndpointState[]>(buildInitialEndpoints);
  const [current, setCurrent] = useState(0);
  const [section, setSection] = useState(0);
  const [testing, setTesting] = useState(false);
  const [connectTesting, setConnectTesting] = useState(false);
  const [showConnectionBanner, setShowConnectionBanner] = useState(false);
  const [flashField, setFlashField] = useState<string | null>(null);

  const formRef = useRef<Record<string, string>>({});

  const ep = endpoints[current];

  const updateEndpoint = useCallback(
    (index: number, updater: (ep: EndpointState) => EndpointState) => {
      setEndpoints((prev) => prev.map((e, i) => (i === index ? updater(e) : e)));
    },
    [],
  );

  // Request details field changes — track in formRef
  const handleRequestChange = useCallback(
    (field: string, value: string) => {
      formRef.current[field] = value;
      // Also update live state for guide panel reactivity
      updateEndpoint(current, (ep) => {
        const defaults = CLUSTER_DEFAULTS[ep.cluster];
        const base = ep.confirmed.request || {
          path: ep.path,
          method: 'GET' as HttpMethod,
          ingestion: defaults.ingestion,
          dateParam: defaults.dateParam,
          dateFormat: 'ISO 8601' as DateFormat,
          respFormat: 'JSON' as ResponseFormat,
        };
        return {
          ...ep,
          confirmed: {
            ...ep.confirmed,
            request: { ...base, [field]: value },
          },
        };
      });
    },
    [current, updateEndpoint],
  );

  const handleScheduleChange = useCallback(
    (field: string, value: string) => {
      formRef.current[field] = value;
      updateEndpoint(current, (ep) => {
        const defaults = CLUSTER_DEFAULTS[ep.cluster];
        const base = ep.confirmed.schedule || {
          mode: defaults.syncMode,
          freq: defaults.freq,
          first: defaults.first,
          retries: '3',
        };
        return {
          ...ep,
          confirmed: {
            ...ep.confirmed,
            schedule: { ...base, [field]: value },
          },
        };
      });
    },
    [current, updateEndpoint],
  );

  const handleParamsChange = useCallback(
    (params: Param[]) => {
      updateEndpoint(current, (ep) => ({ ...ep, params }));
    },
    [current, updateEndpoint],
  );

  const handleNoParamsChange = useCallback(
    (val: boolean) => {
      updateEndpoint(current, (ep) => ({ ...ep, noParams: val }));
    },
    [current, updateEndpoint],
  );

  // Confirm section
  const handleContinue = useCallback(() => {
    updateEndpoint(current, (ep) => {
      const newSections = [...ep.sections] as [boolean, boolean, boolean];
      newSections[section] = true;

      const newConfirmed = { ...ep.confirmed };

      if (section === 0) {
        const defaults = CLUSTER_DEFAULTS[ep.cluster];
        const existing = ep.confirmed.request;
        newConfirmed.request = {
          path: existing?.path ?? ep.path,
          method: (existing?.method ?? 'GET') as HttpMethod,
          ingestion: (existing?.ingestion ?? defaults.ingestion) as Ingestion,
          dateParam: existing?.dateParam ?? defaults.dateParam,
          dateFormat: (existing?.dateFormat ?? 'ISO 8601') as DateFormat,
          respFormat: (existing?.respFormat ?? 'JSON') as ResponseFormat,
        };
      } else if (section === 1) {
        newConfirmed.params = ep.noParams ? [] : [...ep.params];
      } else if (section === 2) {
        const defaults = CLUSTER_DEFAULTS[ep.cluster];
        const existing = ep.confirmed.schedule;
        newConfirmed.schedule = {
          mode: (existing?.mode ?? defaults.syncMode) as SyncMode,
          freq: (existing?.freq ?? defaults.freq) as SyncFrequency,
          first: (existing?.first ?? defaults.first) as FirstRun,
          retries: existing?.retries ?? '3',
        };
      }

      return { ...ep, sections: newSections, confirmed: newConfirmed };
    });

    if (section < 2) {
      setSection(section + 1);
    }
  }, [current, section, updateEndpoint]);

  // Test endpoint
  const handleTest = useCallback(() => {
    if (testing || ep.tested) return;
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      updateEndpoint(current, (ep) => ({ ...ep, tested: true }));
    }, 900);
  }, [current, ep.tested, testing, updateEndpoint]);

  // Navigate endpoints
  const handleSelectEndpoint = useCallback(
    (index: number) => {
      if (index !== current) {
        formRef.current = {};
        setCurrent(index);
        setSection(0);
      }
    },
    [current],
  );

  const handlePrevEndpoint = useCallback(() => {
    if (current > 0) handleSelectEndpoint(current - 1);
  }, [current, handleSelectEndpoint]);

  const handleNextEndpoint = useCallback(() => {
    if (current < endpoints.length - 1) handleSelectEndpoint(current + 1);
  }, [current, endpoints.length, handleSelectEndpoint]);

  // Add new endpoint
  const handleAddEndpoint = useCallback(() => {
    const newEp: EndpointState = {
      name: 'New Endpoint',
      path: '',
      cluster: 'occasionally',
      params: [{ k: '', v: '', t: 'String' }],
      sections: [false, false, false],
      tested: false,
      noParams: false,
      confirmed: { request: null, params: null, schedule: null },
    };
    setEndpoints((prev) => [...prev, newEp]);
    setCurrent(endpoints.length);
    setSection(0);
    formRef.current = {};
  }, [endpoints.length]);

  // Navigate to field from guide panel
  const handleNavigateToField = useCallback(
    (targetSection: number, field: string) => {
      setSection(targetSection);
      setFlashField(field);
      setTimeout(() => setFlashField(null), 1800);
    },
    [],
  );

  // Section tab click — no capture/confirm
  const handleSectionSelect = useCallback((index: number) => {
    setSection(index);
  }, []);

  // Advance from endpoint setup list to per-endpoint detail
  const handleSetupNext = useCallback(() => {
    setEndpoints(
      setupRows.map(row => ({
        name: row.name || 'New Endpoint',
        path: row.path || '',
        cluster: row.cluster,
        params: [{ k: '', v: '', t: 'String' }],
        sections: [false, false, false] as [boolean, boolean, boolean],
        tested: false,
        noParams: false,
        confirmed: { request: null, params: null, schedule: null },
      }))
    );
    setCurrent(0);
    setSection(0);
    setManageSubStep(1);
  }, [setupRows]);

  const testResult = ep.tested ? TEST_RESULTS[ep.path] || { status: 200, ms: 200, fields: 10 } : null;

  // ── Connector selection screen ──────────────────────────────────────────
  if (screen === 'select') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'var(--fq-color-bg-page)' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fq-color-text-primary)', margin: '0 0 6px' }}>
            Select Your Connector
          </h1>
          <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: '0 0 28px' }}>
            Choose the connector type you want to configure.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* DC API */}
            <button
              onClick={() => { setWizardStep(0); setScreen('dc-wizard'); }}
              style={{
                flex: 1,
                padding: '24px 20px',
                background: '#fff',
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-lg)',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: 'var(--fq-shadow-sm)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fq-color-primary)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px rgba(0,135,90,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fq-color-border)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--fq-shadow-sm)';
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fq-color-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DC API</div>
              <div style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', lineHeight: 1.5 }}>
                Connect a customer's REST API as a data source.
              </div>
            </button>

            {/* CDC */}
            <button
              onClick={() => { setCdcStep(0); setScreen('cdc-wizard'); }}
              style={{
                flex: 1,
                padding: '24px 20px',
                background: '#fff',
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-lg)',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: 'var(--fq-shadow-sm)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fq-color-primary)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px rgba(0,135,90,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fq-color-border)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--fq-shadow-sm)';
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fq-color-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>CDC</div>
              <div style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', lineHeight: 1.5 }}>
                Connect a NetSuite or Sage Intacct source using change data capture.
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CDC wizard ────────────────────────────────────────────────────────────
  if (screen === 'cdc-wizard') {
    const CDC_STEPS = ['Connect', 'Select Tables', 'Validate'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Pinned top chrome */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, background: '#fff', borderBottom: '1px solid var(--fq-color-border)' }}>
            <button
              onClick={() => setScreen('select')}
              style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Cancel
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fq-color-text-primary)' }}>Add Connector</span>
            <button style={{ padding: '6px 16px', fontSize: 13, fontWeight: 500, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}>
              Save as Draft
            </button>
          </div>
          <WizardStepper activeStep={cdcStep} steps={CDC_STEPS} />
        </div>

        {/* Step 0: Connect */}
        {cdcStep === 0 && (
          <>
            <CdcConnectStep onTestSuccess={() => {}} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#fff', borderTop: '1px solid var(--fq-color-border)', flexShrink: 0 }}>
              <button
                onClick={() => setScreen('select')}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setCdcStep(1)}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 'var(--fq-radius-md)', background: 'var(--fq-color-primary)', color: '#fff', cursor: 'pointer' }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 1: Select Tables */}
        {cdcStep === 1 && (
          <>
            <CdcSelectTables />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#fff', borderTop: '1px solid var(--fq-color-border)', flexShrink: 0 }}>
              <button
                onClick={() => setCdcStep(0)}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
              >
                Back
              </button>
              <span style={{ fontSize: 13, color: 'var(--fq-color-text-muted)', fontStyle: 'italic' }}>
                Standard tables are required and cannot be removed
              </span>
              <button
                onClick={() => setCdcStep(2)}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 'var(--fq-radius-md)', background: 'var(--fq-color-primary)', color: '#fff', cursor: 'pointer' }}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Validate (placeholder) */}
        {cdcStep === 2 && (
          <>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fq-color-bg-page)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fq-color-text-primary)', marginBottom: 8 }}>Validating connection…</p>
                <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>Your tables are being verified. This step is coming soon.</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#fff', borderTop: '1px solid var(--fq-color-border)', flexShrink: 0 }}>
              <button
                onClick={() => setCdcStep(1)}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 'var(--fq-radius-md)', background: 'var(--fq-color-gray-300)', color: 'var(--fq-color-text-muted)', cursor: 'not-allowed' }}
                disabled
              >
                Finish
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── DC API wizard ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* ── Pinned top chrome ── */}
      <div style={{ flexShrink: 0 }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 52,
            background: '#fff',
            borderBottom: '1px solid var(--fq-color-border)',
          }}
        >
          <button
            onClick={() => setScreen('select')}
            style={{
              fontSize: 13,
              color: 'var(--fq-color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Cancel
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fq-color-text-primary)' }}>
            Add Connector
          </span>
          <button
            style={{
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid var(--fq-color-border)',
              borderRadius: 'var(--fq-radius-md)',
              background: '#fff',
              color: 'var(--fq-color-text-primary)',
              cursor: 'pointer',
            }}
          >
            Save as Draft
          </button>
        </div>

        {/* Wizard stepper */}
        <WizardStepper activeStep={wizardStep} />
      </div>

      {/* ── Scrollable middle + pinned footer (step-dependent) ── */}

      {/* Step 0: Connect */}
      {wizardStep === 0 && (
        <>
          <ConnectStep />
          {/* Pinned footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid var(--fq-color-border)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setScreen('select')}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              disabled={connectTesting}
              onClick={() => {
                setConnectTesting(true);
                setTimeout(() => {
                  setConnectTesting(false);
                  setShowConnectionBanner(true);
                  setWizardStep(1);
                  setTimeout(() => setShowConnectionBanner(false), 5000);
                }, 900);
              }}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--fq-radius-md)',
                background: connectTesting ? 'var(--fq-color-gray-300)' : 'var(--fq-color-primary)',
                color: connectTesting ? 'var(--fq-color-text-muted)' : '#fff',
                cursor: connectTesting ? 'not-allowed' : 'pointer',
              }}
            >
              {connectTesting ? 'Testing connection...' : 'Test Connection'}
            </button>
          </div>
        </>
      )}

      {/* Step 1a: Endpoint setup list */}
      {wizardStep === 1 && manageSubStep === 0 && (
        <>
          {/* Success banner — always in DOM to prevent layout shift */}
          <div style={{
            padding: '0 48px',
            background: 'var(--fq-color-bg-page)',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '100%',
              maxWidth: 700,
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 'var(--fq-radius-md)',
              fontSize: 13,
              color: '#166534',
              fontWeight: 500,
              opacity: showConnectionBanner ? 1 : 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7.5" stroke="#16a34a" />
                <path d="M4.5 8L7 10.5L11.5 5.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Connection test was successful.
            </div>
          </div>
          <EndpointSetup
            rows={setupRows}
            onChange={setSetupRows}
          />
          {/* Pinned footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid var(--fq-color-border)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setWizardStep(0)}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
            >
              Back
            </button>
            <button
              onClick={handleSetupNext}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 'var(--fq-radius-md)', background: 'var(--fq-color-primary)', color: '#fff', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 1b: Manage Endpoints — per-endpoint detail */}
      {wizardStep === 1 && manageSubStep === 1 && (
        <>
          {/* Three-panel body — scrolls internally */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Sidebar */}
            <Sidebar
              endpoints={endpoints}
              current={current}
              onSelect={handleSelectEndpoint}
              onAdd={handleAddEndpoint}
            />

            {/* Main content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: 'var(--fq-color-bg-page)' }}>
              {/* Endpoint header */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--fq-color-text-primary)', margin: 0 }}>
                  {ep.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--fq-color-text-muted)' }}>{ep.path || '/...'}</span>
                  <span style={{ fontSize: 11, color: 'var(--fq-color-text-muted)' }}>·</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 'var(--fq-radius-full)', background: 'var(--fq-color-gray-100)', color: 'var(--fq-color-text-secondary)' }}>
                    {CLUSTER_LABELS[ep.cluster]}
                  </span>
                </div>
              </div>

              {/* Section stepper */}
              <SectionStepper
                active={section}
                completed={ep.sections}
                onSelect={handleSectionSelect}
              />

              {/* Section content card */}
              <div style={{ background: 'var(--fq-color-bg-card)', borderRadius: 'var(--fq-radius-lg)', padding: 24, boxShadow: 'var(--fq-shadow-sm)' }}>
                {section === 0 && (
                  <RequestDetails endpoint={ep} onChange={handleRequestChange} flashField={flashField} />
                )}
                {section === 1 && (
                  <QueryParams
                    params={ep.params}
                    noParams={ep.noParams}
                    onParamsChange={handleParamsChange}
                    onNoParamsChange={handleNoParamsChange}
                  />
                )}
                {section === 2 && (
                  <Schedule endpoint={ep} onChange={handleScheduleChange} />
                )}
                <FooterActions
                  section={section}
                  tested={ep.tested}
                  testing={testing}
                  testPassed={ep.tested}
                  onTest={handleTest}
                  onContinue={handleContinue}
                  onBack={() => setSection((s) => Math.max(0, s - 1))}
                  prevEndpoint={current > 0 ? endpoints[current - 1].name : null}
                  nextEndpoint={current < endpoints.length - 1 ? endpoints[current + 1].name : null}
                  onPrev={handlePrevEndpoint}
                  onNext={handleNextEndpoint}
                />
              </div>
            </div>

            {/* Guide panel */}
            <GuidePanel
              endpoint={ep}
              endpointIndex={current}
              totalEndpoints={endpoints.length}
              testResult={testResult}
              onNavigateToField={handleNavigateToField}
            />
          </div>

          {/* Pinned footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid var(--fq-color-border)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setManageSubStep(0)}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', background: '#fff', color: 'var(--fq-color-text-primary)', cursor: 'pointer' }}
            >
              Back
            </button>
            <button
              onClick={() => setWizardStep(2)}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 'var(--fq-radius-md)', background: 'var(--fq-color-primary)', color: '#fff', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

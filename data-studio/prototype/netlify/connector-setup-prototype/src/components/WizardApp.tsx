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
} from '../types';
import { buildInitialEndpoints, CLUSTER_DEFAULTS, CLUSTER_LABELS, TEST_RESULTS } from '../data';
import WizardStepper from './WizardStepper';
import ConnectStep from './ConnectStep';
import CdcConnectStep from './cdc/CdcConnectStep';
import CdcSelectTables from './cdc/CdcSelectTables';
import EndpointSetup from './EndpointSetup';
import type { SetupRow } from './EndpointSetup';
import Sidebar from './Sidebar';
import SectionStepper from './SectionStepper';
import RequestDetails from './RequestDetails';
import QueryParams from './QueryParams';
import Schedule from './Schedule';
import GuidePanel from './GuidePanel';
import FooterActions from './FooterActions';
import { chooseWizardBranch, choiceLabel } from '../lib/connectorChoice';
import type { ConnectorChoice } from '../lib/connectorChoice';

const initialSetupRows = (): SetupRow[] => [{ id: 0, name: '', path: '', cluster: 'occasionally' }];

type Props = {
  choice: ConnectorChoice;
  onCancel: () => void;
  onBackToPicker: () => void;
};

const WizardApp: React.FC<Props> = ({ choice, onCancel, onBackToPicker }) => {
  const branch = chooseWizardBranch(choice);
  const label = choiceLabel(choice);

  const [cdcStep, setCdcStep] = useState(0);
  const [wizardStep, setWizardStep] = useState(0);
  const [manageSubStep, setManageSubStep] = useState(0);
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

  const handleRequestChange = useCallback(
    (field: string, value: string) => {
      formRef.current[field] = value;
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
          confirmed: { ...ep.confirmed, request: { ...base, [field]: value } },
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
          confirmed: { ...ep.confirmed, schedule: { ...base, [field]: value } },
        };
      });
    },
    [current, updateEndpoint],
  );

  const handleParamsChange = useCallback(
    (params: Param[]) => updateEndpoint(current, (ep) => ({ ...ep, params })),
    [current, updateEndpoint],
  );

  const handleNoParamsChange = useCallback(
    (val: boolean) => updateEndpoint(current, (ep) => ({ ...ep, noParams: val })),
    [current, updateEndpoint],
  );

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
    if (section < 2) setSection(section + 1);
  }, [current, section, updateEndpoint]);

  const handleTest = useCallback(() => {
    if (testing || ep.tested) return;
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      updateEndpoint(current, (ep) => ({ ...ep, tested: true }));
    }, 900);
  }, [current, ep.tested, testing, updateEndpoint]);

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

  const handleNavigateToField = useCallback((targetSection: number, field: string) => {
    setSection(targetSection);
    setFlashField(field);
    setTimeout(() => setFlashField(null), 1800);
  }, []);

  const handleSectionSelect = useCallback((index: number) => setSection(index), []);

  const handleSetupNext = useCallback(() => {
    setEndpoints(
      setupRows.map((row) => ({
        name: row.name || 'New Endpoint',
        path: row.path || '',
        cluster: row.cluster,
        params: [{ k: '', v: '', t: 'String' }],
        sections: [false, false, false] as [boolean, boolean, boolean],
        tested: false,
        noParams: false,
        confirmed: { request: null, params: null, schedule: null },
      })),
    );
    setCurrent(0);
    setSection(0);
    setManageSubStep(1);
  }, [setupRows]);

  const testResult = ep.tested ? TEST_RESULTS[ep.path] || { status: 200, ms: 200, fields: 10 } : null;

  // Top chrome shared by both branches
  const topChrome = (
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
        onClick={onBackToPicker}
        style={{
          fontSize: 13,
          color: 'var(--fq-color-text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Back to selection
      </button>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fq-color-text-primary)' }}>
        Set up {label}
      </span>
      <button
        onClick={onCancel}
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
        Cancel
      </button>
    </div>
  );

  // ── CDC wizard ──────────────────────────────────────────────────────────
  if (branch === 'cdc') {
    const CDC_STEPS = ['Connect', 'Select Tables', 'Validate'];
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}
      >
        <div style={{ flexShrink: 0 }}>
          {topChrome}
          <WizardStepper activeStep={cdcStep} steps={CDC_STEPS} />
        </div>

        {cdcStep === 0 && (
          <>
            <CdcConnectStep onTestSuccess={() => {}} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                background: '#fff',
                borderTop: '1px solid var(--fq-color-border)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={onBackToPicker}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--fq-color-border)',
                  borderRadius: 'var(--fq-radius-md)',
                  background: '#fff',
                  color: 'var(--fq-color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={() => setCdcStep(1)}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--fq-radius-md)',
                  background: 'var(--fq-color-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {cdcStep === 1 && (
          <>
            <CdcSelectTables />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                background: '#fff',
                borderTop: '1px solid var(--fq-color-border)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setCdcStep(0)}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--fq-color-border)',
                  borderRadius: 'var(--fq-radius-md)',
                  background: '#fff',
                  color: 'var(--fq-color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <span style={{ fontSize: 13, color: 'var(--fq-color-text-muted)', fontStyle: 'italic' }}>
                Standard tables are required and cannot be removed
              </span>
              <button
                onClick={() => setCdcStep(2)}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--fq-radius-md)',
                  background: 'var(--fq-color-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {cdcStep === 2 && (
          <>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--fq-color-bg-page)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--fq-color-text-primary)',
                    marginBottom: 8,
                  }}
                >
                  Validating connection…
                </p>
                <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>
                  Your tables are being verified. This step is coming soon.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                background: '#fff',
                borderTop: '1px solid var(--fq-color-border)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setCdcStep(1)}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--fq-color-border)',
                  borderRadius: 'var(--fq-radius-md)',
                  background: '#fff',
                  color: 'var(--fq-color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={onCancel}
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--fq-radius-md)',
                  background: 'var(--fq-color-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
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
      <div style={{ flexShrink: 0 }}>
        {topChrome}
        <WizardStepper activeStep={wizardStep} />
      </div>

      {wizardStep === 0 && (
        <>
          <ConnectStep />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 24px',
              background: '#fff',
              borderTop: '1px solid var(--fq-color-border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={onBackToPicker}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-md)',
                background: '#fff',
                color: 'var(--fq-color-text-primary)',
                cursor: 'pointer',
              }}
            >
              Back
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

      {wizardStep === 1 && manageSubStep === 0 && (
        <>
          <div
            style={{ padding: '0 48px', background: 'var(--fq-color-bg-page)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}
          >
            <div
              style={{
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
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7.5" stroke="#16a34a" />
                <path
                  d="M4.5 8L7 10.5L11.5 5.5"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Connection test was successful.
            </div>
          </div>
          <EndpointSetup rows={setupRows} onChange={setSetupRows} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 24px',
              background: '#fff',
              borderTop: '1px solid var(--fq-color-border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setWizardStep(0)}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-md)',
                background: '#fff',
                color: 'var(--fq-color-text-primary)',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={handleSetupNext}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--fq-radius-md)',
                background: 'var(--fq-color-primary)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {wizardStep === 1 && manageSubStep === 1 && (
        <>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Sidebar
              endpoints={endpoints}
              current={current}
              onSelect={handleSelectEndpoint}
              onAdd={handleAddEndpoint}
            />
            <div
              style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: 'var(--fq-color-bg-page)' }}
            >
              <div style={{ marginBottom: 20 }}>
                <h2
                  style={{ fontSize: 16, fontWeight: 700, color: 'var(--fq-color-text-primary)', margin: 0 }}
                >
                  {ep.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--fq-color-text-muted)' }}>{ep.path || '/...'}</span>
                  <span style={{ fontSize: 11, color: 'var(--fq-color-text-muted)' }}>·</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 8px',
                      borderRadius: 'var(--fq-radius-full)',
                      background: 'var(--fq-color-gray-100)',
                      color: 'var(--fq-color-text-secondary)',
                    }}
                  >
                    {CLUSTER_LABELS[ep.cluster]}
                  </span>
                </div>
              </div>
              <SectionStepper active={section} completed={ep.sections} onSelect={handleSectionSelect} />
              <div
                style={{
                  background: 'var(--fq-color-bg-card)',
                  borderRadius: 'var(--fq-radius-lg)',
                  padding: 24,
                  boxShadow: 'var(--fq-shadow-sm)',
                }}
              >
                <div style={{ minHeight: 385 }}>
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
                  {section === 2 && <Schedule endpoint={ep} onChange={handleScheduleChange} />}
                </div>
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
            <GuidePanel
              endpoint={ep}
              endpointIndex={current}
              totalEndpoints={endpoints.length}
              testResult={testResult}
              onNavigateToField={handleNavigateToField}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 24px',
              background: '#fff',
              borderTop: '1px solid var(--fq-color-border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setManageSubStep(0)}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-md)',
                background: '#fff',
                color: 'var(--fq-color-text-primary)',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--fq-radius-md)',
                background: 'var(--fq-color-primary)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Finish
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WizardApp;

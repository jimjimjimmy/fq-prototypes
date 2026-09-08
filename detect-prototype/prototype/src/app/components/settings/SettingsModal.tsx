import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Download,
  GripVertical,
  Search,
  X,
} from 'lucide-react';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import { team, getTeamMember, currentUserId } from '../../../data/team';
import {
  getLookbackMonths,
  setLookbackMonths,
} from '../../../data/lookbackSetting';
import { DiscardChangesDialog } from '../rules/DiscardChangesDialog';

/**
 * Settings workspace modal — wired from the toolbar "Settings" button
 * on the Transactions page. Mirrors the RulesListModal shell so the two
 * toolbar shortcuts feel like siblings. Layout is iPad-Settings: left
 * nav rail for sections, right pane for the section's content.
 *
 * Section content is sourced from the 5/12/26 sync with Gaurav:
 *   • General — Strict Sign-off Mode toggle, Lookback Period dropdown,
 *               Ultimate Owner dropdown (with explanatory copy).
 *   • Anomaly Assignment — download/upload template flow for setting
 *               fallback assignees at the GL-account level. No inline
 *               list of accounts (100–1000 rows; that UI is post-GA).
 *   • Transaction Details — global default field visibility/order picker
 *               with copy noting that per-user local customizations
 *               override this setting.
 *   • Enhanced Detections — placeholder only. Per Gaurav: "Do not build
 *               this yet" — Data Platform / Data Studio may own it.
 *
 * All state is local to this modal (no persistence) — this is a
 * prototype-level shell for demoing the experience.
 */

type SectionId =
  | 'general'
  | 'anomaly-assignment'
  | 'transaction-details'
  | 'enhanced-detections';

// Set `hidden: true` to keep a section's code in the prototype but
// drop it from the sidebar. Currently Enhanced Detections is hidden
// while it's pending scoping; flip to false to bring it back.
const SECTIONS: { id: SectionId; label: string; hidden?: boolean }[] = [
  { id: 'general', label: 'General' },
  { id: 'anomaly-assignment', label: 'Anomaly Assignment' },
  { id: 'transaction-details', label: 'Transaction Details' },
  { id: 'enhanced-detections', label: 'Enhanced Detections', hidden: true },
];
const VISIBLE_SECTIONS = SECTIONS.filter((s) => !s.hidden);

// Default ordered + visibility list for the global Transaction Details
// field picker. Mirrors the field list used locally in
// detail/TransactionDetails.tsx so the admin default and the local
// override agree on what fields exist.
type FieldRow = { id: string; label: string; visible: boolean };
const DEFAULT_FIELDS: FieldRow[] = [
  { id: 'transactionId', label: 'Transaction ID', visible: false },
  { id: 'transactionLine', label: 'Transaction Line', visible: false },
  { id: 'transactionDate', label: 'Transaction Date', visible: true },
  { id: 'postingPeriod', label: 'Posting Period', visible: true },
  { id: 'amount', label: 'Amount', visible: true },
  { id: 'currency', label: 'Currency', visible: true },
  { id: 'type', label: 'Type', visible: true },
  { id: 'subsidiary', label: 'Entity', visible: true },
  { id: 'account', label: 'Account', visible: true },
  { id: 'vendor', label: 'Vendor', visible: true },
  { id: 'memo', label: 'Memo', visible: true },
  { id: 'reversalId', label: 'Reversal #', visible: true },
  { id: 'department', label: 'Department', visible: true },
  { id: 'class', label: 'Class', visible: true },
  { id: 'location', label: 'Location', visible: true },
  { id: 'createdDate', label: 'Created Date', visible: true },
  { id: 'createdBy', label: 'Created By', visible: true },
  { id: 'customField1', label: 'Custom Field 1', visible: false },
  { id: 'customField2', label: 'Custom Field 2', visible: false },
  { id: 'customField3', label: 'Custom Field 3', visible: false },
];

export function SettingsModal({
  onClose,
  onSaveSuccess,
  initialSection = 'general',
}: {
  onClose: () => void;
  /** Fired when the user clicks Save inside any section. The host
   *  uses this to show a success toast — the prototype doesn't
   *  persist settings anywhere, so this is the only feedback. The
   *  string is the section label that was saved. */
  onSaveSuccess?: (sectionLabel: string) => void;
  /** Which sidebar section to land on when the modal opens.
   *  Lets the main-page "Set up Anomaly Assignments" CTA jump
   *  directly to that section instead of dropping the user on
   *  General. */
  initialSection?: SectionId;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);
  // Per-section dirty state, mirrored up via each section's
  // onDirtyChange callback. We aggregate across all sections so the
  // modal-level dismissal handlers can offer the discard warning
  // whenever ANY section has unsaved changes.
  const sectionDirty = useRef<Record<SectionId, boolean>>({
    general: false,
    'anomaly-assignment': false,
    'transaction-details': false,
    'enhanced-detections': false,
  });
  const [, forceRerender] = useState(0);
  const updateSectionDirty = (id: SectionId) => (dirty: boolean) => {
    sectionDirty.current[id] = dirty;
    forceRerender((v) => v + 1);
  };
  const anyDirty = Object.values(sectionDirty.current).some(Boolean);
  // Pending dismiss action queued behind the discard warning.
  const [pendingClose, setPendingClose] = useState<null | (() => void)>(null);

  const attemptClose = (action: () => void) => {
    if (anyDirty) setPendingClose(() => action);
    else action();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (pendingClose) {
        setPendingClose(null);
        return;
      }
      attemptClose(onClose);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, anyDirty, pendingClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={() => attemptClose(onClose)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-[#e1e6ef] px-6 py-4">
          <h2 className="font-header text-lg font-bold leading-6 text-[#1d2433]">
            Settings
          </h2>
          <button
            type="button"
            onClick={() => attemptClose(onClose)}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {/* Left nav rail — FlowUI Side Bar pattern.
              Frame: 260px wide, p-24, right border. Items use the
              "dropdown-panel-item" treatment from the Figma source: 45px
              row, 4px gap between items, and on the active item an
              inner rounded-6 fill so the active pill reads as inset
              inside the row's rounded-8 wrapper. */}
          <nav className="flex w-[260px] min-w-[260px] max-w-[300px] shrink-0 flex-col gap-4 border-r border-[#e1e6ef] bg-white p-6">
            <div className="flex w-full flex-col gap-1">
              {VISIBLE_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  // FlowUI dropdown-panel-item: both active selection and
                  // hover render on the inner rounded-6 pill so the two
                  // states have identical width and inset — the outer
                  // button is just a hit target, not a visual surface.
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className="group flex h-[45px] w-full items-center px-[6px] py-[9px] text-left"
                  >
                    <span
                      className={
                        isActive
                          ? 'flex h-[43px] flex-1 items-center overflow-hidden rounded-[6px] bg-[#e1e6ef] px-[10px] transition-colors'
                          : 'flex h-[43px] flex-1 items-center overflow-hidden rounded-[6px] px-[10px] transition-colors group-hover:bg-[#f1f3f9]'
                      }
                    >
                      <span
                        className={
                          isActive
                            ? 'truncate font-body text-xs font-semibold leading-[18px] text-[#0a0d14]'
                            : 'truncate font-body text-xs font-semibold leading-[18px] text-[#424867] transition-colors group-hover:text-[#1d2433]'
                        }
                      >
                        {section.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right content pane — uses flex-col so each section can
               own its layout: scrollable content area + pinned
               footer at the bottom. No overflow on this wrapper. */}
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            {/* Each section reports its dirty state up to the modal
                 so the modal can guard its close handlers. The
                 sections always stay mounted in memory even when
                 hidden — but here we mount on activation, so the
                 dirty reports happen as each section becomes
                 active. (Cross-section dirty persistence is not a
                 concern for the prototype.) */}
            {activeSection === 'general' && (
              <GeneralSection
                onSave={() => onSaveSuccess?.('General')}
                onDirtyChange={updateSectionDirty('general')}
              />
            )}
            {activeSection === 'anomaly-assignment' && (
              <AnomalyAssignmentSection
                onSave={() => onSaveSuccess?.('Anomaly Assignment')}
                onDirtyChange={updateSectionDirty('anomaly-assignment')}
              />
            )}
            {activeSection === 'transaction-details' && (
              <TransactionDetailsSection
                onSave={() => onSaveSuccess?.('Transaction Details')}
                onDirtyChange={updateSectionDirty('transaction-details')}
              />
            )}
            {activeSection === 'enhanced-detections' && <EnhancedDetectionsSection />}
          </div>
        </div>
      </div>

      {pendingClose && (
        <DiscardChangesDialog
          onKeepEditing={() => setPendingClose(null)}
          onDiscard={() => {
            const action = pendingClose;
            setPendingClose(null);
            // Clear every section's dirty flag so the next close
            // attempt isn't gated against the same stale state.
            sectionDirty.current = {
              general: false,
              'anomaly-assignment': false,
              'transaction-details': false,
              'enhanced-detections': false,
            };
            action();
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* General                                                                    */
/* -------------------------------------------------------------------------- */

// Initial values used both to seed General section state and to
// compute its dirty/clean state for the Save button.
const GENERAL_INITIAL = {
  strictSignoff: false,
  lookbackMonths: 24,
};

function GeneralSection({
  onSave,
  onDirtyChange,
}: {
  onSave: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [strictSignoff, setStrictSignoff] = useState(GENERAL_INITIAL.strictSignoff);
  // Hydrate from the persisted localStorage value so Settings →
  // General and the Insights detail pane stay in sync after a
  // reload. Renamed the local setter to avoid shadowing the
  // `setLookbackMonths` writer imported from lookbackSetting.
  const [lookbackMonths, setLocalLookbackMonths] = useState<number>(() =>
    getLookbackMonths(),
  );
  // Snapshot of the last-saved values. Resets on Save so the dirty
  // calc compares against the most recent saved state, not the
  // module-level defaults. The lookback portion of the snapshot is
  // hydrated from localStorage so that switching tabs / closing
  // and reopening Settings doesn't show a dirty state when the
  // user hasn't actually changed anything.
  const [savedSnapshot, setSavedSnapshot] = useState(() => ({
    ...GENERAL_INITIAL,
    lookbackMonths: getLookbackMonths(),
  }));

  const dirty =
    strictSignoff !== savedSnapshot.strictSignoff ||
    lookbackMonths !== savedSnapshot.lookbackMonths;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleSave = () => {
    // Persist the lookback to localStorage + broadcast so the
    // Insights detail pane re-renders with the new window. The
    // other settings stay in component-local state for now.
    setLookbackMonths(lookbackMonths);
    setSavedSnapshot({ strictSignoff, lookbackMonths });
    onSave();
  };

  return (
    <SectionShell onSave={handleSave} dirty={dirty}>
      <SettingRow
        label="Strict Sign-off Mode"
        copy="When enabled, anomalous transactions can only be signed off by assignees or Admins/Managers."
      >
        <Toggle checked={strictSignoff} onChange={setStrictSignoff} />
      </SettingRow>

      <Divider />

      <SettingRow
        label="Lookback Period"
        copy="Determines how much rolling historical data the AI analyzes to establish “normal” behavior for your GL accounts. A longer period typically improves detection accuracy by accounting for seasonal trends."
        vertical
      >
        <FlowDropdown
          value={String(lookbackMonths)}
          onChange={(v) => setLocalLookbackMonths(Number(v))}
          options={Array.from({ length: 24 }, (_, i) => {
            const n = i + 1;
            return { value: String(n), label: `${n} ${n === 1 ? 'month' : 'months'}` };
          })}
          width={220}
        />
      </SettingRow>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Anomaly Assignment                                                         */
/* -------------------------------------------------------------------------- */

type UploadMeta = {
  name: string;
  uploadedBy: string;
  uploadedAt: string;
};

function AnomalyAssignmentSection({
  onSave,
  onDirtyChange,
}: {
  onSave: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  // Ultimate owner starts unset — the admin must explicitly pick who
  // catches anomalies as the absolute fallback. Lives at the top of
  // this section so it's the first thing the user sees when configuring
  // anomaly assignment; it's conceptually upstream of the fallback
  // assignees file (it kicks in only when every other path fails).
  // Persisted to localStorage so the main-page "Enable Notifications"
  // banner can see whether it's set and auto-clear once the user picks
  // someone. Key matches the one the (removed) onboarding wizard used,
  // so any historical setup carries over.
  const initialUltimateOwner = useMemo(() => {
    try {
      return localStorage.getItem('detect-ultimate-owner') ?? '';
    } catch {
      return '';
    }
  }, []);
  const [ultimateOwner, setUltimateOwner] = useState<string>(initialUltimateOwner);
  const [savedUltimateOwner, setSavedUltimateOwner] = useState<string>(initialUltimateOwner);

  // Always show a file card. Until the user uploads their own,
  // it represents a blank fallback-assignees template seeded by
  // FloQast — the user can still download that starter template
  // from the card itself. Uploading their own filled-in file
  // replaces the meta with their filename + "You" as uploader.
  const DEFAULT_TEMPLATE_META: UploadMeta = {
    name: 'Detect_Anomaly_Routing.csv',
    uploadedBy: 'FloQast',
    uploadedAt: '01/01/2026',
  };
  const [uploadMeta, setUploadMeta] = useState<UploadMeta>(DEFAULT_TEMPLATE_META);
  const [savedUpload, setSavedUpload] = useState<UploadMeta>(DEFAULT_TEMPLATE_META);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dirty =
    uploadMeta.name !== savedUpload.name ||
    ultimateOwner !== savedUltimateOwner;

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleSave = () => {
    setSavedUpload(uploadMeta);
    setSavedUltimateOwner(ultimateOwner);
    // Persist so the main-page banner can react to the change.
    try {
      if (ultimateOwner) {
        localStorage.setItem('detect-ultimate-owner', ultimateOwner);
      } else {
        localStorage.removeItem('detect-ultimate-owner');
      }
      // Broadcast a custom event so the App banner re-reads localStorage
      // without needing a polling loop. Same-tab `storage` events don't
      // fire, so we use a custom event name instead.
      window.dispatchEvent(new Event('detect:ultimate-owner-changed'));
    } catch {
      /* localStorage may be unavailable — banner state will recover on reload */
    }
    onSave();
  };

  const handleFile = (file: File) => {
    // MM/DD/YYYY format to match the default-template card.
    const today = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    // Use the signed-in user's real name (e.g. "Olivia Reed")
    // instead of a generic "You" — matches how the audit trail
    // reads in activity logs elsewhere.
    const uploaderName = getTeamMember(currentUserId)?.name ?? 'You';
    setUploadMeta({
      name: file.name,
      uploadedBy: uploaderName,
      uploadedAt: today,
    });
  };

  return (
    <SectionShell onSave={handleSave} dirty={dirty} gap="md">
      {/* Ultimate Owner — sits at the top of Anomaly Assignment as the
           catch-all-of-catch-alls. Reads first because it's the answer to
           "if everything else fails, who gets the anomaly?" — the rest of
           this section is about the more specific Fallback Assignees file. */}
      <SettingRow
        label="Ultimate Owner"
        copy="The user who will be listed as the assignee for all unassigned anomalous transactions."
        vertical
      >
        <UserSelect value={ultimateOwner} onChange={setUltimateOwner} />
      </SettingRow>

      <Divider />

      {/* Intro + numbered workflow steps. The Download template
           action is inlined as a text link in step 1 — no standalone
           CTA outside the upload container so the upload zone is the
           sole call to action below. The "Fallback Assignees" title
           mirrors the Ultimate Owner label above so the two reads as
           parallel sub-sections. */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            Anomaly Routing
          </p>
          <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
            Define who should be notified for anomalies on a per entity and account basis.
          </p>
        </div>
        <ol className="list-decimal pl-5 font-body text-xs font-normal leading-[18px] text-[#424867] marker:font-semibold marker:text-[#1d2433]">
          <li>
            Download the template below containing a list of all Entities and
            GL accounts.
          </li>
          <li>
            Fill in the <span className="font-semibold">Assignees</span> column.
            Multiple assignees should be semicolon-separated.
          </li>
          <li>Upload the completed file below</li>
        </ol>
      </div>

      {/* "Current state → modify" pattern: the file card sits on
           top so the user sees what's currently configured (and can
           download it) first, then the dashed drop zone below reads
           as "drop a new file here to replace what's above." */}
      <div className="flex flex-col gap-3">
        {/* File card — always rendered. Default state shows the
             blank FloQast template (downloadable, not removable);
             after the user uploads their own filled-in file the
             card flips to show their filename and exposes a trash
             action that reverts to the FloQast default. */}
        <div className="flex items-center gap-3 rounded-md border border-[#e1e6ef] bg-white p-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
              {uploadMeta.name}
            </p>
            <p className="truncate font-body text-[11px] font-normal leading-4 text-[#6b7280]">
              Uploaded by {uploadMeta.uploadedBy} on {uploadMeta.uploadedAt}
            </p>
          </div>
          {/* Download is the only action — there's always an
               assignment file in place (FloQast's blank template
               by default, or the user's uploaded file). To replace
               it, the user uploads a new file via the drop zone
               below; no destructive delete affordance. */}
          <button
            type="button"
            aria-label="Download file"
            title="Download"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* FlowUI File Uploader — compact dashed drop zone with the
             "Upload File" CTA centred inside, supporting copy below,
             and a format-hint line. Mirrors the File-uploader
             component from the Flow UI Assets library (Figma node
             126:6050). */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#cbd2e1] bg-[#f8fafc] px-4 py-8">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-9 items-center rounded-md bg-[#3d7bf7] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#1e4eae]"
          >
            Upload File
          </button>
          <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
            Or drop file here to upload
          </p>
          <p className="font-body text-[11px] font-normal leading-4 text-[#6b7280]">
            CSV
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Transaction Details                                                        */
/* -------------------------------------------------------------------------- */

type TxFieldsVariant = 'a' | 'b' | 'c';

// Toggle this back to true to bring back the A/B/C comparison
// switcher for evaluating the three patterns side-by-side. The
// option components (TxFieldsOptionA/B/C) are preserved below so
// they're ready to render when the switcher is re-enabled.
const COMPARE_PATTERNS = false;

function TransactionDetailsSection({
  onSave,
  onDirtyChange,
}: {
  onSave: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [fields, setFields] = useState<FieldRow[]>(DEFAULT_FIELDS);
  const [search, setSearch] = useState('');
  const [variant, setVariant] = useState<TxFieldsVariant>('a');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  // Snapshot of last-saved fields. Resets on Save so the dirty flag
  // doesn't re-trigger after the user has committed their config.
  const [savedFields, setSavedFields] = useState<FieldRow[]>(DEFAULT_FIELDS);

  const dirty = fields.some(
    (f, i) =>
      savedFields[i] === undefined ||
      f.id !== savedFields[i].id ||
      f.visible !== savedFields[i].visible,
  );

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleSave = () => {
    setSavedFields(fields);
    onSave();
  };

  const trimmed = search.trim().toLowerCase();
  const filtered = trimmed
    ? fields.filter((f) => f.label.toLowerCase().includes(trimmed))
    : fields;
  const allVisible = fields.every((f) => f.visible);

  const toggleField = (id: string) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)),
    );
  const toggleAll = () =>
    setFields((prev) => prev.map((f) => ({ ...f, visible: !allVisible })));

  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setFields((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  return (
    <SectionShell onSave={handleSave} dirty={dirty} gap="sm">
      <div className="flex flex-col gap-2 font-body text-xs font-normal leading-[18px] text-[#424867]">
        <p>
          Set the default fields and order that all users see in the Transaction
          Details panel.
        </p>
        <p>
          <span className="font-semibold text-[#1d2433]">Note:</span> If a user
          has already customized fields, their configuration won&apos;t be
          overwritten.
        </p>
      </div>

      {/* FlowUI info inline-alert — calls out the downstream impact
           on rule authoring so users understand this isn't just a
           display preference but also gates which fields they can
           build rules against. */}
      <div className="flex items-start gap-3 rounded-md border border-[#3d7bf7] bg-[#f0f5ff] p-3">
        <Info size={16} color="#3d7bf7" style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="font-body text-xs font-normal leading-[18px] text-[#1d2433]">
          Fields enabled below will be the fields available when creating a rule
          under Rule Parameters.
        </p>
      </div>

      {COMPARE_PATTERNS && (
        <VariantSwitcher value={variant} onChange={setVariant} />
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#adb2bb]" />
        <input
          type="text"
          placeholder="Search for..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-[#e1e6ef] bg-white pl-9 pr-2 font-body text-xs font-normal leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
        />
      </div>

      {COMPARE_PATTERNS ? (
        <>
          {variant === 'a' && (
            <TxFieldsOptionA fields={fields} setFields={setFields} search={search} />
          )}
          {variant === 'b' && (
            <TxFieldsOptionB fields={fields} setFields={setFields} search={search} />
          )}
          {variant === 'c' && (
            <TxFieldsOptionC fields={fields} setFields={setFields} search={search} />
          )}
        </>
      ) : (
        // Original flat list — every row gets a grip handle + checkbox;
        // visible fields render bold, hidden fields regular weight.
        <div className="flex flex-col rounded-md border border-[#e1e6ef] bg-white">
          {!trimmed && (
            <button
              type="button"
              onClick={toggleAll}
              className="flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 text-left transition-colors hover:bg-[#f8fafc]"
            >
              <span className="w-4" />
              <CheckBox checked={allVisible} />
              <span className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
                Select All
              </span>
            </button>
          )}
          {filtered.map((field) => {
            const realIdx = fields.findIndex((f) => f.id === field.id);
            const isDragging = dragIdx === realIdx;
            return (
              <div
                key={field.id}
                draggable={!trimmed}
                onDragStart={() => setDragIdx(realIdx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(realIdx)}
                onDragEnd={() => setDragIdx(null)}
                onClick={() => toggleField(field.id)}
                className={`flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 transition-colors last:border-b-0 ${
                  isDragging ? 'bg-neutral-100 opacity-50' : 'hover:bg-[#f8fafc]'
                } ${!trimmed ? 'cursor-grab' : 'cursor-pointer'}`}
              >
                <span className="flex w-4 items-center justify-center text-[#cbd2e1]">
                  {!trimmed && <GripVertical className="h-4 w-4" />}
                </span>
                <CheckBox checked={field.visible} />
                <span
                  className={`font-body text-xs leading-[18px] text-[#1d2433] ${
                    field.visible ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {field.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

/* ---------- comparison switcher ---------- */

function VariantSwitcher({
  value,
  onChange,
}: {
  value: TxFieldsVariant;
  onChange: (v: TxFieldsVariant) => void;
}) {
  const options: { id: TxFieldsVariant; label: string; hint: string }[] = [
    { id: 'a', label: 'A', hint: 'Two sections' },
    { id: 'b', label: 'B', hint: 'Demoted single list' },
    { id: 'c', label: 'C', hint: 'Two columns' },
  ];
  return (
    <div className="flex flex-col gap-1 rounded-md border border-dashed border-[#cbd2e1] bg-[#f8fafc] p-3">
      <p className="font-body text-[11px] font-semibold uppercase leading-4 tracking-wide text-[#6b7280]">
        Compare patterns
      </p>
      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 font-body text-xs font-semibold leading-4 transition-colors ${
                active
                  ? 'border-[#1FAC76] bg-white text-[#1d2433]'
                  : 'border-[#e1e6ef] bg-white text-[#424867] hover:border-[#cbd2e1] hover:text-[#1d2433]'
              }`}
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  active ? 'bg-[#1FAC76] text-white' : 'bg-[#e1e6ef] text-[#424867]'
                }`}
              >
                {opt.label}
              </span>
              {opt.hint}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Option A — Two sections (Visible / Hidden) ---------- */

function TxFieldsOptionA({
  fields,
  setFields,
  search,
}: {
  fields: FieldRow[];
  setFields: React.Dispatch<React.SetStateAction<FieldRow[]>>;
  search: string;
}) {
  const trimmed = search.trim().toLowerCase();
  const matches = (f: FieldRow) =>
    !trimmed || f.label.toLowerCase().includes(trimmed);

  const visibleFields = fields.filter((f) => f.visible).filter(matches);
  const hiddenFields = fields.filter((f) => !f.visible).filter(matches);
  const allVisible = fields.every((f) => f.visible);
  const [dragVisIdx, setDragVisIdx] = useState<number | null>(null);

  // Toggle a single field. Newly-toggled fields move to the END of
  // their new section (bottom of Visible / bottom of Hidden) so the
  // user's most recent action is always at the bottom — predictable,
  // and avoids the surprise of a hidden field "snapping back" to its
  // original position when re-enabled.
  const toggleField = (id: string) =>
    setFields((prev) => {
      const field = prev.find((f) => f.id === id);
      if (!field) return prev;
      const without = prev.filter((f) => f.id !== id);
      return [...without, { ...field, visible: !field.visible }];
    });

  const toggleAll = () =>
    setFields((prev) => prev.map((f) => ({ ...f, visible: !allVisible })));

  // Drag reorder INSIDE the Visible section. Translates the
  // visible-subset indices back to the full fields array.
  const onDropVisible = (targetVisIdx: number) => {
    if (dragVisIdx === null || dragVisIdx === targetVisIdx) return;
    const visibleIds = visibleFields.map((f) => f.id);
    const [movedId] = visibleIds.splice(dragVisIdx, 1);
    visibleIds.splice(targetVisIdx, 0, movedId);
    setFields((prev) => {
      const visibleSet = new Set(visibleIds);
      const orderedVisible = visibleIds
        .map((id) => prev.find((f) => f.id === id))
        .filter((f): f is FieldRow => Boolean(f));
      const orderedHidden = prev.filter((f) => !visibleSet.has(f.id));
      return [...orderedVisible, ...orderedHidden];
    });
    setDragVisIdx(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Visible section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            Visible — {visibleFields.length}{' '}
            {visibleFields.length === 1 ? 'field' : 'fields'}
          </h4>
          <button
            type="button"
            onClick={toggleAll}
            className="font-body text-xs font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
          >
            {allVisible ? 'Hide All' : 'Select All'}
          </button>
        </div>
        <div className="flex flex-col rounded-md border border-[#e1e6ef] bg-white">
          {visibleFields.length === 0 ? (
            <p className="px-4 py-3 font-body text-xs font-normal leading-[18px] text-[#6b7280]">
              {trimmed ? 'No visible fields match your search.' : 'No fields are visible yet.'}
            </p>
          ) : (
            visibleFields.map((field, visIdx) => {
              const isDragging = dragVisIdx === visIdx;
              return (
                <div
                  key={field.id}
                  draggable={!trimmed}
                  onDragStart={() => setDragVisIdx(visIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDropVisible(visIdx)}
                  onDragEnd={() => setDragVisIdx(null)}
                  onClick={() => toggleField(field.id)}
                  className={`flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 transition-colors last:border-b-0 ${
                    isDragging ? 'bg-neutral-100 opacity-50' : 'hover:bg-[#f8fafc]'
                  } ${!trimmed ? 'cursor-grab' : 'cursor-pointer'}`}
                >
                  <span className="flex w-4 items-center justify-center text-[#cbd2e1]">
                    {!trimmed && <GripVertical className="h-4 w-4" />}
                  </span>
                  <CheckBox checked={true} />
                  <span className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
                    {field.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Hidden section */}
      <div className="flex flex-col gap-2">
        <h4 className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
          Hidden — {hiddenFields.length}{' '}
          {hiddenFields.length === 1 ? 'field' : 'fields'}
        </h4>
        <div className="flex flex-col rounded-md border border-[#e1e6ef] bg-white">
          {hiddenFields.length === 0 ? (
            <p className="px-4 py-3 font-body text-xs font-normal leading-[18px] text-[#6b7280]">
              {trimmed ? 'No hidden fields match your search.' : 'All fields are visible.'}
            </p>
          ) : (
            hiddenFields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => toggleField(field.id)}
                className="flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#f8fafc]"
              >
                {/* Empty space where the grip would be — hidden rows
                     don't get drag handles, reinforcing that order
                     only matters in Visible. */}
                <span className="w-4" />
                <CheckBox checked={false} />
                <span className="font-body text-xs font-normal leading-[18px] text-[#6b7280]">
                  {field.label}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Option B — Visual demotion in single list ---------- */

function TxFieldsOptionB({
  fields,
  setFields,
  search,
}: {
  fields: FieldRow[];
  setFields: React.Dispatch<React.SetStateAction<FieldRow[]>>;
  search: string;
}) {
  const trimmed = search.trim().toLowerCase();
  const filtered = trimmed
    ? fields.filter((f) => f.label.toLowerCase().includes(trimmed))
    : fields;
  const allVisible = fields.every((f) => f.visible);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const toggleField = (id: string) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)),
    );
  const toggleAll = () =>
    setFields((prev) => prev.map((f) => ({ ...f, visible: !allVisible })));

  // Drag only enabled on visible rows AND when there's no search.
  const onDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setFields((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  return (
    <div className="flex flex-col rounded-md border border-[#e1e6ef] bg-white">
      {!trimmed && (
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 text-left transition-colors hover:bg-[#f8fafc]"
        >
          <span className="w-4" />
          <CheckBox checked={allVisible} />
          <span className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            Select All
          </span>
        </button>
      )}
      {filtered.map((field) => {
        const realIdx = fields.findIndex((f) => f.id === field.id);
        const isDragging = dragIdx === realIdx;
        const canDrag = !trimmed && field.visible;
        return (
          <div
            key={field.id}
            draggable={canDrag}
            onDragStart={() => canDrag && setDragIdx(realIdx)}
            onDragOver={(e) => canDrag && e.preventDefault()}
            onDrop={() => canDrag && onDrop(realIdx)}
            onDragEnd={() => setDragIdx(null)}
            onClick={() => toggleField(field.id)}
            className={`flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-3 transition-colors last:border-b-0 ${
              isDragging
                ? 'bg-neutral-100 opacity-50'
                : 'hover:bg-[#f8fafc]'
            } ${canDrag ? 'cursor-grab' : 'cursor-pointer'}`}
          >
            <span
              className={`flex w-4 items-center justify-center ${
                field.visible ? 'text-[#cbd2e1]' : 'text-transparent'
              }`}
            >
              {field.visible && !trimmed && <GripVertical className="h-4 w-4" />}
            </span>
            <CheckBox checked={field.visible} />
            <span
              className={`font-body text-xs leading-[18px] ${
                field.visible
                  ? 'font-semibold text-[#1d2433]'
                  : 'font-normal text-[#6b7280]'
              }`}
            >
              {field.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Option C — Two columns (Available / Visible) ---------- */

function TxFieldsOptionC({
  fields,
  setFields,
  search,
}: {
  fields: FieldRow[];
  setFields: React.Dispatch<React.SetStateAction<FieldRow[]>>;
  search: string;
}) {
  const trimmed = search.trim().toLowerCase();
  const matches = (f: FieldRow) =>
    !trimmed || f.label.toLowerCase().includes(trimmed);
  const visibleFields = fields.filter((f) => f.visible).filter(matches);
  const hiddenFields = fields.filter((f) => !f.visible).filter(matches);
  const allVisible = fields.every((f) => f.visible);
  const [dragVisIdx, setDragVisIdx] = useState<number | null>(null);

  const toggleField = (id: string) =>
    setFields((prev) => {
      const field = prev.find((f) => f.id === id);
      if (!field) return prev;
      const without = prev.filter((f) => f.id !== id);
      return [...without, { ...field, visible: !field.visible }];
    });

  const moveAllToVisible = () =>
    setFields((prev) => prev.map((f) => ({ ...f, visible: true })));
  const moveAllToHidden = () =>
    setFields((prev) => prev.map((f) => ({ ...f, visible: false })));

  const onDropVisible = (targetVisIdx: number) => {
    if (dragVisIdx === null || dragVisIdx === targetVisIdx) return;
    const visibleIds = visibleFields.map((f) => f.id);
    const [movedId] = visibleIds.splice(dragVisIdx, 1);
    visibleIds.splice(targetVisIdx, 0, movedId);
    setFields((prev) => {
      const visibleSet = new Set(visibleIds);
      const orderedVisible = visibleIds
        .map((id) => prev.find((f) => f.id === id))
        .filter((f): f is FieldRow => Boolean(f));
      const orderedHidden = prev.filter((f) => !visibleSet.has(f.id));
      return [...orderedVisible, ...orderedHidden];
    });
    setDragVisIdx(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT column — Available (hidden) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            Available — {hiddenFields.length}
          </h4>
          {hiddenFields.length > 0 && (
            <button
              type="button"
              onClick={moveAllToVisible}
              className="font-body text-xs font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
            >
              Add All →
            </button>
          )}
        </div>
        <div className="flex max-h-[360px] flex-col overflow-y-auto rounded-md border border-[#e1e6ef] bg-white">
          {hiddenFields.length === 0 ? (
            <p className="px-3 py-3 font-body text-xs font-normal leading-[18px] text-[#6b7280]">
              No fields hidden.
            </p>
          ) : (
            hiddenFields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => toggleField(field.id)}
                className="flex items-center justify-between gap-2 border-b border-[#e1e6ef] px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-[#f8fafc]"
              >
                <span className="min-w-0 flex-1 truncate font-body text-xs font-normal leading-[18px] text-[#1d2433]">
                  {field.label}
                </span>
                <span className="font-body text-[11px] font-semibold leading-4 text-[#3d7bf7]">
                  Add →
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT column — Visible */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            Visible — {visibleFields.length}
          </h4>
          {visibleFields.length > 0 && !allVisible === false && (
            <button
              type="button"
              onClick={moveAllToHidden}
              className="font-body text-xs font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
            >
              ← Remove All
            </button>
          )}
        </div>
        <div className="flex max-h-[360px] flex-col overflow-y-auto rounded-md border border-[#e1e6ef] bg-white">
          {visibleFields.length === 0 ? (
            <p className="px-3 py-3 font-body text-xs font-normal leading-[18px] text-[#6b7280]">
              No fields visible.
            </p>
          ) : (
            visibleFields.map((field, visIdx) => {
              const isDragging = dragVisIdx === visIdx;
              return (
                <div
                  key={field.id}
                  draggable={!trimmed}
                  onDragStart={() => setDragVisIdx(visIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDropVisible(visIdx)}
                  onDragEnd={() => setDragVisIdx(null)}
                  className={`flex items-center justify-between gap-2 border-b border-[#e1e6ef] px-3 py-2 transition-colors last:border-b-0 ${
                    isDragging ? 'bg-neutral-100 opacity-50' : 'hover:bg-[#f8fafc]'
                  } ${!trimmed ? 'cursor-grab' : ''}`}
                >
                  <span className="flex w-4 items-center justify-center text-[#cbd2e1]">
                    {!trimmed && <GripVertical className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
                    {field.label}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleField(field.id);
                    }}
                    aria-label={`Remove ${field.label}`}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Enhanced Detections                                                        */
/* -------------------------------------------------------------------------- */

function EnhancedDetectionsSection() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <p className="font-header text-base font-bold leading-5 text-[#1d2433]">
          Coming soon
        </p>
        <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
          Controls for enhanced detection rules will live here. We&apos;re still scoping
          which detection types we&apos;ll surface and how they&apos;ll be configured.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Per-section layout shell. Splits the right pane into a scrollable
 * content area and a pinned footer strip that holds the Save action.
 * Matches the FlowUI modal-footer pattern (top border, white bg,
 * right-aligned action) used elsewhere in the prototype, but scoped
 * to a single section instead of the whole modal — each section
 * gets its own footer so the user can save per-section without
 * losing scroll position. The `gap` prop tunes the inner content
 * spacing for sections with denser layouts.
 */
function SectionShell({
  onSave,
  dirty = false,
  gap = 'lg',
  children,
}: {
  onSave: () => void;
  /** Whether the section has unsaved changes. Save is disabled when
   *  false, so the user can't fire a no-op save action. */
  dirty?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  const gapClass = gap === 'lg' ? 'gap-8' : gap === 'md' ? 'gap-6' : 'gap-4';
  return (
    <>
      <div className={`flex min-h-0 flex-1 flex-col ${gapClass} overflow-auto p-8`}>
        {children}
      </div>
      <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-[#e1e6ef] bg-white px-8 py-4">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#1c895f] active:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[rgba(28,137,95,0.3)] disabled:hover:bg-[rgba(28,137,95,0.3)]"
        >
          Save
        </button>
      </footer>
    </>
  );
}

function SettingRow({
  label,
  copy,
  children,
  vertical = false,
}: {
  label: string;
  copy: string;
  children: React.ReactNode;
  /** When true, the control renders below the description in a
   *  stacked layout. Used for wider controls like dropdowns where
   *  the right-aligned variant feels cramped. Defaults to false
   *  (label/copy on the left, control on the right) for compact
   *  controls like toggles. */
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
            {label}
          </p>
          <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
            {copy}
          </p>
        </div>
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
          {label}
        </p>
        <p className="font-body text-xs font-normal leading-[18px] text-[#424867]">
          {copy}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#e1e6ef]" />;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-[#1FAC76]' : 'bg-[#cbd2e1]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

/**
 * Toggle paired with a text label to its right — clicking the label
 * also flips the toggle. Used for boolean settings where the label
 * names the action ("Enable strict sign-off mode") rather than the
 * row heading naming the field.
 */
function LabeledToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <Toggle checked={checked} onChange={onChange} />
      <span className="font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
        {label}
      </span>
    </label>
  );
}

/**
 * FlowUI-styled single-select dropdown. Renders a custom trigger +
 * panel (matching the FlowSelect pattern used in the Rules builder)
 * instead of the browser-native `<select>` so the dropdown panel
 * picks up FlowUI's neutral border + deeper shadow + hover states,
 * and the surrounding modal styling stays consistent.
 */
function FlowDropdown({
  value,
  onChange,
  options,
  width,
  placeholder = 'Select…',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  width?: number;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative" style={{ width: width ?? 220 }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          open
            ? 'border-[#3d7bf7] bg-white'
            : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`flex min-w-0 flex-1 truncate font-body text-xs font-normal leading-4 ${
            selected ? 'text-[#1d2433]' : 'text-[#adb2bb]'
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'
          }`}
        />
      </button>

      {/* FlowUI dropdown panel — mirrors FlowSelect: rounded-md,
           neutral border, deeper shadow, hover-fill option rows. */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-30 mt-1 flex max-h-[280px] min-w-full flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left font-body text-xs leading-4 transition-colors hover:bg-[#f1f3f9] ${
                    isSelected
                      ? 'font-semibold text-[#1d2433]'
                      : 'font-normal text-[#1d2433]'
                  }`}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#1FAC76]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Avatar-bearing user picker. Same FlowUI dropdown chrome as
 * FlowDropdown (border, focus state, panel shadow, hover fill).
 * The panel includes a search input pinned to the top — case-
 * insensitive substring filter on the user's name — so longer
 * rosters stay quick to navigate. Each option row shows the
 * user's avatar + name only.
 */
function UserSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Reset search + autofocus on open — matches the FlowSelect /
  // FlowMultiSelect search-as-you-type behaviour.
  useEffect(() => {
    if (!open) return;
    setSearch('');
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const selected = team.find((m) => m.id === value);
  const q = search.trim().toLowerCase();
  // Hide the currently-selected user from the list — they're already
  // visible in the trigger pill, so re-listing them is noise. Matches
  // the assignee dropdown pattern used elsewhere in the prototype.
  const filtered = team
    .filter((m) => m.id !== value)
    .filter((m) => (q ? m.name.toLowerCase().includes(q) : true));

  return (
    <div ref={ref} className="relative" style={{ width: 260 }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-md border px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          open
            ? 'border-[#3d7bf7] bg-white'
            : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
        }`}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={selected.avatar}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
            <span className="truncate font-body text-xs font-normal leading-4 text-[#1d2433]">
              {selected.name}
            </span>
          </span>
        ) : (
          <span className="font-body text-xs font-normal leading-4 text-[#adb2bb]">
            Select a user…
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'
          }`}
        />
      </button>

      {/* Panel — matches FlowDropdown / FlowSelect chrome with a
           pinned search field at the top. */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 flex max-h-64 flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
        >
          <div className="relative shrink-0 border-b border-[#e1e6ef] px-2 py-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-body text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-2 font-body text-[11px] text-[#adb2bb]">
                No matches
              </p>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="option"
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left transition-colors hover:bg-[#f1f3f9]"
                >
                  <img
                    src={m.avatar}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate font-body text-xs font-semibold leading-[18px] text-[#1d2433]">
                    {m.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
        checked ? 'border-[#1FAC76] bg-[#1FAC76]' : 'border-[#cbd2e1] bg-white'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
          <path
            d="M2.5 6.5L5 9L9.5 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

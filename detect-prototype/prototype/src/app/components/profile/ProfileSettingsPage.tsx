import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';
import { getTeamMember, currentUserId } from '../../../data/team';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

/**
 * Profile Settings — full-page experience that takes over the
 * Detect/Close main column when the user picks "Profile Settings"
 * from the avatar menu. NOT a Detect-internal modal; the side rail
 * stays visible but everything to the right of it switches to this
 * page.
 *
 * Two tabs:
 *   • Profile        (default) — personal details + user preferences
 *   • Notifications  — channel + per-notification preferences,
 *                       mirroring Figma node 700:564
 *                       (D3VxN58dgY6gsNftcjM1R4).
 */

type TabId = 'profile' | 'notifications';
type CategoryId =
  | 'workflow'
  | 'ai-variance-analysis'
  | 'variance-analysis'
  | 'detect';
type Channel = 'email' | 'slack' | 'teams';

// ──────────────────────────────────────────────────────────────────
// Page shell
// ──────────────────────────────────────────────────────────────────

export function ProfileSettingsPage({
  initialTab = 'profile',
}: {
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Page header — title + tabs. Page-level padding (px-6 py-6)
           is shared with the tab bodies below so the whole page reads
           as one consistent 24px gutter on all four sides. */}
      <header className="shrink-0 border-b border-[#e1e6ef] bg-white px-6 pt-6">
        <h1 className="font-header text-2xl font-bold leading-8 text-[#1d2433]">
          Profile Settings
        </h1>
        <div className="mt-4 flex items-center gap-1">
          <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
            Profile
          </TabButton>
          <TabButton
            active={tab === 'notifications'}
            onClick={() => setTab('notifications')}
          >
            Notifications
          </TabButton>
        </div>
      </header>

      {/* Page body — scrollable */}
      <div className="flex-1 overflow-y-auto bg-white">
        {tab === 'profile' ? <ProfileTab /> : <NotificationsTab />}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Tabs
// ──────────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative -mb-px h-10 px-3 font-['Inter'] text-[13px] font-semibold leading-5 transition-colors ${
        active ? 'text-[#1d2433]' : 'text-[#6b7280] hover:text-[#1d2433]'
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-sm bg-[#1FAC76]" />
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// Profile tab — personal details + general information + preferences
// ──────────────────────────────────────────────────────────────────

function ProfileTab() {
  const currentUser = getTeamMember(currentUserId);

  return (
    <div className="px-6 py-6">
      {/* Avatar + name + email + Edit link */}
      <div className="flex items-start gap-4 pb-6">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-header text-lg font-bold leading-6 text-[#1d2433]">
            {currentUser?.name}
          </p>
          <p className="mt-0.5 font-['Inter'] text-[13px] font-normal leading-5 text-[#6b7280]">
            {currentUser?.email}
          </p>
          <button
            type="button"
            className="mt-1 font-['Inter'] text-[12px] font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-[#e1e6ef]" />

      {/* General Information */}
      <ProfileSection title="General Information">
        <GeneralInformationForm />
      </ProfileSection>

      <div className="h-px w-full bg-[#e1e6ef]" />

      {/* User Preferences */}
      <ProfileSection title="User Preferences">
        <UserPreferencesForm />
      </ProfileSection>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // Two-column layout: heading on the left, form fields on the
  // right. Matches the FloQast profile-settings pattern shown in
  // the reference screenshot.
  return (
    <section className="grid grid-cols-[220px_minmax(0,1fr)] gap-10 py-8">
      <h2 className="font-header text-xl font-bold leading-7 text-[#1d2433]">
        {title}
      </h2>
      <div className="max-w-[820px]">{children}</div>
    </section>
  );
}

function GeneralInformationForm() {
  const currentUser = getTeamMember(currentUserId);
  const [firstName, setFirstName] = useState(
    currentUser?.name.split(' ')[0] ?? '',
  );
  const [lastName, setLastName] = useState(
    currentUser?.name.split(' ').slice(1).join(' ') ?? '',
  );
  const [email] = useState(currentUser?.email ?? '');
  const [department, setDepartment] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Initial snapshot — used to detect dirtiness on the Save Changes
  // button. Doesn't persist anything; this is prototype-only.
  const initial = useMemo(
    () => ({
      firstName: currentUser?.name.split(' ')[0] ?? '',
      lastName: currentUser?.name.split(' ').slice(1).join(' ') ?? '',
      department: '',
      jobTitle: '',
    }),
    [currentUser],
  );
  const dirty =
    firstName !== initial.firstName ||
    lastName !== initial.lastName ||
    department !== initial.department ||
    jobTitle !== initial.jobTitle;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        <TextField label="First Name" value={firstName} onChange={setFirstName} />
        <TextField label="Last Name" value={lastName} onChange={setLastName} />
        <TextField label="Email" value={email} onChange={() => {}} readOnly />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <DropdownField
          label="Department"
          placeholder="Select a Department"
          value={department}
          onChange={setDepartment}
          options={[
            { value: 'accounting', label: 'Accounting' },
            { value: 'finance', label: 'Finance' },
            { value: 'audit', label: 'Audit' },
            { value: 'fp-and-a', label: 'FP&A' },
          ]}
        />
        <DropdownField
          label="Job Title"
          placeholder="Select a Job Title"
          value={jobTitle}
          onChange={setJobTitle}
          options={[
            { value: 'staff-accountant', label: 'Staff Accountant' },
            { value: 'senior-accountant', label: 'Senior Accountant' },
            { value: 'accounting-manager', label: 'Accounting Manager' },
            { value: 'controller', label: 'Controller' },
            { value: 'cfo', label: 'CFO' },
          ]}
        />
      </div>
      <div>
        <SaveChangesButton disabled={!dirty} />
      </div>
    </div>
  );
}

function UserPreferencesForm() {
  const [language, setLanguage] = useState('');
  const [region, setRegion] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [numberFormat, setNumberFormat] = useState('');

  const dirty = !!(language || region || dateFormat || numberFormat);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        <DropdownField
          label="Language"
          placeholder="Select a Language"
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'en-us', label: 'English (US)' },
            { value: 'en-gb', label: 'English (UK)' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
          ]}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <DropdownField
          label="Region"
          placeholder="Select a Region"
          value={region}
          onChange={setRegion}
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'au', label: 'Australia' },
          ]}
        />
        <DropdownField
          label="Date Format"
          placeholder="Select a Date Format"
          value={dateFormat}
          onChange={setDateFormat}
          options={[
            { value: 'mdy', label: 'MM/DD/YYYY' },
            { value: 'dmy', label: 'DD/MM/YYYY' },
            { value: 'ymd', label: 'YYYY-MM-DD' },
          ]}
        />
        <DropdownField
          label="Number Format"
          placeholder="Select a Number Format"
          value={numberFormat}
          onChange={setNumberFormat}
          options={[
            { value: 'us', label: '1,234.56' },
            { value: 'eu', label: '1.234,56' },
            { value: 'iso', label: '1 234.56' },
          ]}
        />
      </div>
      <div>
        <SaveChangesButton disabled={!dirty} />
      </div>
    </div>
  );
}

function SaveChangesButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30 disabled:hover:bg-[#1FAC76]/30"
    >
      Save Changes
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// Form atoms
// ──────────────────────────────────────────────────────────────────

function TextField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`h-10 rounded-md border border-[#cbd2e1] bg-white px-3 font-['Inter'] text-[13px] font-normal leading-5 text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none ${
          readOnly ? 'bg-[#f8fafc] text-[#6b7280]' : ''
        }`}
      />
    </label>
  );
}

interface DropdownOption {
  value: string;
  label: string;
}

function DropdownField({
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative flex flex-col gap-1.5">
      <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors ${
          open ? 'border-[#3d7bf7]' : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`font-['Inter'] text-[13px] leading-5 ${
            selected ? 'font-normal text-[#1d2433]' : 'italic font-normal text-[#adb2bb]'
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
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_0px_rgba(15,23,42,0.08)]">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left font-['Inter'] text-[13px] leading-5 transition-colors hover:bg-[#f1f3f9] ${
                  isSelected
                    ? 'font-semibold text-[#1d2433]'
                    : 'font-normal text-[#424867]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Notifications tab — reference: Figma node 700:564 of file
// D3VxN58dgY6gsNftcjM1R4. Page content only (no global nav).
// ══════════════════════════════════════════════════════════════════

interface RadioOption {
  value: string;
  label: string;
}
type Extra =
  | { kind: 'radio'; label: string; defaultValue: string; options: RadioOption[] }
  | { kind: 'dropdown'; label: string; defaultValue: string; options: RadioOption[] };

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  defaults: Partial<Record<Channel, boolean>>;
  unavailable?: Channel[];
  extra?: Extra;
}

const WORKFLOW_ITEMS: NotificationItem[] = [
  {
    id: 'close-progress',
    title: 'Close Progress',
    description: 'Receive a notification summarizing your close status.',
    defaults: { email: true, slack: false, teams: false },
    extra: {
      kind: 'radio',
      label: '',
      defaultValue: 'weekly',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
      ],
    },
  },
  {
    id: 'review-notes',
    title: 'Review Notes',
    description:
      'Receive a notification when a review note that you are associated with is assigned, edited or resolved.',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'reconciliations',
    title: 'Reconciliations',
    description:
      'Receive a notification when a reconciliation that previously tied out is out of balance.',
    defaults: { email: true, slack: false, teams: false },
    extra: {
      kind: 'radio',
      label: '',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'Notify me on all recs (default)' },
        { value: 'assigned', label: 'Notify me on my assigned items only' },
      ],
    },
  },
  {
    id: 'late-messages',
    title: 'Late Messages',
    description: 'Receive a notification when an item is late.',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'items-due-soon',
    title: 'Items Due Soon',
    description:
      'Receive a notification on Monday morning of all your assigned items due for the upcoming week.',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'ready-for-review',
    title: 'Ready for Review',
    description:
      'Receive a notification when your assigned items are ready for review.',
    defaults: { email: false, slack: false, teams: false },
    extra: {
      kind: 'radio',
      label: '',
      defaultValue: 'batch',
      options: [
        {
          value: 'batch',
          label: 'Batch notifications to be sent at 6AM, 9AM, 12PM, 3PM and 6PM',
        },
        {
          value: 'immediate',
          label: 'Send a notification immediately after items are marked ready for review',
        },
      ],
    },
  },
  {
    id: 'followed-items',
    title: 'Followed Items',
    description:
      "Receive a notification when the status of an item you're following changes.",
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'sign-off-reminder',
    title: 'Sign-off Reminder',
    description:
      'Receive a notification at the end of the workday for your checklist items that are due today but not signed off yet. (This is for assigned Checklist items only.)',
    defaults: { email: false, slack: false, teams: false },
  },
];

const AI_VARIANCE_ITEMS: NotificationItem[] = [
  {
    id: 'ai-va-newly-material',
    title: 'Newly-Material Fluctuations',
    description:
      'Receive a notification when there is a material variance within a rule that needs an explanation or sign-off. This is for a material variance where you are assigned as a Preparer.',
    defaults: { email: false, slack: false, teams: false },
  },
  {
    id: 'ai-va-balance-change',
    title: 'Balance Change on Actioned Item',
    description:
      'Receive a notification when the balance has changed on a material variance that has an explanation or has been signed-off.',
    defaults: { email: false, slack: false, teams: false },
  },
  {
    id: 'ai-va-ready-for-review',
    title: 'AI Variance Analysis Item Ready For Review',
    description:
      'Receive a notification when at least one Preparer has signed off on a material fluctuation and it is ready for your review',
    defaults: { email: false, slack: false, teams: false },
  },
  {
    id: 'ai-va-ready-for-finalization',
    title: 'Ready for Finalization',
    description:
      'Collection Reviewers receive a notification when all required signatures on material variances are complete and all notes closed.',
    defaults: { email: false, slack: false, teams: false },
  },
];

const VARIANCE_ITEMS: NotificationItem[] = [
  {
    id: 'va-newly-material',
    title: 'Newly-Material Fluctuations',
    description:
      "Receive a notification when there is a material fluctuation on a Variance Analysis report that needs an explanation or sign-off (This is for an account or group you're assigned as a Preparer)",
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'va-material-changes',
    title: 'Material Fluctuation Changes',
    description:
      'Receive a notification when there is a change to the amount of a material fluctuation on a Variance Analysis report since it was explained or signed off (for an account or group you are assigned to as a Preparer)',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'va-item-ready-for-review',
    title: 'Variance Analysis Item Ready For Review',
    description:
      'Receive a notification when all Preparers have signed off on a material fluctuation and it is ready for your review',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'va-report-ready-for-review',
    title: 'Variance Analysis Report Ready For Review',
    description:
      'Variance Analysis Report Reviewers receive a notification when a Variance Analysis report has all required signatures on material fluctuations, and all of its review notes are closed',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'va-items-due',
    title: 'Variance Analysis Items Due Soon',
    description:
      'Receive a notification on Monday morning of all your assigned Variance Analysis items due for the upcoming week',
    defaults: { email: true, slack: false, teams: false },
  },
  {
    id: 'va-late',
    title: 'Late Variance Analysis Items',
    description:
      'Receive a notification when an assigned material fluctuation is late',
    defaults: { email: true, slack: false, teams: false },
  },
];

// Detect — MVP scope.
//   • Three triggers: anomaly assignment, new comment on an assigned
//     transaction, sign-off suspension on an assigned transaction.
//   • All three enabled by default.
//   • Anomaly assignment carries a frequency picker (Instant default,
//     Hourly / Daily (End of Day) / Weekly (End of Day Friday)).
//   • Email is the only channel actually wired for MVP. Slack and
//     Teams columns still render so the layout aligns with the
//     other sections, but every checkbox in those columns is
//     disabled. The column headers carry an info icon explaining
//     the limitation.
const DETECT_ITEMS: NotificationItem[] = [
  {
    id: 'detect-anomaly-assigned',
    title: 'Anomaly Assignment',
    description:
      'Receive a notification when you are assigned to an anomalous transaction.',
    defaults: { email: true },
    unavailable: ['slack', 'teams'],
    extra: {
      kind: 'radio',
      label: '',
      defaultValue: 'instant',
      options: [
        { value: 'instant', label: 'Instant (default)' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily (End of Day)' },
        { value: 'weekly', label: 'Weekly (End of Day Friday)' },
      ],
    },
  },
  {
    id: 'detect-new-comment',
    title: 'Anomaly Comments',
    description:
      "Receive a notification when a new comment is posted on a transaction you're assigned to.",
    defaults: { email: true },
    unavailable: ['slack', 'teams'],
  },
  {
    id: 'detect-signoff-suspended',
    title: 'Sign-off Suspended',
    description:
      "Receive a notification when your sign-off was suspended on a transaction you're assigned to.",
    defaults: { email: true },
    unavailable: ['slack', 'teams'],
  },
];

function NotificationsTab() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('workflow');
  // Dirty tracking — any checkbox toggle, radio change, or dropdown
  // change flips this to true. Save Changes stays disabled until
  // then. Keeps the affordance honest: the user only sees an active
  // CTA when there's actually something to save.
  const [dirty, setDirty] = useState(false);
  const markDirty = () => setDirty(true);
  const workflowRef = useRef<HTMLDivElement>(null);
  const aiVarianceRef = useRef<HTMLDivElement>(null);
  const varianceRef = useRef<HTMLDivElement>(null);
  const detectRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: CategoryId) => {
    setActiveCategory(id);
    const target =
      id === 'workflow'
        ? workflowRef.current
        : id === 'ai-variance-analysis'
          ? aiVarianceRef.current
          : id === 'variance-analysis'
            ? varianceRef.current
            : detectRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="px-6 py-6">
      {/* Section: Notifications intro */}
      <section className="max-w-[640px]">
        <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
          Notifications
        </h2>
        <p className="mt-2 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          Choose when and how we'll contact you. If you need help setting up
          integrated notifications,{' '}
          <a className="font-semibold text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]" href="#">
            learn how to set up Slack here
          </a>{' '}
          or{' '}
          <a className="font-semibold text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]" href="#">
            learn how to set up Teams here
          </a>
          .
        </p>
      </section>

      {/* Section: Manage Integrations */}
      <section className="mt-8 max-w-[480px]">
        <h3 className="font-header text-sm font-bold leading-5 text-[#1d2433]">
          Manage Integrations
        </h3>
        <p className="mt-1 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          Manage your connected apps to receive personal notifications.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <IntegrationRow icon={<SlackIcon />} label="Slack" connected />
          <IntegrationRow icon={<TeamsIcon />} label="Teams" connected={false} />
        </div>
      </section>

      <div className="my-8 h-px w-full bg-[#e1e6ef]" />

      {/* Categories + content */}
      <div className="flex gap-10">
        <aside className="sticky top-2 h-fit w-[180px] shrink-0">
          <p className="px-3 pb-2 font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
            Categories
          </p>
          <nav className="flex flex-col gap-1">
            <CategoryLink
              active={activeCategory === 'workflow'}
              onClick={() => scrollTo('workflow')}
            >
              Workflow
            </CategoryLink>
            <CategoryLink
              active={activeCategory === 'ai-variance-analysis'}
              onClick={() => scrollTo('ai-variance-analysis')}
            >
              AI Variance Analysis
            </CategoryLink>
            <CategoryLink
              active={activeCategory === 'variance-analysis'}
              onClick={() => scrollTo('variance-analysis')}
            >
              Variance Analysis
            </CategoryLink>
            <CategoryLink
              active={activeCategory === 'detect'}
              onClick={() => scrollTo('detect')}
            >
              Detect
            </CategoryLink>
          </nav>
        </aside>

        {/* Right column is capped at 820px so on wide monitors the
             description text doesn't sprawl out and leave a huge gap
             before the Email/Slack/Teams checkboxes. On narrower
             screens the 1fr description shrinks naturally; the 80px
             checkbox cells stay fixed. */}
        <div className="min-w-0 max-w-[820px] flex-1">
          <div ref={workflowRef}>
            <NotificationCategorySection
              title="Workflow"
              items={WORKFLOW_ITEMS}
              onDirty={markDirty}
            />
          </div>
          <div ref={aiVarianceRef} className="mt-12">
            <NotificationCategorySection
              title="AI Variance Analysis"
              items={AI_VARIANCE_ITEMS}
              onDirty={markDirty}
            />
          </div>
          <div ref={varianceRef} className="mt-12">
            <NotificationCategorySection
              title="Variance Analysis"
              items={VARIANCE_ITEMS}
              onDirty={markDirty}
            />
          </div>
          <div ref={detectRef} className="mt-12">
            <NotificationCategorySection
              title="Detect"
              items={DETECT_ITEMS}
              onDirty={markDirty}
              // Detect ships Email-only for MVP. Slack and Teams
              // columns still render so the section aligns with
              // the rest of the page, but per-item `unavailable`
              // flags lock those checkboxes off. The header info
              // icons explain why on hover.
              channelInfo={{
                slack:
                  'Slack integration is not currently supported for Detect notifications',
                teams:
                  'Teams integration is not currently supported for Detect notifications',
              }}
            />
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              disabled={!dirty}
              onClick={() => setDirty(false)}
              className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30 disabled:hover:bg-[#1FAC76]/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center rounded-md px-3 py-2 text-left font-['Inter'] text-[12px] font-medium leading-4 transition-colors ${
        active
          ? 'bg-[#f1f3f9] text-[#1d2433] font-semibold'
          : 'text-[#424867] hover:bg-[#f8fafc] hover:text-[#1d2433]'
      }`}
    >
      {children}
    </button>
  );
}

function IntegrationRow({
  icon,
  label,
  connected,
}: {
  icon: React.ReactNode;
  label: string;
  connected: boolean;
}) {
  // Each integration renders as its own bordered card (rounded
  // corners, individual border, internal padding) — mirrors the
  // reference screenshot where Slack and Teams sit in separate
  // containers rather than sharing a single bordered list.
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#e1e6ef] bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="font-header text-sm font-bold leading-5 text-[#1d2433]">
          {label}
        </span>
      </div>
      {connected ? (
        // Connected state — same button shape as the Connect CTA so
        // the two rows align visually, but rendered in the FlowUI
        // disabled treatment (30% brand-green fill, not-allowed
        // cursor, no hover transition) since the integration is
        // already wired. Leading Check glyph makes the state
        // legible at a glance.
        <button
          type="button"
          disabled
          aria-label="Connected"
          className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md bg-[#1FAC76]/30 px-4 font-header text-[12px] font-bold leading-4 text-white"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          Connected
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-md bg-[#1FAC76] px-4 font-header text-[12px] font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
        >
          Connect
        </button>
      )}
    </div>
  );
}

/**
 * Slack brand mark — 4-color pinwheel from the official 2019 Slack
 * logo. Inlined so the prototype doesn't depend on a brand-asset
 * package.
 */
function SlackIcon() {
  return (
    <svg
      viewBox="0 0 122.8 122.8"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9z"
        fill="#e01e5a"
      />
      <path
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9z"
        fill="#36c5f0"
      />
      <path
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9z"
        fill="#2eb67d"
      />
      <path
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9z"
        fill="#ecb22e"
      />
    </svg>
  );
}

/**
 * Microsoft Teams icon — simplified purple "T" badge. Captures the
 * brand cue without trying to reproduce the full multi-element
 * Teams glyph.
 */
function TeamsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="24" height="24" rx="4" fill="#4B53BC" />
      <path
        d="M7 8.5h10v2.4h-3.9V17h-2.2v-6.1H7z"
        fill="#ffffff"
      />
    </svg>
  );
}

// All three channels in default column order. Sections can opt into
// a narrower set (e.g. Detect ships Email-only for MVP) by passing
// their own `channels` array.
const ALL_CHANNELS: Channel[] = ['email', 'slack', 'teams'];

/**
 * Small info-glyph with a hover tooltip. Used in column headers to
 * explain channel availability constraints (e.g. Detect's Slack /
 * Teams cells are intentionally disabled).
 */
function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center">
          <Info
            className="h-3.5 w-3.5 text-[#6b7280]"
            strokeWidth={2}
            aria-label={text}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[12rem] text-center">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function NotificationCategorySection({
  title,
  items,
  onDirty,
  channels = ALL_CHANNELS,
  channelInfo,
}: {
  title: string;
  items: NotificationItem[];
  /** Fires the first time any control in this section changes — the
   *  page-level Save Changes button stays disabled until at least
   *  one section reports dirty. */
  onDirty?: () => void;
  /** Which channels render checkbox cells in this section. The grid
   *  always reserves all three slots so the Email column stays
   *  visually aligned with other sections. */
  channels?: Channel[];
  /** Optional per-channel tooltip copy. When provided, a small info
   *  icon renders next to the channel label and shows the tooltip
   *  on hover — used by Detect to explain why Slack/Teams are
   *  disabled at MVP. */
  channelInfo?: Partial<Record<Channel, string>>;
}) {
  const [state, setState] = useState<Record<string, Record<Channel, boolean>>>(
    () => {
      const out: Record<string, Record<Channel, boolean>> = {};
      for (const it of items) {
        out[it.id] = {
          email: !!it.defaults.email,
          slack: !!it.defaults.slack,
          teams: !!it.defaults.teams,
        };
      }
      return out;
    },
  );

  const toggle = (itemId: string, channel: Channel) => {
    onDirty?.();
    setState((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [channel]: !prev[itemId][channel] },
    }));
  };

  return (
    <section>
      <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
        {title}
      </h2>

      {/* Column header — single gray bar with Notification Preferences
           label on the left and channel labels on the right. The
           grid template is fixed across every section so the Email
           column always lands in the same horizontal position — even
           on Detect, where Slack/Teams aren't supported at MVP. The
           `channels` prop just gates which labels render; the cells
           themselves are reserved so the layout doesn't shift when
           Slack/Teams ship later. */}
      <div className="mt-3 grid grid-cols-[1fr_80px_80px_80px] items-center gap-3 rounded-t-md bg-[#f8fafc] px-4 py-3">
        <p className="font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
          Notification Preferences
        </p>
        {ALL_CHANNELS.map((ch) => {
          if (!channels.includes(ch)) {
            return <span key={ch} aria-hidden />;
          }
          const label =
            ch === 'email' ? 'Email' : ch === 'slack' ? 'Slack' : 'Teams';
          const tip = channelInfo?.[ch];
          return (
            <span
              key={ch}
              className="inline-flex items-center justify-center gap-1 text-center font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]"
            >
              {label}
              {tip && <InfoTip text={tip} />}
            </span>
          );
        })}
      </div>

      <div className="divide-y divide-[#e1e6ef]">
        {items.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            values={state[item.id]}
            onToggle={(channel) => toggle(item.id, channel)}
            onDirty={onDirty}
            channels={channels}
          />
        ))}
      </div>
    </section>
  );
}

function NotificationRow({
  item,
  values,
  onToggle,
  onDirty,
  channels = ALL_CHANNELS,
}: {
  item: NotificationItem;
  values: Record<Channel, boolean>;
  onToggle: (channel: Channel) => void;
  onDirty?: () => void;
  /** Which channels render an interactive checkbox in this row.
   *  The grid template stays fixed at 3 channel columns regardless,
   *  so the Email cell always lines up with Email cells in other
   *  sections. Channels not in this list render an empty cell. */
  channels?: Channel[];
}) {
  return (
    <div className="grid grid-cols-[1fr_80px_80px_80px] items-start gap-3 px-4 py-4">
      <div className="min-w-0">
        <p className="font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
          {item.title}
        </p>
        <p className="mt-1 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          {item.description}
        </p>
        {item.extra && (
          <div className="mt-3">
            {item.extra.label && (
              <p className="mb-2 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
                {item.extra.label}
              </p>
            )}
            {item.extra.kind === 'radio' ? (
              <RadioGroup
                options={item.extra.options}
                defaultValue={item.extra.defaultValue}
                onDirty={onDirty}
              />
            ) : (
              <Dropdown
                options={item.extra.options}
                defaultValue={item.extra.defaultValue}
                onDirty={onDirty}
              />
            )}
          </div>
        )}
      </div>

      {ALL_CHANNELS.map((ch) => {
        // Channels not enabled for this section render an empty
        // cell so the grid keeps its 3-column shape and Email
        // stays aligned with Email cells elsewhere.
        if (!channels.includes(ch)) {
          return <div key={ch} aria-hidden />;
        }
        const disabled = (item.unavailable ?? []).includes(ch);
        return (
          <div key={ch} className="flex items-center justify-center pt-1">
            <ChannelCheckbox
              checked={!!values[ch]}
              disabled={disabled}
              onChange={() => !disabled && onToggle(ch)}
            />
          </div>
        );
      })}
    </div>
  );
}

function ChannelCheckbox({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`inline-flex h-5 w-5 items-center justify-center rounded border transition-colors ${
        disabled
          ? 'cursor-not-allowed border-[#e1e6ef] bg-[#f8fafc]'
          : checked
            ? 'border-[#1FAC76] bg-[#1FAC76] hover:bg-[#186749]'
            : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
      }`}
    >
      {checked && !disabled && (
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      )}
    </button>
  );
}

function RadioGroup({
  options,
  defaultValue,
  onDirty,
}: {
  options: RadioOption[];
  defaultValue: string;
  onDirty?: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => {
              if (value !== opt.value) onDirty?.();
              setValue(opt.value);
            }}
            className="flex items-center gap-2 text-left"
          >
            <span
              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                checked ? 'border-[#1FAC76] bg-white' : 'border-[#cbd2e1] bg-white'
              }`}
            >
              {checked && <span className="h-2 w-2 rounded-full bg-[#1FAC76]" />}
            </span>
            <span
              className={`font-['Inter'] text-[12px] leading-4 ${
                checked
                  ? 'font-semibold text-[#1d2433]'
                  : 'font-normal text-[#424867]'
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Dropdown({
  options,
  defaultValue,
  onDirty,
}: {
  options: RadioOption[];
  defaultValue: string;
  onDirty?: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  return (
    <div ref={ref} className="relative w-[220px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors ${
          open ? 'border-[#3d7bf7]' : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433]">
          {selected?.label ?? value}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_0px_rgba(15,23,42,0.08)]">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (value !== opt.value) onDirty?.();
                  setValue(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left font-['Inter'] text-[12px] leading-4 transition-colors hover:bg-[#f1f3f9] ${
                  isSelected
                    ? 'font-semibold text-[#1d2433]'
                    : 'font-normal text-[#424867]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

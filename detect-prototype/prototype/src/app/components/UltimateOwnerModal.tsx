import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { team } from '../../data/team';

/**
 * Ultimate Owner setup modal.
 *
 * Wedged into the onboarding flow between the COSO acknowledgment
 * and the (optional) ERP field-mapping / Fallback Assignee steps.
 * Picking the Ultimate Owner here is REQUIRED — the affordance has
 * no skip path, and the primary button stays disabled until a user
 * is chosen. The same setting lives at Settings → General → Ultimate
 * Owner; we surface it up-front so the safety net for "lost"
 * anomalies is in place before the user starts exploring.
 *
 * The two modals that follow this one (ERP Field Mapping, Fallback
 * Assignees) remain optional — users can return to either from
 * Settings whenever they want.
 */

const STORAGE_KEY = 'detect-ultimate-owner';

export function useUltimateOwner() {
  const [ultimateOwnerDone, setUltimateOwnerDone] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const saveUltimateOwner = (userId: string) => {
    localStorage.setItem(STORAGE_KEY, userId);
    setUltimateOwnerDone(true);
  };

  return { ultimateOwnerDone, saveUltimateOwner };
}

interface Props {
  onSave: (userId: string) => void;
}

export function UltimateOwnerModal({ onSave }: Props) {
  const [selectedId, setSelectedId] = useState<string>('');
  const canContinue = !!selectedId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col overflow-visible rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <header className="px-6 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              Set Your Ultimate Owner
            </h2>
            <span className="shrink-0 rounded-full bg-[#fff8eb] px-2.5 py-0.5 font-['Inter'] text-[11px] font-semibold leading-4 text-[#db7712]">
              Required
            </span>
          </div>
          <p className="mt-2 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
            Pick the user who acts as the final fallback for anomaly
            assignments. If dynamic assignment fails, no fallback assignees
            are set, and no rule owner exists, anomalies are assigned to this
            user so they don't slip through unreviewed. You can change this
            later under Settings → General.
          </p>
        </header>

        {/* Body */}
        <div className="px-6 pb-5 pt-4">
          <label className="block">
            <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
              Ultimate Owner
            </span>
            <div className="mt-1.5">
              <UserPicker
                value={selectedId}
                onChange={setSelectedId}
              />
            </div>
          </label>
        </div>

        {/* Footer — no skip path; this step is required */}
        <footer className="flex items-center justify-end gap-3 border-t border-[#e1e6ef] bg-white px-6 py-3">
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => canContinue && onSave(selectedId)}
            className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30 disabled:hover:bg-[#1FAC76]/30"
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// UserPicker — pinned-search dropdown listing team members. Mirrors
// the UserSelect used in SettingsModal so this onboarding control
// matches the eventual Settings → General experience exactly.
// ──────────────────────────────────────────────────────────────────

function UserPicker({
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

  useEffect(() => {
    if (!open) return;
    setSearch('');
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const selected = team.find((m) => m.id === value);
  const q = search.trim().toLowerCase();
  const filtered = team
    .filter((m) => m.id !== value)
    .filter((m) => (q ? m.name.toLowerCase().includes(q) : true));

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-md border px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          open ? 'border-[#3d7bf7] bg-white' : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
        }`}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={selected.avatar}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
            <span className="truncate font-['Inter'] text-xs font-normal leading-4 text-[#1d2433]">
              {selected.name}
            </span>
          </span>
        ) : (
          <span className="font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
            Select a user…
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'
          }`}
        />
      </button>

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
              className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
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
                  <span className="min-w-0 flex-1 truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]">
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

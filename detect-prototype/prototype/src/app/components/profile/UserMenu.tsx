import { useEffect, useRef } from 'react';
import {
  User,
  HelpCircle,
  MessageSquare,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { getTeamMember, currentUserId } from '../../../data/team';

/**
 * Floating user menu — anchored to the avatar in the bottom-left of
 * the collapsed side nav. Matches the FloQast pattern: user card at
 * the top (avatar + name + email), then a list of items with leading
 * icons. External-link items render a trailing `ExternalLink` glyph.
 *
 * Wired actions:
 *   • Profile Settings → host opens the Profile Settings page
 *   • Help Center / Customer Feedback → inert (no-op for prototype)
 *   • Sign Out → inert (no-op for prototype)
 */
export function UserMenu({
  anchorRect,
  onOpenProfile,
  onClose,
}: {
  /** Bounding box of the avatar trigger — used to position the
   *  popover. Provided by the host. */
  anchorRect: DOMRect;
  onOpenProfile: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentUser = getTeamMember(currentUserId);

  // Close on outside click + Escape.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!currentUser) return null;

  // The avatar lives in the bottom-left of the rail (x ≈ 56px from
  // the left of the viewport). Open the menu to the right of the
  // rail, anchored to the avatar's vertical centre but biased
  // upward so the panel doesn't run off the bottom of the screen.
  // Width matches the FloQast user menu convention (~280px).
  const WIDTH = 300;
  const top = Math.max(
    16,
    Math.min(window.innerHeight - 16, anchorRect.bottom) - 320,
  );
  const left = anchorRect.right + 8;

  return (
    <div
      ref={panelRef}
      role="menu"
      className="fixed z-[100] overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      style={{ top, left, width: WIDTH }}
    >
      {/* User card — avatar + name + email */}
      <div className="flex items-center gap-3 border-b border-[#e1e6ef] px-4 py-4">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-header text-sm font-bold leading-5 text-[#1d2433]">
            {currentUser.name}
          </p>
          <p className="truncate font-['Inter'] text-[12px] font-normal leading-4 text-[#6b7280]">
            {currentUser.email}
          </p>
        </div>
      </div>

      {/* Profile Settings — primary action */}
      <div className="border-b border-[#e1e6ef] py-1">
        <MenuItem
          icon={<User className="h-4 w-4" />}
          label="Profile Settings"
          onClick={() => {
            onOpenProfile();
            onClose();
          }}
        />
      </div>

      {/* Help + Customer Feedback (external) */}
      <div className="border-b border-[#e1e6ef] py-1">
        <MenuItem
          icon={<HelpCircle className="h-4 w-4" />}
          label="Help Center"
          trailing={<ExternalLink className="h-4 w-4 text-[#6b7280]" />}
          onClick={onClose}
        />
        <MenuItem
          icon={<MessageSquare className="h-4 w-4" />}
          label="Customer Feedback"
          trailing={<ExternalLink className="h-4 w-4 text-[#6b7280]" />}
          onClick={onClose}
        />
      </div>

      {/* Sign Out */}
      <div className="py-1">
        <MenuItem
          icon={<LogOut className="h-4 w-4" />}
          label="Sign Out"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  trailing,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#f8fafc]"
    >
      <span className="text-[#1d2433]">{icon}</span>
      <span className="flex-1 font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
        {label}
      </span>
      {trailing}
    </button>
  );
}

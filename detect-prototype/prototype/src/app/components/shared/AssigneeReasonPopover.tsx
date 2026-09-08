import { X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '../ui/popover';
import type { AssigneeReason } from '../../../data/types';
import { getTeamMember, currentUserId } from '../../../data/team';

/**
 * Avatar popover that explains why a given user is assigned to a
 * record / insight. Mounted only on read-only assignee container
 * avatars — not on the Edit Assignees modal (Carmen 5.28.26).
 *
 * Copy follows Carmen's spec verbatim, with person-aware swapping:
 *   Header:  "You were assigned to this transaction because:"   (self)
 *            "[Name] was assigned to this transaction because:" (others)
 *   Bullets (rendered as a single bullet matching reason.type):
 *     • You are the assignee on [Rule Name].
 *     • You are the assignee for [Entity] · [Account Number].
 *     • You were assigned by [User Name]. This is for manual assignment.
 *     • You are the Ultimate Owner.
 *
 * Fallback: records without seeded reasons render as Ultimate Owner.
 */
export function AssigneeReasonPopover({
  memberId,
  reason,
  children,
}: {
  memberId: string;
  reason: AssigneeReason | undefined;
  children: React.ReactNode;
}) {
  const member = getTeamMember(memberId);
  const name = member?.name ?? memberId;
  const firstName = name.split(' ')[0] ?? name;
  const isSelf = memberId === currentUserId;

  // Default fallback — only ONE user in the workspace is the
  // Ultimate Owner (set during Onboarding, stored under
  // 'detect-ultimate-owner'). If this assignee matches that user,
  // render `ultimate-owner`; otherwise fall back to a generic
  // manual-assignment bullet without naming an assigner.
  const ultimateOwnerId =
    typeof window !== 'undefined'
      ? localStorage.getItem('detect-ultimate-owner')
      : null;
  const effectiveReason: AssigneeReason =
    reason ??
    (memberId === ultimateOwnerId
      ? { type: 'ultimate-owner' }
      : { type: 'manual' });

  // Universal intro for every reason type — "[Subject] [are/is]
  // assigned to this transaction because:" (Carmen 5.28.26). The
  // bullet below it is the type-specific sentence.
  const subjectAreIs = isSelf ? 'You are' : `${firstName} is`;
  const intro = `${subjectAreIs} assigned to this transaction because:`;
  const bullet = formatReasonBullet(effectiveReason, { isSelf, firstName });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="relative w-[300px] p-0"
      >
        {/* No header anymore (Carmen 5.28.26). The close × floats in
             the top-right corner of the card body so the user can
             still dismiss it explicitly (Esc + click-outside also
             work via Radix). */}
        <PopoverClose
          aria-label="Close"
          // focus-visible (not focus) — Radix auto-focuses this on
          // open, which would otherwise show the brand-green ring
          // immediately. focus-visible keeps the ring for keyboard
          // navigation but suppresses it on programmatic focus.
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/40"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </PopoverClose>
        {/* Body — universal intro above the reason bullet (Carmen
             5.28.26). The bullet renders with a disc marker.
             Right-padding accounts for the floating close button. */}
        <div className="px-4 py-3 pr-9">
          <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
            {intro}
          </p>
          <ul className="mt-1.5 list-disc pl-4">
            <li className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
              {bullet}
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Convert the structured reason into the human-readable bullet
 * line. Carmen's verbatim copy, with first-name swapping on the
 * "You / [Name]" subject for non-self viewers.
 */
/**
 * Convert a structured reason into the bullet sentence under the
 * universal intro ("[Subject] [are/is] assigned to this transaction
 * because:"). Person-aware on the subject.
 */
function formatReasonBullet(
  reason: AssigneeReason,
  ctx: { isSelf: boolean; firstName: string },
): string {
  const subjAre = ctx.isSelf ? 'You are' : `${ctx.firstName} is`;
  const subjWere = ctx.isSelf ? 'You were' : `${ctx.firstName} was`;
  switch (reason.type) {
    case 'rule':
      return `${subjAre} the assignee on the rule: ${reason.ruleName}`;
    case 'account':
      // Mid-dot between entity + account, with the account name
      // appended when known (Carmen 5.28.26).
      return `${subjAre} the assignee for ${reason.entityName} · ${reason.accountCode}${reason.accountName ? ` ${reason.accountName}` : ''}.`;
    case 'manual':
      return reason.assignedBy
        ? `${subjWere} assigned by ${reason.assignedBy}.`
        : `Manually assigned via Edit Assignees.`;
    case 'ultimate-owner':
      // No trailing period — Carmen 5.28.26.
      return `${subjAre} the Ultimate Owner`;
  }
}

/** Small avatar bubble — sm size, FlowUI brand-green gradient. */
function AvatarBubble({ memberId }: { memberId: string }) {
  const member = getTeamMember(memberId);
  const initials = (member?.name ?? memberId)
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1FAC76] to-[#186749] font-['Inter'] text-[11px] font-semibold leading-4 text-white"
      aria-hidden
    >
      {initials}
    </span>
  );
}

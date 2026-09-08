import type { TeamMember } from './types';

/**
 * Parallax Labs' 7-person accounting team.
 *
 * Replaces the inconsistent 27-person roster from the Figma Make import.
 * Each member has a clear role + functional focus so the team can be
 * introduced narratively in comments, assignments, and activity log entries.
 *
 * The `id` is kebab-cased and used as a stable foreign key everywhere.
 */
// Professional headshot avatars from randomuser.me — they produce the
// "real-photo" look matching the Figma reference (qvhPfz0sVasbsExYy0VBRe
// node 280:228469). Keeping the URLs centralized here so updates are easy.
export const team: TeamMember[] = [
  {
    id: 'priya-patel',
    name: 'Priya Patel',
    initials: 'PP',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'vp-controller',
    roleLabel: 'VP, Controller',
    focus: 'Close ownership, audit liaison',
    email: 'priya.patel@parallaxlabs.com',
  },
  {
    id: 'marcus-rodriguez',
    name: 'Marcus Rodriguez',
    initials: 'MR',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'assistant-controller',
    roleLabel: 'Assistant Controller',
    focus: 'Consolidations, intercompany',
    email: 'marcus.rodriguez@parallaxlabs.com',
  },
  {
    // ID kept stable so seed data references (assignees, sign-offs,
    // currentUserId, etc.) continue to work without a mass rename.
    id: 'samantha-sheldon',
    name: 'Olivia Reed',
    initials: 'OR',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'senior-accountant',
    roleLabel: 'Senior Accountant',
    focus: 'Detect reviewer, controls',
    email: 'olivia.reed@parallaxlabs.com',
  },
  {
    id: 'emily-chen',
    name: 'Emily Chen',
    initials: 'EC',
    avatar: 'https://randomuser.me/api/portraits/women/79.jpg',
    role: 'senior-accountant',
    roleLabel: 'Senior Accountant',
    focus: 'AR, deferred revenue',
    email: 'emily.chen@parallaxlabs.com',
  },
  {
    id: 'david-park',
    name: 'David Park',
    initials: 'DP',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    role: 'staff-accountant',
    roleLabel: 'Staff Accountant',
    focus: 'AP lead',
    email: 'david.park@parallaxlabs.com',
  },
  {
    id: 'lisa-zhang',
    name: 'Lisa Zhang',
    initials: 'LZ',
    avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
    role: 'staff-accountant',
    roleLabel: 'Staff Accountant',
    focus: 'Revenue lead',
    email: 'lisa.zhang@parallaxlabs.com',
  },
  {
    id: 'jennifer-wu',
    name: 'Jennifer Wu',
    initials: 'JW',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    role: 'staff-accountant',
    roleLabel: 'Staff Accountant',
    focus: 'Cash / Treasury lead',
    email: 'jennifer.wu@parallaxlabs.com',
  },
];

/**
 * The "logged-in" user in the prototype. Samantha is the Detect reviewer
 * so most actions originate from her.
 */
export const currentUserId = 'samantha-sheldon';

export function getTeamMember(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}

export function getCurrentUser(): TeamMember {
  const m = getTeamMember(currentUserId);
  if (!m) throw new Error(`currentUser ${currentUserId} not found in team roster`);
  return m;
}

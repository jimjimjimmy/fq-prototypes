export type NavItem = { id: string; label: string }
export type NavSection = { id: string; label: string; items: NavItem[] }

export const navSections: NavSection[] = [
  {
    id: 'governance',
    label: 'Governance',
    items: [
      { id: 'frameworks', label: 'Frameworks' },
      { id: 'programs', label: 'Programs' },
      { id: 'policies', label: 'Policies' },
      { id: 'processes-gov', label: 'Processes' },
    ],
  },
  {
    id: 'risks-controls',
    label: 'Risks & Controls',
    items: [
      { id: 'risks', label: 'Risks' },
      { id: 'controls', label: 'Controls' },
      { id: 'scoping', label: 'Scoping' },
    ],
  },
  {
    id: 'testing-evidence',
    label: 'Testing & Evidence',
    items: [
      { id: 'tests', label: 'Tests' },
      { id: 'gaps', label: 'Gaps' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'evidence-requests', label: 'Evidence Requests' },
      { id: 'processes-test', label: 'Processes' },
    ],
  },
  {
    id: 'key-sources',
    label: 'Key Sources',
    items: [
      { id: 'key-systems', label: 'Key Systems' },
      { id: 'key-reports', label: 'Key Reports' },
      { id: 'ai-capabilities', label: 'AI Capabilities' },
    ],
  },
]

import type { Persona, PersonaId } from '@/types';

export const personas: Record<PersonaId, Persona> = {
  'emma-harrison': {
    personaId: 'emma-harrison',
    id: 'u-emma',
    name: 'Emma Harrison',
    initials: 'EH',
    email: 'emma.harrison@jaguarlandrover.com',
    role: 'Preparer',
    title: 'Senior Financial Analyst',
    description: 'Handles vehicle inventory reconciliations, bank reconciliations, revenue recognition, and month-end close tasks across JLR manufacturing entities.',
    defaultView: 'table',
    focusAreas: ['Bank Reconciliations', 'Revenue Recognition', 'Month-End Close'],
    taskFilter: {
      preparers: ['Emma Harrison'],
    },
  },
  'tom-bradley': {
    personaId: 'tom-bradley',
    id: 'u-tom',
    name: 'Tom Bradley',
    initials: 'TB',
    email: 'tom.bradley@jaguarlandrover.com',
    role: 'Reviewer',
    title: 'Financial Controller',
    description: 'Reviews and approves prepared work across manufacturing and dealer operations. Manages the review queue, ensures accuracy of cost accounting and inventory valuations.',
    defaultView: 'board',
    focusAreas: ['Review Queue', 'Approvals', 'Cost Accounting'],
    taskFilter: {
      reviewers: ['Tom Bradley'],
    },
  },
  'claire-mitchell': {
    personaId: 'claire-mitchell',
    id: 'u-claire',
    name: 'Claire Mitchell',
    initials: 'CM',
    email: 'claire.mitchell@jaguarlandrover.com',
    role: 'Controller',
    title: 'Group Financial Controller',
    description: 'Oversees the entire close process across UK, China, India, and Slovakia entities. Tracks deadlines, manages cross-entity dependencies, and ensures on-time board reporting.',
    defaultView: 'timeline',
    focusAreas: ['Cross-Entity Oversight', 'Close Timeline', 'Consolidation'],
    taskFilter: {
      preparers: ['Emma Harrison', 'Priya Sharma'],
      reviewers: ['Tom Bradley', 'Richard Keane'],
    },
  },
  'rachel-torres': {
    personaId: 'rachel-torres',
    id: 'u-rachel',
    name: 'Rachel Torres',
    initials: 'RT',
    email: 'rachel.torres@schoolstatus.com',
    role: 'Controller',
    title: 'Chief Financial Officer',
    description: 'Oversees the monthly close for a K-12 school district — manages fund accounting, grant compliance, board reporting, and capital project tracking across general, bond, and federal fund types.',
    defaultView: 'calendar',
    focusAreas: ['Fund Accounting', 'Grant Compliance', 'Board Reporting'],
    taskFilter: {
      preparers: ['Sarah Mitchell', 'Lisa Park', 'Rachel Torres'],
      reviewers: ['James Cooper', 'Rachel Torres'],
    },
  },
};

export const defaultPersonaId: PersonaId = 'emma-harrison';

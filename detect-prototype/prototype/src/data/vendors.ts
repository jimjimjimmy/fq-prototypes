import type { Vendor } from './types';

/**
 * Parallax Labs vendor roster (~40 vendors).
 *
 * A mix of realistic SaaS-company vendors organized by category, plus a
 * handful of "new" and "suspicious" vendors seeded specifically so the
 * rules engine + AI has material to flag in the prototype.
 *
 * `firstSeenDate` drives the "New Vendor - High Risk" rule. Vendors with
 * firstSeenDate inside the current period (2026-04) and a flag will
 * produce anomalies when their first large invoice posts.
 */
export const vendors: Vendor[] = [
  // ---------- Cloud infrastructure ----------
  {
    id: 'vendor-aws',
    name: 'Amazon Web Services',
    category: 'cloud-infra',
    defaultGLAccount: '5010',
    firstSeenDate: '2020-03-14',
    typicalMonthlySpend: 87_500,
  },
  {
    id: 'vendor-snowflake',
    name: 'Snowflake',
    category: 'cloud-infra',
    defaultGLAccount: '5020',
    firstSeenDate: '2022-11-02',
    typicalMonthlySpend: 24_800,
  },
  {
    id: 'vendor-datadog',
    name: 'Datadog',
    category: 'cloud-infra',
    defaultGLAccount: '6110',
    firstSeenDate: '2021-06-18',
    typicalMonthlySpend: 12_400,
  },
  {
    id: 'vendor-cloudflare',
    name: 'Cloudflare',
    category: 'cloud-infra',
    defaultGLAccount: '6110',
    firstSeenDate: '2020-09-01',
    typicalMonthlySpend: 4_600,
  },

  // ---------- Dev tools ----------
  {
    id: 'vendor-github',
    name: 'GitHub',
    category: 'dev-tools',
    defaultGLAccount: '6110',
    firstSeenDate: '2019-01-10',
    typicalMonthlySpend: 3_900,
  },
  {
    id: 'vendor-linear',
    name: 'Linear',
    category: 'dev-tools',
    defaultGLAccount: '6110',
    firstSeenDate: '2023-02-14',
    typicalMonthlySpend: 2_100,
  },
  {
    id: 'vendor-figma',
    name: 'Figma',
    category: 'dev-tools',
    defaultGLAccount: '6110',
    firstSeenDate: '2020-04-22',
    typicalMonthlySpend: 1_850,
  },
  {
    id: 'vendor-notion',
    name: 'Notion',
    category: 'dev-tools',
    defaultGLAccount: '6110',
    firstSeenDate: '2021-08-30',
    typicalMonthlySpend: 1_450,
  },
  {
    id: 'vendor-1password',
    name: '1Password',
    category: 'dev-tools',
    defaultGLAccount: '6120',
    firstSeenDate: '2020-02-03',
    typicalMonthlySpend: 2_700,
  },
  {
    id: 'vendor-vercel',
    name: 'Vercel',
    category: 'dev-tools',
    defaultGLAccount: '6110',
    firstSeenDate: '2022-05-17',
    typicalMonthlySpend: 3_200,
  },

  // ---------- SaaS / Business tools ----------
  {
    id: 'vendor-salesforce',
    name: 'Salesforce',
    category: 'saas',
    defaultGLAccount: '6130',
    firstSeenDate: '2019-11-04',
    typicalMonthlySpend: 34_000,
  },
  {
    id: 'vendor-hubspot',
    name: 'HubSpot',
    category: 'saas',
    defaultGLAccount: '6130',
    firstSeenDate: '2020-07-15',
    typicalMonthlySpend: 8_700,
  },
  {
    id: 'vendor-slack',
    name: 'Slack',
    category: 'saas',
    defaultGLAccount: '6100',
    firstSeenDate: '2019-03-20',
    typicalMonthlySpend: 5_400,
  },
  {
    id: 'vendor-zoom',
    name: 'Zoom',
    category: 'saas',
    defaultGLAccount: '6100',
    firstSeenDate: '2019-08-11',
    typicalMonthlySpend: 3_800,
  },
  {
    id: 'vendor-okta',
    name: 'Okta',
    category: 'saas',
    defaultGLAccount: '6120',
    firstSeenDate: '2020-01-29',
    typicalMonthlySpend: 7_200,
  },
  {
    id: 'vendor-docusign',
    name: 'DocuSign',
    category: 'saas',
    defaultGLAccount: '6100',
    firstSeenDate: '2020-06-14',
    typicalMonthlySpend: 2_400,
  },

  // ---------- Professional services ----------
  {
    id: 'vendor-deloitte',
    name: 'Deloitte',
    category: 'pro-services',
    defaultGLAccount: '6510',
    firstSeenDate: '2022-01-19',
    typicalMonthlySpend: 48_000,
  },
  {
    id: 'vendor-wsgr',
    name: 'Wilson Sonsini Goodrich & Rosati',
    category: 'legal',
    defaultGLAccount: '6500',
    firstSeenDate: '2018-07-02',
    typicalMonthlySpend: 32_000,
  },
  {
    id: 'vendor-pwc',
    name: 'PricewaterhouseCoopers',
    category: 'pro-services',
    defaultGLAccount: '6520',
    firstSeenDate: '2023-04-08',
    typicalMonthlySpend: 18_500,
  },
  {
    id: 'vendor-andreessen-hr',
    name: 'Andreessen HR Partners',
    category: 'pro-services',
    defaultGLAccount: '6040',
    firstSeenDate: '2024-02-12',
    typicalMonthlySpend: 14_000,
  },

  // ---------- HR / Payroll ----------
  {
    id: 'vendor-rippling',
    name: 'Rippling',
    category: 'hr-payroll',
    defaultGLAccount: '6030',
    firstSeenDate: '2021-03-01',
    typicalMonthlySpend: 16_200,
  },
  {
    id: 'vendor-gusto',
    name: 'Gusto',
    category: 'hr-payroll',
    defaultGLAccount: '6030',
    firstSeenDate: '2020-05-20',
    typicalMonthlySpend: 4_100,
  },
  {
    id: 'vendor-carta',
    name: 'Carta',
    category: 'hr-payroll',
    defaultGLAccount: '6100',
    firstSeenDate: '2019-12-04',
    typicalMonthlySpend: 2_800,
  },

  // ---------- Facilities ----------
  {
    id: 'vendor-wework',
    name: 'WeWork',
    category: 'facilities',
    defaultGLAccount: '6300',
    firstSeenDate: '2019-02-14',
    typicalMonthlySpend: 42_000,
  },
  {
    id: 'vendor-comcast',
    name: 'Comcast Business',
    category: 'facilities',
    defaultGLAccount: '6320',
    firstSeenDate: '2019-02-14',
    typicalMonthlySpend: 3_600,
  },

  // ---------- Marketing ----------
  {
    id: 'vendor-gartner',
    name: 'Gartner',
    category: 'marketing',
    defaultGLAccount: '6220',
    firstSeenDate: '2022-09-07',
    typicalMonthlySpend: 15_600,
  },
  {
    id: 'vendor-g2',
    name: 'G2',
    category: 'marketing',
    defaultGLAccount: '6200',
    firstSeenDate: '2023-01-18',
    typicalMonthlySpend: 4_300,
  },
  {
    id: 'vendor-zoominfo',
    name: 'ZoomInfo',
    category: 'marketing',
    defaultGLAccount: '6130',
    firstSeenDate: '2022-04-11',
    typicalMonthlySpend: 9_800,
  },
  {
    id: 'vendor-linkedin-ads',
    name: 'LinkedIn Marketing Solutions',
    category: 'marketing',
    defaultGLAccount: '6200',
    firstSeenDate: '2021-10-05',
    typicalMonthlySpend: 22_000,
  },
  {
    id: 'vendor-saastr',
    name: 'SaaStr Events',
    category: 'marketing',
    defaultGLAccount: '6210',
    firstSeenDate: '2022-08-15',
    typicalMonthlySpend: 6_500,
  },

  // ---------- Travel ----------
  {
    id: 'vendor-uber',
    name: 'Uber for Business',
    category: 'travel',
    defaultGLAccount: '6430',
    firstSeenDate: '2020-01-15',
    typicalMonthlySpend: 4_800,
  },
  {
    id: 'vendor-amex-travel',
    name: 'Amex Global Business Travel',
    category: 'travel',
    defaultGLAccount: '6400',
    firstSeenDate: '2021-05-03',
    typicalMonthlySpend: 28_000,
  },

  // ---------- Other / Misc (legitimate) ----------
  {
    id: 'vendor-equinix',
    name: 'Equinix',
    category: 'cloud-infra',
    defaultGLAccount: '5010',
    firstSeenDate: '2020-08-22',
    typicalMonthlySpend: 11_200,
  },
  {
    id: 'vendor-chubb',
    name: 'Chubb Insurance',
    category: 'other',
    defaultGLAccount: '6600',
    firstSeenDate: '2020-03-01',
    typicalMonthlySpend: 9_400,
  },
  {
    id: 'vendor-marsh-insurance',
    name: 'Marsh Insurance',
    category: 'other',
    defaultGLAccount: '6610',
    firstSeenDate: '2021-07-19',
    typicalMonthlySpend: 5_800,
  },

  // ---------- Seeded-for-anomaly vendors ----------
  // These are intentionally "new" or "suspicious" to give the rules engine
  // and AI material to flag.

  {
    id: 'vendor-acme-consulting',
    name: 'Acme Consulting Group',
    category: 'pro-services',
    defaultGLAccount: '6040',
    firstSeenDate: '2026-04-14', // new in current period — will trip "New Vendor"
    typicalMonthlySpend: 0,
    flags: ['new'],
  },
  {
    id: 'vendor-digital-reach',
    name: 'Digital Reach Media',
    category: 'marketing',
    defaultGLAccount: '6200',
    firstSeenDate: '2026-04-03',
    typicalMonthlySpend: 0,
    flags: ['new'],
  },
  {
    id: 'vendor-premier-office',
    name: 'Premier Office Solutions',
    category: 'facilities',
    defaultGLAccount: '6310',
    firstSeenDate: '2026-03-22',
    typicalMonthlySpend: 0,
    flags: ['new'],
  },
  {
    id: 'vendor-techsoft',
    name: 'TechSoft Solutions LLC',
    category: 'pro-services',
    defaultGLAccount: '6040',
    firstSeenDate: '2026-04-18',
    typicalMonthlySpend: 0,
    flags: ['new', 'unverified-bank'],
  },
  {
    id: 'vendor-nimbus-advisors',
    name: 'Nimbus Advisory Partners',
    category: 'pro-services',
    defaultGLAccount: '6040',
    firstSeenDate: '2026-04-11',
    typicalMonthlySpend: 0,
    flags: ['new', 'suspicious'],
  },
];

export function getVendor(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

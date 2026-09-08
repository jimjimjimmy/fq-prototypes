/** Shared value shapes used across profiles + renderers. */

/** FlowUI TableStatusBadge semantic color names — the only valid badge colors in table cells. */
export type BadgeColor = 'default' | 'info' | 'danger' | 'success' | 'warning' | 'highlight'

export interface Person {
  name: string
  initials: string
  role?: string
  signedOff?: boolean
  signOffDate?: string
}

/** Canonical workflow statuses — drive the FlowUI status dot+text renderer. */
export type StatusValue =
  | 'Not started'
  | 'In progress'
  | 'In review'
  | 'Complete'
  | 'Overdue'
  | 'Blocked'

export const CURRENCY = (currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const NUMBER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

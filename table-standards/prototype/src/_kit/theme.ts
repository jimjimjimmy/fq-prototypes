import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming'
import { tokenValue } from './tokens.ts'

/**
 * The FloQast base grid theme. themeQuartz + Material icons + FlowUI token params.
 * Design Bar principle: a user "should not be able to tell it's AG Grid" (Benjamin, May 20).
 * Single source — profiles pick a density variant below, they never re-author params.
 */
export const floqastGridTheme = themeQuartz.withPart(iconSetMaterial).withParams({
  accentColor: tokenValue.accent,
  borderColor: tokenValue.border,
  browserColorScheme: 'light',
  foregroundColor: tokenValue.foreground,
  headerBackgroundColor: tokenValue.headerBg,
  headerTextColor: tokenValue.headerText,
  headerFontWeight: 600,
  checkboxUncheckedBorderColor: tokenValue.formsStroke,
  checkboxIndeterminateBackgroundColor: tokenValue.formsStroke,
  checkboxIndeterminateBorderColor: tokenValue.formsStroke,
  fontFamily: { googleFont: 'Inter' },
  wrapperBorderRadius: '6px',
  rowHoverColor: tokenValue.rowHover,
  selectedRowBackgroundColor: tokenValue.selectedRow,
  columnBorder: false,
})

/**
 * DEFAULT density — data-dense / Excel parity (Tyler Davis: "they're used to data-dense
 * displays… let's give them that", + compact-view-by-default). Single-line headers, tight rows.
 */
export const compactTheme = floqastGridTheme.withParams({
  fontSize: '12px',
  headerFontSize: '12px',
  spacing: '6px',
  rowHeight: 36,
  headerHeight: 38,
})

/**
 * Comfortable density — system-of-record surfaces (P0). More scannable, less dense.
 * Mirrors the admin adminLiteGridTheme extension (13px / 12px / 44px header).
 */
export const comfortableTheme = floqastGridTheme.withParams({
  fontSize: '13px',
  headerFontSize: '13px',
  spacing: '12px',
  rowHeight: 48,
  headerHeight: 44,
})

export type Density = 'compact' | 'comfortable'
export const themeForDensity = (d: Density) => (d === 'compact' ? compactTheme : comfortableTheme)

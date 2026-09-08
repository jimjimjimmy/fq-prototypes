import { themeQuartz, iconSetMaterial } from 'ag-grid-community'

/**
 * FloQast-branded AG Grid theme.
 *
 * Values come from the FlowUI "AG Grid" design system page (Storybook /
 * Zeroheight) and the flow-ui-design-system skill. The Theming API is built
 * into `ag-grid-community` (v33+), so we import `themeQuartz` from there rather
 * than the legacy `@ag-grid-community/theming` package.
 */
export const floqastGridTheme = themeQuartz
  .withPart(iconSetMaterial)
  .withParams({
    accentColor: '#1FAC76',
    borderColor: '#E1E6EF',
    browserColorScheme: 'light',
    checkboxIndeterminateBackgroundColor: '#CBD2E1',
    checkboxIndeterminateBorderColor: '#CBD2E1',
    checkboxUncheckedBorderColor: '#CBD2E1',
    fontFamily: { googleFont: 'Inter' },
    fontSize: '12px',
    foregroundColor: '#1D2433',
    headerBackgroundColor: '#F8FAFC',
    headerFontSize: '12px',
    headerFontWeight: 600,
    headerTextColor: '#1B1F27',
    spacing: '8px',
    wrapperBorderRadius: '6px',
  })

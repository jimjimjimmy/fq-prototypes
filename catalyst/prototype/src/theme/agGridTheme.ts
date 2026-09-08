import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming';

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
  });

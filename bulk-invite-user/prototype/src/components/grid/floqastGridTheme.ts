import { themeQuartz, iconSetMaterial } from '@ag-grid-community/theming'

/**
 * floqastGridTheme — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * Canonical AG Grid v32 theme for every grid in the prototype. Copied
 * verbatim from v1 (`legacy-prototype-work/prototype-legacy/src/components/
 * grid/floqastGridTheme.ts`). Centralizes brand tokens (FQ accent green,
 * brand border, Inter font, 8px spacing) so feature grids extend a single
 * source rather than re-deriving colors.
 *
 * **Usage in a feature grid:**
 *
 *   import { floqastGridTheme } from '../../../scaffold/grid/floqastGridTheme';
 *
 *   const myFeatureTheme = floqastGridTheme.withParams({
 *     // optional per-feature overrides
 *     foregroundColor: '#424867',
 *   });
 *
 *   <AgGridReact theme={myFeatureTheme} ... />
 *
 * **Reference implementation:** the canonical accruals table at
 * `knowledge/design-system/examples/ag-grid/accruals-table.example.tsx`
 * demonstrates 22 patterns (status badges, currency formatting, custom
 * cell renderers, pagination, etc.). When borrowing a pattern, cite it by
 * pattern number from `knowledge/design-system/examples/ag-grid/README.md`
 * in a code comment so reviews can trace back to the canonical example.
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

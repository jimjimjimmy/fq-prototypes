/**
 * Global scaffold — portable across FloQast prototypes.
 *
 * This layer contains the global FloQast chrome (left rail + admin settings
 * top bar). It carries no Data Studio–specific assumptions and could be
 * extracted to `projects/_shared/scaffold/global/` later if other prototypes
 * adopt it.
 *
 * Anything that imports from here MUST live outside `scaffold/global/` —
 * scaffold/global/ files do not import each other (preserves the extractable
 * boundary).
 */

export { GlobalRail } from './GlobalRail';
export type { GlobalRailProps } from './GlobalRail';
export { AdminSettingsNav, SETTINGS_TABS } from './AdminSettingsNav';
export type { AdminSettingsNavProps, SettingsTab } from './AdminSettingsNav';

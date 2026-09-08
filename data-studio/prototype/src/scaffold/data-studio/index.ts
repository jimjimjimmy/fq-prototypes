/**
 * Data Studio scaffold — locked composition layer.
 *
 * Feature folders under src/features/ import L1Frame or L2Frame and pass
 * their content as children. The frames handle all chrome (rail, top bar,
 * page header, L1 tabs OR L2 sidebar + fullscreen).
 *
 * Feature code should never import GlobalRail / AdminSettingsNav / L1Tabs /
 * L2Sidebar / PageHeader directly — go through L1Frame or L2Frame so the
 * scaffold owns the composition.
 */

export { L1Frame } from './L1Frame';
export type { L1FrameProps } from './L1Frame';
export { L2Frame } from './L2Frame';
export type { L2FrameProps } from './L2Frame';

// Re-export the prop types feature code commonly needs:
export type { L1TabId } from './L1Tabs';
export type { L2SidebarItem } from './L2Sidebar';
export type { PageHeaderBreadcrumbItem, PageHeaderStatus } from './PageHeader';

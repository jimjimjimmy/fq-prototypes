/**
 * Feature route registry — the seam.
 *
 * Each feature folder under `src/features/<name>/` owns a `routes.tsx` file
 * that exports a JSX `<Route>` (or array of Routes) describing its URL
 * structure. They're imported here and collected into `featureRoutes`,
 * which `App.tsx` iterates inside the `/data-studio` Routes block.
 *
 * **Adding a new feature is two lines:**
 *
 *   1. Add `import { fooRoutes } from '../features/foo/routes'`
 *   2. Push `fooRoutes` into the array below.
 *
 * That's the entire boundary. App.tsx, the scaffold, and every other feature
 * stay untouched.
 *
 * Pre-seeded with stub feature folders in Step 4. Step 7 replaces stubs with
 * ported v1 code for field-mapping and connector setup.
 */

import type { ReactElement } from 'react';

import { catalogRoutes } from '../features/catalog/routes';
import { dimensionsRoutes } from '../features/dimensions/routes';
import { connectorsRoutes } from '../features/connectors/routes';
import { logsRoutes } from '../features/logs/routes';
import { modelViewRoutes } from '../features/model-view/routes';

// entity-mapping deliberately not yet registered — placeholder folder
// pending IA decision (see features/entity-mapping/README.md).

// Order matches the L1 tab strip in `scaffold/data-studio/L1Tabs.tsx`
// (Catalog · Dimensions · Connectors · Logs). React Router doesn't care
// about array order for route matching, but keeping it consistent with
// the tab visual order makes the registry easier to scan.
export const featureRoutes: ReactElement[] = [
  catalogRoutes,
  dimensionsRoutes,
  ...connectorsRoutes,
  logsRoutes,
  ...modelViewRoutes,
];

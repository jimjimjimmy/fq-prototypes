/**
 * Data Studio v2 — App root
 *
 * Composes the locked scaffold with the feature route registry. Intentionally
 * tiny — most app concerns belong inside features.
 *
 *   /                            → redirects to /data-studio/catalog
 *   /data-studio                 → redirects to /data-studio/catalog
 *   /data-studio/{catalog,dimensions,connectors,logs}  → L1 feature route
 *   /data-studio/model/:id       → redirects to /data-studio/model/:id/overview
 *   /data-studio/model/:id/...   → L2 model-view section routes
 *
 * Why a registry seam: each feature folder owns its own `routes.tsx` and
 * collisions only ever happen in `src/routes/registry.ts` (one line per
 * feature, trivial to resolve). See routes/registry.ts.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { featureRoutes } from './routes/registry';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/data-studio/catalog" replace />} />

      <Route path="/data-studio">
        <Route index element={<Navigate to="catalog" replace />} />
        {/* Feature routes — populated from src/routes/registry.ts. Each
            feature folder owns its own routes.tsx; the registry composes them. */}
        {featureRoutes}
      </Route>

      <Route
        path="*"
        element={
          <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
            <h2>Route not found</h2>
            <p style={{ color: '#6b7280' }}>
              Tried to render a URL that doesn't match a registered route. Either
              register a feature in <code>src/routes/registry.ts</code> or visit{' '}
              <a href="/data-studio/catalog">/data-studio/catalog</a>.
            </p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

import { Route } from 'react-router-dom';
import { ConnectorsListPage } from './ConnectorsListPage';
import { connectorSetupRoutes } from './setup/routes';

/**
 * Connectors feature routes.
 *
 * - `/data-studio/connectors`       → list view (ConnectorsListPage)
 * - `/data-studio/connectors/setup` → full-screen picker + wizard
 *                                      (ported from netlify in Step 7c)
 *
 * The setup route renders outside the v2 L1Frame chrome on purpose —
 * a focused setup task shouldn't surface the L1 tabs (would let users
 * accidentally navigate away mid-wizard). See setup/routes.tsx.
 *
 * Exported as an array so the parent registry can spread it.
 */
export const connectorsRoutes = [
  <Route key="connectors-list" path="connectors" element={<ConnectorsListPage />} />,
  connectorSetupRoutes,
];

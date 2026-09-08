import { Route, Navigate } from 'react-router-dom';
import { overviewRoutes } from './overview/routes';
import { sourceDatasetsRoutes } from './source-datasets/routes';
import { fieldMappingRoutes } from './field-mapping/routes';
import { dataPreviewRoutes } from './data-preview/routes';
import { versionsRoutes } from './versions/routes';
import { modelLogsRoutes } from './logs/routes';

/**
 * Model View L2 routes.
 *
 * All six section routes plus an index redirect from
 * /data-studio/model/:modelId → /data-studio/model/:modelId/overview.
 *
 * To add a new section: append to `MODEL_VIEW_SECTIONS` in sections.ts,
 * create a sibling sub-folder with its own routes.tsx, and import/spread
 * its export here.
 */
export const modelViewRoutes = [
  <Route key="mv-index" path="model/:modelId" element={<Navigate to="overview" replace />} />,
  overviewRoutes,
  sourceDatasetsRoutes,
  fieldMappingRoutes,
  dataPreviewRoutes,
  versionsRoutes,
  modelLogsRoutes,
];

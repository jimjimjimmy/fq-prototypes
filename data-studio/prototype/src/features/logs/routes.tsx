import { Route } from 'react-router-dom';
import { LogsPage } from './LogsPage';

export const logsRoutes = (
  <Route key="logs" path="logs" element={<LogsPage />} />
);

import { Route } from 'react-router-dom';
import { CatalogPage } from './CatalogPage';

export const catalogRoutes = (
  <Route key="catalog" path="catalog" element={<CatalogPage />} />
);

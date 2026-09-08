import { Route } from 'react-router-dom';
import { ModelStubLayout } from '../ModelStubLayout';
import { OverviewContent } from './OverviewContent';

function OverviewPage() {
  return (
    <ModelStubLayout activeSectionId="overview" sectionTitle="Overview">
      <OverviewContent />
    </ModelStubLayout>
  );
}

export const overviewRoutes = (
  <Route key="mv-overview" path="model/:modelId/overview" element={<OverviewPage />} />
);

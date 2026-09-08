import { Route, useParams } from 'react-router-dom';
import { ModelStubLayout } from '../ModelStubLayout';
import { SourceDatasetsContent } from './SourceDatasetsContent';

function SourceDatasetsPage() {
  const { modelId } = useParams<{ modelId: string }>();
  return (
    <ModelStubLayout activeSectionId="source-datasets" sectionTitle="Source Datasets">
      {/* key remounts (and reseeds) state when switching models — no reset effect */}
      <SourceDatasetsContent key={modelId} />
    </ModelStubLayout>
  );
}

export const sourceDatasetsRoutes = (
  <Route key="mv-source-datasets" path="model/:modelId/source-datasets" element={<SourceDatasetsPage />} />
);

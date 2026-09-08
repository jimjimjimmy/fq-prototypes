import { Route } from 'react-router-dom';
import { ModelStubLayout } from '../ModelStubLayout';

function DataPreviewStub() {
  return (
    <ModelStubLayout activeSectionId="data-preview" sectionTitle="Data Preview">
      <p className="text-[14px] text-[#6b7280] m-0">
        Preview of mapped data — table view of records after mapping is applied.
      </p>
    </ModelStubLayout>
  );
}

export const dataPreviewRoutes = (
  <Route key="mv-data-preview" path="model/:modelId/data-preview" element={<DataPreviewStub />} />
);

import { Route } from 'react-router-dom';
import { ModelStubLayout } from '../ModelStubLayout';

function VersionsStub() {
  return (
    <ModelStubLayout activeSectionId="versions" sectionTitle="Versions">
      <p className="text-[14px] text-[#6b7280] m-0">
        Model version history, draft management, effective-date controls.
      </p>
    </ModelStubLayout>
  );
}

export const versionsRoutes = (
  <Route key="mv-versions" path="model/:modelId/versions" element={<VersionsStub />} />
);

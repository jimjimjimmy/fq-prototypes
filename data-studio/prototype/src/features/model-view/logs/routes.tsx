import { Route } from 'react-router-dom';
import { ModelStubLayout } from '../ModelStubLayout';

function ModelLogsStub() {
  return (
    <ModelStubLayout activeSectionId="logs" sectionTitle="Logs">
      <p className="text-[14px] text-[#6b7280] m-0">
        Per-model pipeline / activity log. Distinct from the global L1 Logs view.
      </p>
    </ModelStubLayout>
  );
}

export const modelLogsRoutes = (
  <Route key="mv-logs" path="model/:modelId/logs" element={<ModelLogsStub />} />
);

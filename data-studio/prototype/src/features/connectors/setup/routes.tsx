/**
 * Connector Setup — full-screen picker → wizard flow.
 *
 * Mounted at /data-studio/connectors/setup. The user is sent here from
 * the Connectors L1 tab's "Add Connector" button.
 *
 * Intentionally renders WITHOUT the v2 L1Frame chrome (no rail, no L1
 * tabs, no page header) — this matches v1's behavior and is the right
 * UX for a focused setup task: hiding the L1 tabs prevents the user
 * from accidentally navigating away mid-wizard.
 *
 * Phase state:
 *   - 'picker' → V2Picker (3 questions: Q1/Q2/Q3) gathers ConnectorChoice
 *   - 'wizard' → WizardApp (driven by chosen branch) configures the
 *                 connector itself
 *
 * Ported from the standalone Vite app at
 * `prototype/netlify/connector-setup-prototype/src/App.tsx` (Step 7c).
 * That live netlify version stays running in parallel — this is a copy
 * inside the v2 scaffold, not a move.
 *
 * Files NOT ported from the netlify version:
 *   - `App.tsx` — replaced by this file (routes.tsx)
 *   - `main.tsx` — v2 has its own (in src/main.tsx)
 *   - `index.css` — v2 has its own (in src/index.css)
 *   - `_kristin_App.reference.tsx` — reference material, not active code
 *   - `components/shell/DataStudioShell.tsx` — replaced by v2 scaffold
 *   - `components/shell/ConnectorsEmpty.tsx` — belongs to the connectors
 *     LIST feature (will be ported when ConnectorsListPage is built out)
 */

import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import V2Picker from './components/picker/V2Picker';
import WizardApp from './components/WizardApp';
import type { ConnectorChoice, V2Answers } from './lib/connectorChoice';
// Feature-local CSS — `--fq-*` token system + modal/reveal/flash animations.
// Carried forward from the netlify prototype's index.css. See setup.css.
import './setup.css';

type Phase = 'picker' | 'wizard';

const emptyAnswers: V2Answers = { q1: null, q2: null, q3: null };

function ConnectorSetupPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('picker');
  const [answers, setAnswers] = useState<V2Answers>(emptyAnswers);
  const [choice, setChoice] = useState<ConnectorChoice | null>(null);

  // Cancel always exits the wizard entirely — back to the connectors list.
  // The user's in-progress state is intentionally discarded; this is a
  // prototype, no save-draft concept yet.
  const handleCancel = () => {
    setPhase('picker');
    setAnswers(emptyAnswers);
    setChoice(null);
    navigate('/data-studio/connectors');
  };

  if (phase === 'wizard' && choice) {
    return (
      <WizardApp
        choice={choice}
        onCancel={handleCancel}
        onBackToPicker={() => setPhase('picker')}
      />
    );
  }

  return (
    <V2Picker
      answers={answers}
      onAnswersChange={setAnswers}
      onCancel={handleCancel}
      onSubmit={(nextChoice) => {
        setChoice(nextChoice);
        setPhase('wizard');
      }}
    />
  );
}

export const connectorSetupRoutes = (
  <Route
    key="connector-setup"
    path="connectors/setup"
    element={<ConnectorSetupPage />}
  />
);

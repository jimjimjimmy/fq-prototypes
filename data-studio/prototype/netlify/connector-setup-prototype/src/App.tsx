import React, { useState } from 'react';
import DataStudioShell from './components/shell/DataStudioShell';
import ConnectorsEmpty from './components/shell/ConnectorsEmpty';
import V2Picker from './components/picker/V2Picker';
import WizardApp from './components/WizardApp';
import type { ConnectorChoice, V2Answers } from './lib/connectorChoice';

type Phase = 'shell' | 'picker' | 'wizard';

const emptyAnswers: V2Answers = { q1: null, q2: null, q3: null };

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('shell');
  const [answers, setAnswers] = useState<V2Answers>(emptyAnswers);
  const [choice, setChoice] = useState<ConnectorChoice | null>(null);

  if (phase === 'wizard' && choice) {
    return (
      <WizardApp
        choice={choice}
        onCancel={() => {
          setPhase('shell');
          setAnswers(emptyAnswers);
          setChoice(null);
        }}
        onBackToPicker={() => {
          setPhase('picker');
        }}
      />
    );
  }

  if (phase === 'picker') {
    return (
      <V2Picker
        answers={answers}
        onAnswersChange={setAnswers}
        onCancel={() => {
          setPhase('shell');
          setAnswers(emptyAnswers);
        }}
        onSubmit={(choice) => {
          setChoice(choice);
          setPhase('wizard');
        }}
      />
    );
  }

  return (
    <DataStudioShell onAddConnector={() => setPhase('picker')} showSectionHeader={false}>
      <ConnectorsEmpty onAddConnector={() => setPhase('picker')} />
    </DataStudioShell>
  );
};

export default App;

// Maps the V2 picker's answers into a typed ConnectorChoice and decides
// which Kristin wizard branch to mount.

export type Q1 = 'pre-built' | 'custom';

export type PreBuiltSystem = 'qbo' | 'netsuite' | 'sage' | 'salesforce' | 'workday';
export type CustomTransmission = 'file' | 'api' | 'sftp';
export type QboTier = 'basic' | 'enhanced';

export type V2Answers = {
  q1: Q1 | null;
  q2: PreBuiltSystem | CustomTransmission | null;
  q3: QboTier | null;
};

export type ConnectorChoice =
  | { kind: 'pre-built'; system: 'qbo'; tier: QboTier }
  | { kind: 'pre-built'; system: Exclude<PreBuiltSystem, 'qbo'> }
  | { kind: 'custom'; transmission: CustomTransmission };

export type WizardBranch = 'dc' | 'cdc';

export const PRE_BUILT_SYSTEMS: { id: PreBuiltSystem; name: string; tint: string; border: string }[] = [
  { id: 'qbo', name: 'QuickBooks Online', tint: '#E8EFFB', border: '#C9D6EE' },
  { id: 'netsuite', name: 'NetSuite', tint: '#FDEDE6', border: '#F2C9B8' },
  { id: 'sage', name: 'Sage Intacct', tint: '#E5F1E8', border: '#BFD9C5' },
  { id: 'salesforce', name: 'Salesforce', tint: '#DDF0F8', border: '#B5DAEC' },
  { id: 'workday', name: 'Workday', tint: '#FFF1E0', border: '#F4D5A8' },
];

export const CUSTOM_TYPES: { id: CustomTransmission; name: string; description: string }[] = [
  { id: 'file', name: 'File', description: 'Manual Upload — .xlsx / .csv with schema inferred from a sample.' },
  { id: 'api', name: 'API', description: 'User-defined API endpoint — FQ pulls from a customer-hosted source.' },
  { id: 'sftp', name: 'SFTP', description: 'SFTP push/pull — existing pattern, retained per Kristin’s note.' },
];

export const SYSTEM_LETTER: Record<PreBuiltSystem, string> = {
  qbo: 'Q',
  netsuite: 'N',
  sage: 'S',
  salesforce: 'C',
  workday: 'W',
};

export function isComplete(answers: V2Answers): boolean {
  if (!answers.q1 || !answers.q2) return false;
  if (answers.q1 === 'pre-built' && answers.q2 === 'qbo' && !answers.q3) return false;
  return true;
}

export function v2AnswersToChoice(answers: V2Answers): ConnectorChoice | null {
  if (!isComplete(answers)) return null;
  if (answers.q1 === 'pre-built') {
    if (answers.q2 === 'qbo') {
      return { kind: 'pre-built', system: 'qbo', tier: answers.q3! };
    }
    return { kind: 'pre-built', system: answers.q2 as Exclude<PreBuiltSystem, 'qbo'> };
  }
  return { kind: 'custom', transmission: answers.q2 as CustomTransmission };
}

export function chooseWizardBranch(choice: ConnectorChoice): WizardBranch {
  // CDC for the Fivetran-backed pre-built systems; DC API for QBO and all custom paths.
  if (choice.kind === 'pre-built' && choice.system !== 'qbo') return 'cdc';
  return 'dc';
}

export function choiceLabel(choice: ConnectorChoice): string {
  if (choice.kind === 'pre-built') {
    if (choice.system === 'qbo') {
      return choice.tier === 'basic' ? 'QBO Basic' : 'QBO Enhanced';
    }
    return PRE_BUILT_SYSTEMS.find((s) => s.id === choice.system)!.name;
  }
  return CUSTOM_TYPES.find((t) => t.id === choice.transmission)!.name;
}

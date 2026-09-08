import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer';
import RuleBuilderContent from './RuleBuilderContent';
import type { Rule, PrepopulatedRuleData } from '../../types';

interface RuleBuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  editingRule?: Rule | null;
  onSave: (rule: Partial<Rule> & { id?: string }) => void;
  prepopulatedData?: PrepopulatedRuleData | null;
}

export default function RuleBuilderPanel({ isOpen, onClose, editingRule, onSave, prepopulatedData }: RuleBuilderPanelProps) {
  return (
    <SideDrawer show={isOpen} onCancel={onClose} width="md" renderOverlay>
      <RuleBuilderContent
        editingRule={editingRule}
        prepopulatedData={prepopulatedData}
        onSave={onSave}
        onClose={onClose}
        variant="panel"
      />
    </SideDrawer>
  );
}

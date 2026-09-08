import RuleBuilderContent from './RuleBuilderContent';
import type { Rule, PrepopulatedRuleData } from '../../types';

interface RuleBuilderInlineProps {
  editingRule?: Rule | null;
  prepopulatedData?: PrepopulatedRuleData | null;
  onSave: (rule: Partial<Rule> & { id?: string }) => void;
  onCancel: () => void;
}

export default function RuleBuilderInline({ editingRule, prepopulatedData, onSave, onCancel }: RuleBuilderInlineProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <RuleBuilderContent
        editingRule={editingRule}
        prepopulatedData={prepopulatedData}
        onSave={onSave}
        onClose={onCancel}
        variant="inline"
      />
    </div>
  );
}

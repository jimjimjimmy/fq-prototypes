import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Button from '@floqastinc/flow-ui_core/Button';
import Select from '@floqastinc/flow-ui_core/Select';
import type { Condition, FieldType, OperatorType } from '../../types';

interface ConditionBuilderProps {
  condition: Condition;
  onUpdate: (condition: Condition) => void;
  onDelete: () => void;
}

export default function ConditionBuilder({ condition, onUpdate, onDelete }: ConditionBuilderProps) {
  const fields: FieldType[] = ['Amount', 'Date', 'Account', 'Department', 'Class', 'Location', 'Memo', 'Created By', 'Entry Type', 'Vendor', 'Day Of Week', 'Has PO', 'Is Round Number', 'Is Post Close', 'Vendor Age'];
  const operators: OperatorType[] = ['Equals', 'Not Equals', 'Greater Than', 'Less Than', 'Greater Than or Equal', 'Less Than or Equal', 'Contains', 'Does Not Contain', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'];

  const fieldOptions = fields.map(f => ({ value: f, label: f }));
  const operatorOptions = operators.map(o => ({ value: o, label: o }));

  return (
    <div className="flex items-center" style={{
      padding: '10px 12px',
      gap: 12,
      background: 'var(--flo-sem-color-surface-default, #fff)',
      border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
      borderRadius: 6,
    }}>
      {condition.aiGenerated && (
        <AutoAwesome size={16} color="var(--flo-sem-color-success)" />
      )}
      <div className="flex-1">
        <Select
          options={fieldOptions}
          value={condition.field}
          onChange={(val: string) => onUpdate({ ...condition, field: val as FieldType, aiGenerated: false })}
          disableFilter
          disableClear
        />
      </div>

      <div className="flex-1">
        <Select
          options={operatorOptions}
          value={condition.operator}
          onChange={(val: string) => onUpdate({ ...condition, operator: val as OperatorType, aiGenerated: false })}
          disableFilter
          disableClear
        />
      </div>

      {!['Is Empty', 'Is Not Empty'].includes(condition.operator) && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <input type="text" value={condition.value}
            onChange={(e) => onUpdate({ ...condition, value: e.target.value, aiGenerated: false })}
            placeholder="Type Value"
            style={{
              width: '100%', padding: '8px 10px',
              border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
              borderRadius: 6, fontSize: 12, fontFamily: 'Inter, sans-serif',
              color: 'var(--flo-sem-color-text-default, #1d2433)',
              background: 'var(--flo-sem-color-surface-default, #fff)',
              outline: 'none',
            }}
          />
        </div>
      )}

      <Button variant="ghost" size="sm" color="danger" onClick={onDelete} style={{ flexShrink: 0, padding: 4, minWidth: 'auto' }}>
        <Delete size={16} />
      </Button>
    </div>
  );
}

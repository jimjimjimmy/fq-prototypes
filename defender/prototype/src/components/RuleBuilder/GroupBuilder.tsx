import Add from '@floqastinc/flow-ui_icons/material/Add';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Button from '@floqastinc/flow-ui_core/Button';
import ConditionBuilder from './ConditionBuilder';
import type { Condition, Group, RuleItem } from '../../types';

interface GroupBuilderProps {
  group: Group;
  onUpdate: (group: Group) => void;
  onDelete: () => void;
  depth?: number;
}

export default function GroupBuilder({ group, onUpdate, onDelete, depth = 0 }: GroupBuilderProps) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: 'condition',
      field: 'Amount',
      operator: 'Equals',
      value: ''
    };
    onUpdate({ ...group, items: [...group.items, newCondition] });
  };

  const addGroup = () => {
    const newGroup: Group = {
      id: Date.now().toString(),
      type: 'group',
      logic: 'AND',
      items: []
    };
    onUpdate({ ...group, items: [...group.items, newGroup] });
  };

  const updateItem = (index: number, item: RuleItem) => {
    const newItems = [...group.items];
    newItems[index] = item;
    onUpdate({ ...group, items: newItems });
  };

  const deleteItem = (index: number) => {
    onUpdate({ ...group, items: group.items.filter((_, i) => i !== index) });
  };

  const toggleLogic = () => {
    onUpdate({ ...group, logic: group.logic === 'AND' ? 'OR' : 'AND' });
  };

  return (
    <div style={{
      padding: 16, borderRadius: 6,
      border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
      background: depth > 0 ? 'var(--flo-sem-color-surface-secondary, #f8fafc)' : 'var(--flo-sem-color-surface-default, #fff)',
    }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-3">
          <button onClick={toggleLogic} style={{
            padding: '4px 12px', borderRadius: 4, fontWeight: 600, fontSize: 12, border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
            background: group.logic === 'AND' ? 'var(--flo-sem-color-surface-success-subtle, #ecfff8)' : 'var(--flo-sem-color-surface-info-subtle, #f0f5ff)',
            color: group.logic === 'AND' ? 'var(--flo-sem-color-success, #1fac76)' : 'var(--flo-sem-color-info, #3d7bf7)',
          }}>
            {group.logic}
          </button>
          <span style={{ fontSize: 12, color: 'var(--flo-sem-color-text-secondary)' }}>Group</span>
        </div>
        {depth > 0 && (
          <Button variant="ghost" size="sm" color="danger" onClick={onDelete} style={{ padding: 4, minWidth: 'auto' }}>
            <Delete size={16} />
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {group.items.map((item, index) => (
          <div key={item.id}>
            {item.type === 'condition' ? (
              <ConditionBuilder
                condition={item}
                onUpdate={(updated) => updateItem(index, updated)}
                onDelete={() => deleteItem(index)}
              />
            ) : (
              <GroupBuilder
                group={item}
                onUpdate={(updated) => updateItem(index, updated)}
                onDelete={() => deleteItem(index)}
                depth={depth + 1}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2" style={{ marginTop: 12 }}>
        <Button variant="ghost" size="sm" onClick={addCondition}>
          <Add size={14} /> Add Condition
        </Button>
        <Button variant="ghost" size="sm" onClick={addGroup}>
          <Add size={14} /> Add Group
        </Button>
      </div>
    </div>
  );
}

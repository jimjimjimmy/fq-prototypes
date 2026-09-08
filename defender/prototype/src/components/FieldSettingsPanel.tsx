import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer';
import CloseButton from '@floqastinc/flow-ui_core/CloseButton';
import Checkbox from '@floqastinc/flow-ui_core/Checkbox';
import Button from '@floqastinc/flow-ui_core/Button';
import { FIELD_OPTIONS } from '../data/constants';

export default function FieldSettingsPanel({
  isOpen,
  onClose,
  visibleFields,
  onFieldToggle
}: {
  isOpen: boolean;
  onClose: () => void;
  visibleFields: Record<string, boolean>;
  onFieldToggle: (field: string) => void;
}) {
  return (
    <SideDrawer show={isOpen} onCancel={onClose} width="md" renderOverlay>
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        <h2 className="text-base font-semibold" style={{ color: 'var(--flo-sem-color-text-default)' }}>Field Settings</h2>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm mb-4" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
          Select which fields to display in transaction details
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FIELD_OPTIONS.map((field) => (
            <div key={field.key} className="p-3 hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] rounded-lg transition-colors">
              <Checkbox
                label={field.label}
                checked={visibleFields[field.key]}
                onCheckedChange={() => onFieldToggle(field.key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--flo-base-color-neutral-100)] px-4 py-4">
        <Button onClick={onClose} size="sm">
          Done
        </Button>
      </div>
    </SideDrawer>
  );
}

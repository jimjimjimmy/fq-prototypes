import Modal from '@floqastinc/flow-ui_core/Modal';
import Button from '@floqastinc/flow-ui_core/Button';

export default function DeleteRuleModal({ isOpen, onClose, onConfirm, ruleName }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ruleName: string;
}) {
  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }} size="sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--flo-sem-color-text-default)' }}>Delete Rule</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
          Are you sure you want to delete the rule &ldquo;{ruleName}&rdquo;? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outlined" color="dark" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button color="danger" onClick={onConfirm} size="sm">
            Delete Rule
          </Button>
        </div>
      </div>
    </Modal>
  );
}

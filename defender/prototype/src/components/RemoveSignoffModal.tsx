import Modal from '@floqastinc/flow-ui_core/Modal';
import Button from '@floqastinc/flow-ui_core/Button';

export default function RemoveSignoffModal({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }} size="sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--flo-sem-color-text-default)' }}>Remove Sign Off</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
          Removing this sign off will also remove the completed date associated with it.
        </p>
        <div className="flex gap-3">
          <Button variant="outlined" color="dark" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button color="danger" onClick={onConfirm} size="sm">
            Remove Sign Off
          </Button>
        </div>
      </div>
    </Modal>
  );
}

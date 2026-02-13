import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Modal } from '../../../ui/Modal';

interface AddCategoryModalProps {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onConfirm: () => void;
}

export function AddCategoryModal({
  isOpen,
  name,
  onClose,
  onNameChange,
  onConfirm,
}: AddCategoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category" width="sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest opacity-60">
            Category Name
          </label>
          <Input
            placeholder="e.g. shipping_delay"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            autoFocus
            onKeyDown={(event) => event.key === 'Enter' && onConfirm()}
          />
          <p className="text-[10px] text-muted italic">
            Names are automatically lowercased and snake_cased.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={!name.trim()}>
            Create Category
          </Button>
        </div>
      </div>
    </Modal>
  );
}

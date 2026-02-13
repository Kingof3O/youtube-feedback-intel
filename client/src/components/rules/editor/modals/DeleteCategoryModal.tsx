import { AlertCircle } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Modal } from '../../../ui/Modal';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryModal({
  isOpen,
  categoryName,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" width="sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle size={32} />
          <div>
            <h4 className="font-bold">Are you sure?</h4>
            <p className="text-xs opacity-80 mt-0.5">
              Deleting category <b>{categoryName}</b> is irreversible.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Keep Category
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Forever
          </Button>
        </div>
      </div>
    </Modal>
  );
}

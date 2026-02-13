import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface SyncChannelModalProps {
  isOpen: boolean;
  channelId: string;
  isExistingChannel: boolean;
  syncDays: string;
  maxVideos: string;
  maxCommentsPerVideo: string;
  showAdvanced: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChannelIdChange: (value: string) => void;
  onSyncDaysChange: (value: string) => void;
  onMaxVideosChange: (value: string) => void;
  onMaxCommentsPerVideoChange: (value: string) => void;
  onToggleAdvanced: () => void;
}

export function SyncChannelModal({
  isOpen,
  channelId,
  isExistingChannel,
  syncDays,
  maxVideos,
  maxCommentsPerVideo,
  showAdvanced,
  isSubmitting,
  onClose,
  onSubmit,
  onChannelIdChange,
  onSyncDaysChange,
  onMaxVideosChange,
  onMaxCommentsPerVideoChange,
  onToggleAdvanced,
}: SyncChannelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={channelId ? 'Sync Channel' : 'Sync Existing Channel'}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Configure sync settings for this channel. Enter a longer date range
          (up to 3650 days) for deeper history sync.
        </p>

        <Input
          label="Channel ID"
          placeholder="e.g., UCP4bf6IHJJQehibu6ai__cg"
          value={channelId}
          onChange={(event) => onChannelIdChange(event.target.value)}
          disabled={!isOpen || isExistingChannel}
        />

        <Input
          label="Days to Look Back"
          type="number"
          value={syncDays}
          onChange={(event) => onSyncDaysChange(event.target.value)}
          min={1}
          max={3650}
          helperText="Max 10 years (3650 days). Increase for deeper history."
        />

        <div className="border-t border-border mt-2 pt-4">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mb-3"
            onClick={onToggleAdvanced}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="flex flex-col gap-4 fade-in">
              <Input
                label="Max Videos"
                type="number"
                value={maxVideos}
                onChange={(event) => onMaxVideosChange(event.target.value)}
                min={1}
                max={5000}
                helperText="Total videos to scan in the uploads playlist."
              />
              <Input
                label="Max Comments Per Video"
                type="number"
                value={maxCommentsPerVideo}
                onChange={(event) => onMaxCommentsPerVideoChange(event.target.value)}
                min={1}
                max={10000}
                helperText="Limit comments per video."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} isLoading={isSubmitting} disabled={!channelId}>
            Start Sync
          </Button>
        </div>
      </div>
    </Modal>
  );
}

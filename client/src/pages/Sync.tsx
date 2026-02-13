import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ChannelsTable } from '../components/sync/ChannelsTable';
import { SyncChannelModal } from '../components/sync/SyncChannelModal';
import { useChannels } from '../hooks/useChannels';
import { useSyncChannel } from '../hooks/useSyncChannel';

export function Sync() {
  const { data: channels = [], isLoading } = useChannels();
  const syncMutation = useSyncChannel();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newChannelId, setNewChannelId] = useState('');
  const [syncDays, setSyncDays] = useState('14');
  const [maxVideos, setMaxVideos] = useState('500');
  const [maxCommentsPerVideo, setMaxCommentsPerVideo] = useState('2000');

  const isExistingChannel = useMemo(
    () => channels.some((channel) => channel.id === newChannelId) && newChannelId !== '',
    [channels, newChannelId],
  );

  const openSyncModal = (channelId = '') => {
    setNewChannelId(channelId);
    setSyncDays('14');
    setMaxVideos('500');
    setMaxCommentsPerVideo('2000');
    setShowAdvanced(false);
    setIsAddModalOpen(true);
  };

  const triggerSync = () => {
    syncMutation.mutate(
      {
        channelId: newChannelId,
        days: Number(syncDays),
        maxVideos: showAdvanced ? Number(maxVideos) : undefined,
        maxCommentsPerVideo: showAdvanced ? Number(maxCommentsPerVideo) : undefined,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewChannelId('');
          setShowAdvanced(false);
        },
      },
    );
  };

  return (
    <div className="fade-in flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Channel Management</h2>
          <p className="text-sm text-muted">
            Manage tracked channels and trigger syncs.
          </p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => openSyncModal('')}>
          Add Channel
        </Button>
      </div>

      <div className="glass-panel">
        <ChannelsTable
          channels={channels}
          isLoading={isLoading}
          syncingChannelId={syncMutation.variables?.channelId}
          onSync={(channelId) => openSyncModal(channelId)}
        />
      </div>

      <SyncChannelModal
        isOpen={isAddModalOpen}
        channelId={newChannelId}
        isExistingChannel={isExistingChannel}
        syncDays={syncDays}
        maxVideos={maxVideos}
        maxCommentsPerVideo={maxCommentsPerVideo}
        showAdvanced={showAdvanced}
        isSubmitting={syncMutation.isPending}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={triggerSync}
        onChannelIdChange={setNewChannelId}
        onSyncDaysChange={setSyncDays}
        onMaxVideosChange={setMaxVideos}
        onMaxCommentsPerVideoChange={setMaxCommentsPerVideo}
        onToggleAdvanced={() => setShowAdvanced((current) => !current)}
      />
    </div>
  );
}

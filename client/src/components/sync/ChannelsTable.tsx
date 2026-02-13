import { ExternalLink, RefreshCw } from 'lucide-react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Channel } from '../../lib/api/types';

interface ChannelsTableProps {
  channels: Channel[];
  isLoading: boolean;
  syncingChannelId?: string;
  onSync: (channelId: string) => void;
}

export function ChannelsTable({
  channels,
  isLoading,
  syncingChannelId,
  onSync,
}: ChannelsTableProps) {
  const columns = [
    {
      key: 'title',
      header: 'Channel',
      render: (channel: Channel) => (
        <div className="flex items-center gap-3">
          <img
            src={channel.thumbnail_url}
            alt={channel.title}
            className="w-8 h-8 rounded-full object-cover"
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{channel.title}</span>
            <span className="text-sm text-muted">{channel.custom_url}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stats',
      header: 'Stats',
      render: (channel: Channel) => (
        <div className="flex gap-2 text-sm text-muted">
          <span>{Number(channel.subscriber_count).toLocaleString()} subs</span>
          <span>•</span>
          <span>{Number(channel.video_count).toLocaleString()} videos</span>
        </div>
      ),
    },
    {
      key: 'last_synced_at',
      header: 'Last Sync',
      render: (channel: Channel) =>
        channel.last_synced_at ? (
          <span className="text-sm text-muted">
            {new Date(channel.last_synced_at).toLocaleDateString()}{' '}
            {new Date(channel.last_synced_at).toLocaleTimeString()}
          </span>
        ) : (
          <Badge variant="warning">Never</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (channel: Channel) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSync(channel.id)}
            isLoading={syncingChannelId === channel.id}
            leftIcon={<RefreshCw size={14} />}
          >
            Sync
          </Button>
          <a
            href={`https://youtube.com/channel/${channel.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-ghost"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={channels}
      columns={columns}
      keyExtractor={(channel) => channel.id}
      isLoading={isLoading}
      emptyMessage="No channels tracked yet. Add one to get started."
    />
  );
}

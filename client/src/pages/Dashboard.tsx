import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Radio,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Users,
  Video,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '../components/StatsCard';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { fetchFeedbackPage } from '../lib/api/feedback.api';
import type { FeedbackItem } from '../lib/api/types';

export function Dashboard() {
  const { data, isLoading } = useDashboardStats();
  const { data: recentFeedback = [], isLoading: feedbackLoading } = useQuery({
    queryKey: ['dashboard-recent-feedback'],
    queryFn: async () => {
      const page = await fetchFeedbackPage({
        mode: 'classified',
        limit: 6,
        offset: 0,
      });
      return page.items;
    },
  });

  const categorySummary = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of recentFeedback) {
      for (const label of item.labels) {
        counts.set(label.category, (counts.get(label.category) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [recentFeedback]);

  if (isLoading) return <div className="text-muted fade-in">Loading stats...</div>;

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <span className="text-sm text-muted">Last updated: Just now</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatsCard label="Tracked Channels" value={data?.channels || 0} icon={<Users size={24} />} />
        <StatsCard label="Synced Videos" value={data?.videos || 0} icon={<Video size={24} />} />
        <StatsCard
          label="Total Comments"
          value={data?.comments.toLocaleString() || 0}
          icon={<MessageSquare size={24} />}
        />
        <StatsCard
          label="Feedback Items"
          value={data?.feedback.toLocaleString() || 0}
          icon={<ShieldAlert size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <DashboardLink
              to="/sync"
              icon={<Radio size={16} />}
              title="Sync Channel Data"
              subtitle="Fetch latest videos and comments"
            />
            <DashboardLink
              to="/explorer"
              icon={<Search size={16} />}
              title="Explore Feedback"
              subtitle="Filter comments by category, text, and likes"
            />
            <DashboardLink
              to="/rules"
              icon={<SlidersHorizontal size={16} />}
              title="Tune Rules"
              subtitle="Adjust scoring and keyword coverage"
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium mb-4">Category Snapshot</h3>
          {categorySummary.length === 0 ? (
            <div className="text-muted text-sm">
              No classified data yet. Run a sync and classification first.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {categorySummary.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm text-muted">{count} matches</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Feedback</h3>
          <Link to="/explorer" className="text-sm text-accent-primary flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {feedbackLoading ? (
          <div className="text-muted text-sm">Loading recent feedback...</div>
        ) : recentFeedback.length === 0 ? (
          <div className="text-muted text-sm">No recent activity to display.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentFeedback.map((item) => (
              <RecentFeedbackRow key={item.commentId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardLink({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between border border-white/10 rounded-lg p-3 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-accent-primary">{icon}</div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted">{subtitle}</div>
        </div>
      </div>
      <ArrowRight size={14} className="text-muted" />
    </Link>
  );
}

function RecentFeedbackRow({ item }: { item: FeedbackItem }) {
  return (
    <div className="border border-white/10 rounded-lg p-3 hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium truncate">{item.author}</div>
        <div className="text-xs text-muted">{new Date(item.date).toLocaleDateString()}</div>
      </div>
      <div className="text-xs text-muted mb-2 truncate">{item.videoTitle}</div>
      <p className="text-sm text-white/90 line-clamp-2">
        {item.text.length > 180 ? `${item.text.slice(0, 180)}...` : item.text}
      </p>
      <div className="mt-2 text-xs text-muted">
        {item.labels.slice(0, 2).map((label) => label.category).join(', ')}
      </div>
    </div>
  );
}

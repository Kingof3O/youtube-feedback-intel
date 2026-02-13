import { Calendar, ThumbsUp } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { FeedbackItem } from '../../lib/api/types';

function getBadgeVariant(
  category: string,
): 'default' | 'error' | 'warning' | 'info' | 'success' | 'accent' {
  switch (category) {
    case 'bug':
      return 'error';
    case 'performance':
      return 'warning';
    case 'ui_ux':
      return 'info';
    case 'feature_request':
      return 'success';
    case 'integration':
      return 'accent';
    case 'development':
      return 'info';
    default:
      return 'default';
  }
}

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <div className="glass-panel p-4 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          {item.labels.length > 0 ? (
            item.labels.map((label, index) => (
              <Badge key={`${label.category}-${index}`} variant={getBadgeVariant(label.category)}>
                {label.category}
              </Badge>
            ))
          ) : (
            <Badge variant="default" className="opacity-50">
              Raw
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} /> {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-white/90 mb-3 whitespace-pre-wrap">{item.text}</p>

      <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2">
        <div className="text-xs text-muted flex items-center gap-2">
          <span className="font-medium text-white/50">{item.author}</span>
          on
          <a
            href={`https://youtu.be/${item.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-primary truncate max-w-[200px]"
          >
            {item.videoTitle}
          </a>
        </div>
        {item.labels.length > 0 && (
          <div className="text-xs text-muted" title={item.labels[0].keywords.join(', ')}>
            Matched: {item.labels[0].keywords.slice(0, 3).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

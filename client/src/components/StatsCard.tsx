

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="glass-panel p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between text-muted">
        <span className="text-sm font-medium opacity-70">{label}</span>
        <div className="text-accent-primary p-2 bg-accent-glass rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {trend && (
        <div className="text-sm text-green-400 mt-1">
          {trend}
        </div>
      )}
    </div>
  );
}

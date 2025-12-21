import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'accent';
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
    glow: 'shadow-primary/10',
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    glow: 'shadow-success/10',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    glow: 'shadow-warning/10',
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    text: 'text-accent',
    glow: 'shadow-accent/10',
  },
};

export function StatsCard({ title, value, total, icon: Icon, color, delay = 0 }: StatsCardProps) {
  const classes = colorClasses[color];
  const percentage = total ? Math.round((value / total) * 100) : null;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] animate-slide-up",
        classes.bg, classes.border, classes.glow
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className={cn("text-3xl font-bold font-mono", classes.text)}>
              {value}
            </span>
            {total && (
              <span className="text-sm text-muted-foreground">/ {total}</span>
            )}
          </div>
          {percentage !== null && (
            <div className="mt-2 w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", 
                  color === 'primary' && "bg-primary",
                  color === 'success' && "bg-success",
                  color === 'warning' && "bg-warning",
                  color === 'accent' && "bg-accent"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", classes.bg)}>
          <Icon className={cn("w-5 h-5", classes.text)} />
        </div>
      </div>
    </div>
  );
}

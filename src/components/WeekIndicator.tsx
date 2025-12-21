import { Badge } from '@/components/ui/badge';
import { executionOrder } from '@/data/executionOrder';
import { Problem } from '@/data/problems';
import { Target, TrendingUp } from 'lucide-react';

interface WeekIndicatorProps {
  problems: Problem[];
}

export function WeekIndicator({ problems }: WeekIndicatorProps) {
  const parseRange = (rangeStr: string): string[] => {
    if (rangeStr === "—" || !rangeStr.includes("P")) return [];
    const match = rangeStr.match(/P(\d+)[–-]P(\d+)/);
    if (!match) return [];
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    return Array.from({ length: end - start + 1 }, (_, i) => `P${start + i}`);
  };

  const getCurrentWeek = () => {
    for (let i = 0; i < executionOrder.length; i++) {
      const week = executionOrder[i];
      const range = parseRange(week.problemIds);
      if (range.length === 0) continue;
      
      const weekProblems = problems.filter(p => range.includes(p.id));
      const allSolved = weekProblems.every(p => p.solved);
      if (!allSolved) return executionOrder[i];
    }
    return executionOrder[executionOrder.length - 1];
  };

  const currentWeek = getCurrentWeek();
  const range = parseRange(currentWeek.problemIds);
  const weekProblems = problems.filter(p => range.includes(p.id));
  const solved = weekProblems.filter(p => p.solved).length;
  const percent = weekProblems.length > 0 ? Math.round((solved / weekProblems.length) * 100) : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Week {currentWeek.week}</span>
      </div>
      <Badge variant="secondary" className="text-xs">
        {currentWeek.focus}
      </Badge>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <TrendingUp className="w-3 h-3" />
        <span>{percent}% complete</span>
      </div>
    </div>
  );
}

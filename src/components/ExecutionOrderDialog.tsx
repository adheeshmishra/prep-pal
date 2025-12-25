import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Target, CheckCircle2, Lightbulb } from 'lucide-react';
import { executionOrder, workbookTips } from '@/data/executionOrder';
import { Problem } from '@/data/problems';
import { cn } from '@/lib/utils';

interface ExecutionOrderDialogProps {
  problems: Problem[];
}

export function ExecutionOrderDialog({ problems }: ExecutionOrderDialogProps) {
  const getCurrentWeek = () => {
    // Find the week based on progress
    for (let i = 0; i < executionOrder.length; i++) {
      const week = executionOrder[i];
      const range = parseRange(week.problemIds);
      if (range.length === 0) continue;
      
      const weekProblems = problems.filter(p => range.includes(p.id));
      const allSolved = weekProblems.every(p => p.solved);
      if (!allSolved) return i + 1;
    }
    return executionOrder.length;
  };

  const parseRange = (rangeStr: string): string[] => {
    if (rangeStr === "—" || !rangeStr.includes("P")) return [];
    const match = rangeStr.match(/P(\d+)[–-]P(\d+)/);
    if (!match) return [];
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
  };

  const getWeekProgress = (week: typeof executionOrder[0]) => {
    const range = parseRange(week.problemIds);
    if (range.length === 0) return { solved: 0, total: week.problemCount, percent: 0 };
    
    const weekProblems = problems.filter(p => range.includes(p.id));
    const solved = weekProblems.filter(p => p.solved).length;
    const total = weekProblems.length || week.problemCount;
    return { solved, total, percent: total > 0 ? Math.round((solved / total) * 100) : 0 };
  };

  const currentWeek = getCurrentWeek();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">16-Week Plan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            16-Week Execution Order
          </DialogTitle>
        </DialogHeader>

        {/* Tips Section */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Lightbulb className="w-4 h-4" />
            Pro Tips
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {workbookTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-2">
            {executionOrder.map((week) => {
              const progress = getWeekProgress(week);
              const isCurrentWeek = week.week === currentWeek;
              const isCompleted = progress.percent === 100 && progress.total > 0;

              return (
                <div
                  key={week.week}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isCurrentWeek && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    isCompleted && "border-success/30 bg-success/5",
                    !isCurrentWeek && !isCompleted && "border-border bg-secondary/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={isCurrentWeek ? "default" : "secondary"}
                        className={cn(
                          "font-mono text-xs px-2",
                          isCompleted && "bg-success text-success-foreground"
                        )}
                      >
                        Week {week.week}
                      </Badge>
                      <span className="font-medium text-foreground">{week.focus}</span>
                      {isCurrentWeek && (
                        <Badge variant="outline" className="text-[10px] border-primary text-primary">
                          <Target className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    {progress.total > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {progress.solved}/{progress.total} solved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Patterns:</span>
                      <p className="text-foreground mt-0.5">{week.patterns}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Problems:</span>
                      <p className="text-foreground mt-0.5 font-mono">{week.problemIds}</p>
                      <p className="text-muted-foreground/70 mt-0.5">{week.problemCount} problems</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="text-foreground mt-0.5 font-mono">{week.hoursEstimate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Re-solve:</span>
                      <p className="text-foreground mt-0.5 font-mono">{week.resolveIds}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Outcome:</span>
                      <p className="text-foreground mt-0.5">{week.outcome}</p>
                    </div>
                  </div>

                  {progress.total > 0 && (
                    <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          isCompleted ? "bg-success" : "bg-primary"
                        )}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

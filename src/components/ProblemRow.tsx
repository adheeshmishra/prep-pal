import { Problem } from '@/data/problems';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface ProblemRowProps {
  problem: Problem;
  onUpdate: (id: string, updates: Partial<Problem>) => void;
  index: number;
}

const topicColors: Record<string, string> = {
  Arrays: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Strings: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Recursion: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Binary Search': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Greedy: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Trees: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  Graphs: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  DP: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  Design: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export function ProblemRow({ problem, onUpdate, index }: ProblemRowProps) {
  const [showNotes, setShowNotes] = useState(false);
  const lcNumber = problem.lc.replace('LC ', '').replace('Classic', '');
  const lcUrl = lcNumber && lcNumber !== 'Classic' 
    ? `https://leetcode.com/problems/${problem.problem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
    : null;

  const completionStatus = 
    problem.solved && problem.resolved && problem.explained ? 'complete' :
    problem.solved ? 'partial' : 'none';

  return (
    <div 
      className={cn(
        "group grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-secondary/50 border border-transparent",
        completionStatus === 'complete' && "bg-success/5 border-success/20",
        completionStatus === 'partial' && "bg-warning/5 border-warning/20",
      )}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* ID & Problem Name */}
      <span className="font-mono text-xs text-muted-foreground w-10">{problem.id}</span>
      
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">{problem.problem}</span>
          {lcUrl && (
            <a
              href={lcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", topicColors[problem.topic])}>
            {problem.topic}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/50 text-muted-foreground border-border">
            {problem.pattern}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{problem.skill}</span>
        </div>

        {/* Notes Input */}
        {showNotes && (
          <Input
            value={problem.notes}
            onChange={(e) => onUpdate(problem.id, { notes: e.target.value })}
            placeholder="Add notes..."
            className="mt-2 h-7 text-xs bg-background/50"
          />
        )}
      </div>

      {/* LeetCode Link */}
      <Badge variant="secondary" className="font-mono text-[10px] px-2 py-0.5 bg-muted/50">
        {problem.lc}
      </Badge>

      {/* Checkboxes */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <Checkbox
              checked={problem.solved}
              onCheckedChange={(checked) => onUpdate(problem.id, { solved: !!checked })}
              className={cn(
                "border-muted-foreground/50 data-[state=checked]:bg-success data-[state=checked]:border-success",
                "transition-all duration-200"
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground">
          <p>Solved</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <Checkbox
              checked={problem.resolved}
              onCheckedChange={(checked) => onUpdate(problem.id, { resolved: !!checked })}
              className={cn(
                "border-muted-foreground/50 data-[state=checked]:bg-warning data-[state=checked]:border-warning",
                "transition-all duration-200"
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground">
          <p>Re-solved</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <Checkbox
              checked={problem.explained}
              onCheckedChange={(checked) => onUpdate(problem.id, { explained: !!checked })}
              className={cn(
                "border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                "transition-all duration-200"
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground">
          <p>Explained w/o Code</p>
        </TooltipContent>
      </Tooltip>

      <button
        onClick={() => setShowNotes(!showNotes)}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          showNotes ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        )}
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

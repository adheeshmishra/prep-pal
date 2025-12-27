import { Problem } from '@/data/problems';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MessageSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { NotesDialog } from './NotesDialog';
import { TimeTracker } from './TimeTracker';

interface ProblemRowProps {
  problem: Problem;
  onUpdate: (id: string, updates: Partial<Problem>) => void;
  onTimeUpdate: (problemId: string, duration: number) => void;
  index: number;
}

const topicColors: Record<string, string> = {
  'Arrays & Strings': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Stacks & Queues': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Recursion & Backtracking': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Binary Search': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Greedy + Heaps': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Trees: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  Trie: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Union Find': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Graphs: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Dynamic Programming': 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  Design: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Mathematical: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'String Algorithms': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const difficultyColors: Record<string, string> = {
  Easy: 'bg-success/20 text-success border-success/30',
  Medium: 'bg-warning/20 text-warning border-warning/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function ProblemRow({ problem, onUpdate, onTimeUpdate, index }: ProblemRowProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const lcUrl = `https://leetcode.com/problems/${problem.problem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`;
  const hasNotes = problem.notes && problem.notes.trim().length > 0;

  const completionStatus = 
    problem.solved && problem.resolved && problem.explained ? 'complete' :
    problem.solved ? 'partial' : 'none';

  return (
    <div 
      className={cn(
        "group grid grid-cols-[40px_1fr_60px_36px_36px_36px_36px_80px] md:grid-cols-[50px_1fr_80px_50px_50px_50px_36px_100px] gap-2 md:gap-3 items-center px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200",
        "hover:bg-secondary/50 border border-transparent",
        completionStatus === 'complete' && "bg-success/5 border-success/20",
        completionStatus === 'partial' && "bg-warning/5 border-warning/20",
      )}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* ID */}
      <span className="font-mono text-xs text-muted-foreground">#{problem.id}</span>
      
      {/* Problem Name & Details */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">{problem.problem}</span>
          <a
            href={lcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", topicColors[problem.topic])}>
            {problem.topic}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/50 text-muted-foreground border-border">
            {problem.pattern}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", difficultyColors[problem.difficulty])}>
            {problem.difficulty}
          </Badge>
          {hasNotes && (
            <span className="text-[10px] text-primary flex items-center gap-0.5">
              <FileText className="w-3 h-3" />
              notes
            </span>
          )}
        </div>
      </div>

      {/* Week */}
      <Badge variant="secondary" className="font-mono text-[10px] px-2 py-0.5 bg-muted/50 justify-center">
        W{problem.week}
      </Badge>

      {/* Checkboxes - centered properly */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center w-full">
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
          <div className="flex items-center justify-center w-full">
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
          <div className="flex items-center justify-center w-full">
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

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setNotesOpen(true)}
            className={cn(
              "p-1.5 rounded-md transition-colors flex items-center justify-center",
              hasNotes ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground">
          <p>{hasNotes ? 'View/Edit Notes' : 'Add Notes'}</p>
        </TooltipContent>
      </Tooltip>

      {/* Time Tracker */}
      <TimeTracker
        problemId={problem.id}
        totalTime={problem.totalTime || 0}
        onTimeUpdate={onTimeUpdate}
      />

      <NotesDialog
        problem={problem}
        open={notesOpen}
        onOpenChange={setNotesOpen}
        onSave={(notes) => onUpdate(problem.id, { notes })}
      />
    </div>
  );
}

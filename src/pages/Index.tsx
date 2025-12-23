import { useState, useMemo, useEffect } from 'react';
import { useProblems } from '@/hooks/useProblems';
import { ProblemRow } from '@/components/ProblemRow';
import { StatsCard } from '@/components/StatsCard';
import { FilterBar, Filters } from '@/components/FilterBar';
import { AddProblemDialog } from '@/components/AddProblemDialog';
import { ExecutionOrderDialog } from '@/components/ExecutionOrderDialog';
import { WeekIndicator } from '@/components/WeekIndicator';
import { ProgressExport } from '@/components/ProgressExport';
import { CheckCircle2, RotateCcw, Lightbulb, Target, Code2, Keyboard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Index = () => {
  const { problems, updateProblem, addProblem, resetProgress } = useProblems();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    topic: 'all',
    pattern: 'all',
    status: 'all',
    difficulty: 'all',
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search problems..."]') as HTMLInputElement;
        searchInput?.focus();
      }
      // Escape to clear filters
      if (e.key === 'Escape') {
        setFilters({ search: '', topic: 'all', pattern: 'all', status: 'all', difficulty: 'all' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const solved = problems.filter(p => p.solved).length;
    const resolved = problems.filter(p => p.resolved).length;
    const explained = problems.filter(p => p.explained).length;
    const mastered = problems.filter(p => p.solved && p.resolved && p.explained).length;
    return { solved, resolved, explained, mastered, total: problems.length };
  }, [problems]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = !filters.search || 
        p.problem.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesTopic = filters.topic === 'all' || p.topic === filters.topic;
      const matchesPattern = filters.pattern === 'all' || p.pattern === filters.pattern;
      const matchesDifficulty = filters.difficulty === 'all' || p.difficulty === filters.difficulty;
      
      let matchesStatus = true;
      if (filters.status === 'complete') {
        matchesStatus = p.solved && p.resolved && p.explained;
      } else if (filters.status === 'partial') {
        matchesStatus = p.solved && !(p.resolved && p.explained);
      } else if (filters.status === 'none') {
        matchesStatus = !p.solved;
      }

      return matchesSearch && matchesTopic && matchesPattern && matchesStatus && matchesDifficulty;
    });
  }, [problems, filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary glow-primary">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">DSA Tracker</h1>
                <p className="text-xs text-muted-foreground">FAANG Interview Prep</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 text-[10px] text-muted-foreground">
                    <Keyboard className="w-3 h-3" />
                    <span>⌘K search</span>
                    <span className="mx-1">•</span>
                    <span>Esc clear</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Keyboard shortcuts</p>
                </TooltipContent>
              </Tooltip>
              <ExecutionOrderDialog problems={problems} />
              <ProgressExport problems={problems} onReset={resetProgress} />
              <AddProblemDialog onAdd={addProblem} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Week Indicator */}
        <WeekIndicator problems={problems} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Solved"
            value={stats.solved}
            total={stats.total}
            icon={CheckCircle2}
            color="success"
            delay={0}
          />
          <StatsCard
            title="Re-solved"
            value={stats.resolved}
            total={stats.total}
            icon={RotateCcw}
            color="warning"
            delay={100}
          />
          <StatsCard
            title="Explained"
            value={stats.explained}
            total={stats.total}
            icon={Lightbulb}
            color="primary"
            delay={200}
          />
          <StatsCard
            title="Mastered"
            value={stats.mastered}
            total={stats.total}
            icon={Target}
            color="accent"
            delay={300}
          />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Problems List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Table Header - aligned with row grid */}
          <div className="grid grid-cols-[50px_1fr_80px_50px_50px_50px_36px] gap-3 items-center px-4 py-3 bg-secondary/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>ID</span>
            <span>Problem</span>
            <span className="text-center">Week</span>
            <span className="text-center">Solved</span>
            <span className="text-center">Re-solve</span>
            <span className="text-center">Explain</span>
            <span></span>
          </div>

          {/* Problems */}
          <ScrollArea className="h-[calc(100vh-440px)] min-h-[400px]">
            <div className="divide-y divide-border/50">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    onUpdate={updateProblem}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Target className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No problems found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-4 py-3 bg-secondary/30 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProblems.length}</span> of{' '}
              <span className="font-medium text-foreground">{problems.length}</span> problems
            </p>
            <p className="text-xs text-muted-foreground">
              Mastery: <span className="font-medium text-foreground">{Math.round((stats.mastered / stats.total) * 100)}%</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

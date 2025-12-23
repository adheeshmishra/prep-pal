import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { Problem } from '@/data/problems';
import { toast } from 'sonner';

interface ProgressExportProps {
  problems: Problem[];
  onReset: () => void;
}

export function ProgressExport({ problems, onReset }: ProgressExportProps) {
  const exportAsJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats: {
        total: problems.length,
        solved: problems.filter(p => p.solved).length,
        resolved: problems.filter(p => p.resolved).length,
        explained: problems.filter(p => p.explained).length,
        mastered: problems.filter(p => p.solved && p.resolved && p.explained).length,
      },
      problems: problems.map(p => ({
        id: p.id,
        problem: p.problem,
        topic: p.topic,
        pattern: p.pattern,
        week: p.week,
        difficulty: p.difficulty,
        solved: p.solved,
        resolved: p.resolved,
        explained: p.explained,
        notes: p.notes,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Progress exported as JSON');
  };

  const exportAsCSV = () => {
    const headers = ['ID', 'Problem', 'Topic', 'Pattern', 'Week', 'Difficulty', 'Solved', 'Re-solved', 'Explained', 'Notes'];
    const rows = problems.map(p => [
      p.id,
      `"${p.problem}"`,
      p.topic,
      p.pattern,
      p.week,
      p.difficulty,
      p.solved ? 'Yes' : 'No',
      p.resolved ? 'Yes' : 'No',
      p.explained ? 'Yes' : 'No',
      `"${p.notes.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-progress-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Progress exported as CSV');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onReset();
      toast.success('Progress reset successfully');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border-border">
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2 cursor-pointer">
          <FileJson className="w-4 h-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReset} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <RotateCcw className="w-4 h-4" />
          Reset All Progress
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

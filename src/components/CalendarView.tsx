import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Problem } from '@/data/problems';

interface CalendarViewProps {
  problems: Problem[];
}

export const CalendarView = ({ problems }: CalendarViewProps) => {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Distribute problems across days (roughly 3-4 problems per day for 20hrs/week)
  const problemsByDate = useMemo(() => {
    const map = new Map<string, Problem[]>();
    const unsolvedProblems = problems.filter(p => !p.solved);
    const problemsPerDay = Math.ceil(unsolvedProblems.length / 112); // 16 weeks * 7 days
    
    let dayIndex = 0;
    unsolvedProblems.forEach((problem, i) => {
      const date = addDays(new Date(), dayIndex);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(problem);
      
      if ((i + 1) % Math.max(3, problemsPerDay) === 0) dayIndex++;
    });
    
    return map;
  }, [problems]);

  const getProblemsForDate = (date: Date) => {
    return problemsByDate.get(format(date, 'yyyy-MM-dd')) || [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Daily Study Plan</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addDays(d, -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addDays(d, 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          {/* Week View */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => {
              const dayProblems = getProblemsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors min-h-[100px] ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border'
                  } ${isSelected ? 'ring-2 ring-primary' : ''} hover:bg-muted/50`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center mb-2">
                    <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
                    <div className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {dayProblems.slice(0, 3).map(p => (
                      <div key={p.id} className="text-xs truncate text-muted-foreground">
                        {p.problem}
                      </div>
                    ))}
                    {dayProblems.length > 3 && (
                      <div className="text-xs text-primary">+{dayProblems.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Day Details */}
          {selectedDate && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{format(selectedDate, 'EEEE, MMMM d')}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {getProblemsForDate(selectedDate).length === 0 ? (
                    <p className="text-muted-foreground text-sm">No problems scheduled</p>
                  ) : (
                    getProblemsForDate(selectedDate).map(problem => (
                      <div key={problem.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{problem.problem}</div>
                          <div className="text-xs text-muted-foreground">{problem.topic} • {problem.pattern}</div>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

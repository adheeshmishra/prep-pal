import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeTrackerProps {
  problemId: string;
  totalTime: number;
  onTimeUpdate: (problemId: string, duration: number) => void;
}

export const TimeTracker = ({ problemId, totalTime, onTimeUpdate }: TimeTrackerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (seconds > 0) {
      onTimeUpdate(problemId, Math.round(seconds / 60));
    }
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {totalTime > 0 && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="hidden sm:inline">{formatMinutes(totalTime)}</span>
        </span>
      )}
      
      {isRunning || seconds > 0 ? (
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-primary min-w-[45px]">
            {formatTime(seconds)}
          </span>
          {isRunning ? (
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handlePause}>
              <Pause className="h-3 w-3" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleStart}>
              <Play className="h-3 w-3" />
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={handleStop}>
            <Square className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleStart} title="Start timer">
          <Play className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

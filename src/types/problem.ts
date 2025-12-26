export interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  date: string;
}

export interface Problem {
  id: string;
  week: number;
  topic: string;
  pattern: string;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  resolved: boolean;
  explained: boolean;
  notes: string;
  timeEntries?: TimeEntry[];
  totalTime?: number;
  scheduledDate?: string;
}

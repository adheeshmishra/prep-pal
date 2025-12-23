import { topics, patterns, topicPatternMap } from '@/data/problems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { useMemo } from 'react';

export interface Filters {
  search: string;
  topic: string;
  pattern: string;
  status: string;
  difficulty: string;
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  filteredCount?: number;
  totalCount?: number;
}

export function FilterBar({ filters, onFiltersChange, filteredCount, totalCount }: FilterBarProps) {
  const hasActiveFilters = filters.search || filters.topic !== 'all' || filters.pattern !== 'all' || filters.status !== 'all' || filters.difficulty !== 'all';
  const showCount = filteredCount !== undefined && totalCount !== undefined;

  // Get relevant patterns based on selected topic
  const relevantPatterns = useMemo(() => {
    if (filters.topic === 'all') {
      return patterns;
    }
    return topicPatternMap[filters.topic] || [];
  }, [filters.topic]);

  const clearFilters = () => {
    onFiltersChange({ search: '', topic: 'all', pattern: 'all', status: 'all', difficulty: 'all' });
  };

  const handleTopicChange = (value: string) => {
    // Reset pattern when topic changes if current pattern is not in new topic
    const newPatterns = value === 'all' ? patterns : (topicPatternMap[value] || []);
    const shouldResetPattern = filters.pattern !== 'all' && !newPatterns.includes(filters.pattern);
    
    onFiltersChange({ 
      ...filters, 
      topic: value,
      pattern: shouldResetPattern ? 'all' : filters.pattern 
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        {showCount && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">{filteredCount}</span>
            <span className="text-xs text-muted-foreground">/ {totalCount}</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search problems..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 bg-background/50 border-border/50 focus:border-primary"
        />
      </div>

      {/* Topic Filter */}
      <Select
        value={filters.topic}
        onValueChange={handleTopicChange}
      >
        <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all">All Topics</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Pattern Filter */}
      <Select
        value={filters.pattern}
        onValueChange={(value) => onFiltersChange({ ...filters, pattern: value })}
      >
        <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
          <SelectValue placeholder="Pattern" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border max-h-[300px]">
          <SelectItem value="all">All Patterns</SelectItem>
          {relevantPatterns.map((pattern) => (
            <SelectItem key={pattern} value={pattern}>
              {pattern}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Filter */}
      <Select
        value={filters.difficulty}
        onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}
      >
        <SelectTrigger className="w-[130px] bg-background/50 border-border/50">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="complete">Mastered</SelectItem>
          <SelectItem value="partial">In Progress</SelectItem>
          <SelectItem value="none">Not Started</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}

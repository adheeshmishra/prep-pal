import { topics, patterns } from '@/data/problems';
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
import { cn } from '@/lib/utils';

export interface Filters {
  search: string;
  topic: string;
  pattern: string;
  status: string;
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const hasActiveFilters = filters.search || filters.topic !== 'all' || filters.pattern !== 'all' || filters.status !== 'all';

  const clearFilters = () => {
    onFiltersChange({ search: '', topic: 'all', pattern: 'all', status: 'all' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
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
        onValueChange={(value) => onFiltersChange({ ...filters, topic: value })}
      >
        <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
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
        <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
          <SelectValue placeholder="Pattern" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border max-h-[300px]">
          <SelectItem value="all">All Patterns</SelectItem>
          {patterns.map((pattern) => (
            <SelectItem key={pattern} value={pattern}>
              {pattern}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
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

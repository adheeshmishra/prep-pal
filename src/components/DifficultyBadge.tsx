import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  pattern: string;
  skill: string;
}

// Infer difficulty from pattern and skill keywords
const getDifficulty = (pattern: string, skill: string): 'Easy' | 'Medium' | 'Hard' => {
  const hardPatterns = ['Bitmask', 'Interval DP', 'Advanced', 'Tree DP', 'Optimization', 'Trie'];
  const hardSkills = ['Hard', 'Split interval', 'Subset DP', 'Assignment', 'DAG DP', 'Minimax'];
  
  const easyPatterns = ['Traversal', 'Classic', 'Two pointers', 'Parsing'];
  const easySkills = ['Ordering', 'Height', 'Boundary', 'Mirror', 'Basic'];
  
  const patternLower = pattern.toLowerCase();
  const skillLower = skill.toLowerCase();
  
  if (hardPatterns.some(p => pattern.includes(p)) || hardSkills.some(s => skill.includes(s))) {
    return 'Hard';
  }
  if (easyPatterns.some(p => pattern.includes(p)) || easySkills.some(s => skillLower.includes(s.toLowerCase()))) {
    return 'Easy';
  }
  return 'Medium';
};

const difficultyStyles = {
  Easy: 'bg-success/20 text-success border-success/30',
  Medium: 'bg-warning/20 text-warning border-warning/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function DifficultyBadge({ pattern, skill }: DifficultyBadgeProps) {
  const difficulty = getDifficulty(pattern, skill);
  
  return (
    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", difficultyStyles[difficulty])}>
      {difficulty}
    </Badge>
  );
}

import { useState } from 'react';
import { Problem, topics, topicPatternMap } from '@/data/problems';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddProblemDialogProps {
  onAdd: (problem: Omit<Problem, 'id'>) => void;
}

export function AddProblemDialog({ onAdd }: AddProblemDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    problem: '',
    topic: '',
    pattern: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    week: 1,
  });

  const relevantPatterns = formData.topic ? (topicPatternMap[formData.topic] || []) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.problem || !formData.topic || !formData.pattern) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAdd({
      ...formData,
      solved: false,
      resolved: false,
      explained: false,
      notes: '',
    });

    setFormData({ problem: '', topic: '', pattern: '', difficulty: 'Medium', week: 1 });
    setOpen(false);
    toast.success('Problem added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground font-medium shadow-lg glow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Add New Problem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="problem" className="text-sm text-foreground">Problem Name *</Label>
            <Input
              id="problem"
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="e.g., Two Sum"
              className="bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Topic *</Label>
              <Select
                value={formData.topic}
                onValueChange={(value) => setFormData({ ...formData, topic: value, pattern: '' })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Pattern *</Label>
              <Select
                value={formData.pattern}
                onValueChange={(value) => setFormData({ ...formData, pattern: value })}
                disabled={!formData.topic}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[200px]">
                  {relevantPatterns.map((pattern) => (
                    <SelectItem key={pattern} value={pattern}>
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as 'Easy' | 'Medium' | 'Hard' })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="week" className="text-sm text-foreground">Week</Label>
              <Input
                id="week"
                type="number"
                min={1}
                value={formData.week}
                onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Add Problem
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

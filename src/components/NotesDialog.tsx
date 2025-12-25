import { useState, useEffect } from 'react';
import { Problem } from '@/data/problems';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Save, X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { NotesPreview } from './SyntaxHighlighter';

interface NotesDialogProps {
  problem: Problem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notes: string) => void;
}

export function NotesDialog({ problem, open, onOpenChange, onSave }: NotesDialogProps) {
  const [notes, setNotes] = useState(problem.notes || '');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setNotes(problem.notes || '');
    }
  }, [open, problem.notes]);

  const handleSave = () => {
    onSave(notes);
    toast.success('Notes saved');
    onOpenChange(false);
  };

  const insertCodeBlock = () => {
    const codeTemplate = '\n```java\n// Your code here\n\n```\n';
    setNotes(prev => prev + codeTemplate);
  };

  const copyNotes = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Notes copied to clipboard');
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Notes for: {problem.problem}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2 border-b border-border flex items-center justify-between bg-muted/30">
            <TabsList className="bg-background/50">
              <TabsTrigger value="edit" className="gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={insertCodeBlock}
                className="h-8 text-xs gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                Add Code Block
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyNotes}
                className="h-8 text-xs gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
            </div>
          </div>

          <TabsContent value="edit" className="flex-1 m-0 overflow-hidden">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here...

Tips:
• Use ```java to start a code block
• End code blocks with ```
• Your notes are saved per problem

Example:
```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (seen.containsKey(diff)) {
            return new int[]{seen.get(diff), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

Approach:
- Use a hashmap to store seen values
- Time: O(n), Space: O(n)"
              className={cn(
                "h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "font-mono text-sm leading-relaxed p-4",
                "bg-background"
              )}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0 overflow-auto p-4 bg-background">
            <NotesPreview text={notes} />
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {notes.length} characters • Supports code blocks with ```language
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-1.5">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-1.5">
              <Save className="w-4 h-4" />
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Save, X, Copy, Check, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const UNIVERSAL_NOTES_KEY = 'dsa-tracker-universal-notes';

export function UniversalNotesDialog() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(UNIVERSAL_NOTES_KEY);
    if (stored) {
      setNotes(stored);
    }
  }, []);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(UNIVERSAL_NOTES_KEY);
      setNotes(stored || '');
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem(UNIVERSAL_NOTES_KEY, notes);
    toast.success('Universal notes saved');
    setOpen(false);
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

  const renderPreview = (text: string) => {
    if (!text.trim()) {
      return <p className="text-muted-foreground italic">No notes yet. Start writing!</p>;
    }

    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim() || 'code';
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-border">
            <div className="bg-muted/80 px-3 py-1.5 text-xs font-mono text-muted-foreground flex items-center justify-between">
              <span>{language}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={async () => {
                  await navigator.clipboard.writeText(code);
                  toast.success('Code copied');
                }}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="bg-background/50 p-3 overflow-x-auto">
              <code className="text-sm font-mono text-foreground whitespace-pre">{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <div key={index} className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
          {part}
        </div>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Universal Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Universal Notes
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            General notes, patterns, templates, and references for all problems
          </p>
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
              placeholder="Write your universal notes here...

Use this space for:
• Common patterns and templates
• Algorithm cheat sheets
• Time/Space complexity references
• Reusable code snippets

Example:
```java
// Binary Search Template
public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

Common Patterns:
- Two Pointers
- Sliding Window
- Binary Search
- DFS/BFS
- Dynamic Programming"
              className={cn(
                "h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "font-mono text-sm leading-relaxed p-4",
                "bg-background"
              )}
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0 overflow-auto p-4 bg-background">
            {renderPreview(notes)}
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {notes.length} characters • Supports code blocks with ```language
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="gap-1.5">
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

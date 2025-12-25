import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, FileText, Save, X, Copy, Check, BookOpen, Plus, Trash2, Search, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const UNIVERSAL_NOTES_KEY = 'dsa-tracker-universal-notes-v2';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export function UniversalNotesDialog() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const activeNote = useMemo(() => 
    notes.find(n => n.id === activeNoteId) || null, 
    [notes, activeNoteId]
  );

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(query) || 
      n.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  useEffect(() => {
    const stored = localStorage.getItem(UNIVERSAL_NOTES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(UNIVERSAL_NOTES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotes(parsed);
          if (parsed.length > 0 && !activeNoteId) {
            setActiveNoteId(parsed[0].id);
          }
        } catch {
          setNotes([]);
        }
      }
      setSearchQuery('');
    }
  }, [open]);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(UNIVERSAL_NOTES_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    setActiveTab('edit');
    toast.success('New note created');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    saveNotes(updatedNotes);
    if (activeNoteId === id) {
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
    toast.success('Note deleted');
  };

  const updateNoteContent = (content: string) => {
    if (!activeNoteId) return;
    const updatedNotes = notes.map(n => 
      n.id === activeNoteId 
        ? { ...n, content, updatedAt: Date.now() }
        : n
    );
    saveNotes(updatedNotes);
  };

  const updateNoteTitle = (id: string, title: string) => {
    const updatedNotes = notes.map(n => 
      n.id === id 
        ? { ...n, title: title || 'Untitled Note', updatedAt: Date.now() }
        : n
    );
    saveNotes(updatedNotes);
    setEditingTitleId(null);
  };

  const insertCodeBlock = () => {
    if (!activeNote) return;
    const codeTemplate = '\n```java\n// Your code here\n\n```\n';
    updateNoteContent(activeNote.content + codeTemplate);
  };

  const copyNotes = async () => {
    if (!activeNote) return;
    await navigator.clipboard.writeText(activeNote.content);
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Universal Notes
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            General notes, patterns, templates, and references for all problems
          </p>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border flex flex-col bg-muted/20">
            <div className="p-3 border-b border-border space-y-2">
              <Button onClick={createNewNote} className="w-full gap-2" size="sm">
                <Plus className="w-4 h-4" />
                New Note
              </Button>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchQuery ? 'No notes found' : 'No notes yet'}
                  </p>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={cn(
                        "group p-2 rounded-md cursor-pointer transition-colors",
                        activeNoteId === note.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setActiveTab('edit');
                      }}
                    >
                      {editingTitleId === note.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => updateNoteTitle(note.id, editingTitle)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateNoteTitle(note.id, editingTitle);
                            }
                            if (e.key === 'Escape') {
                              setEditingTitleId(null);
                            }
                          }}
                          className="h-6 text-sm px-1"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{note.title}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {formatDate(note.updatedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTitleId(note.id);
                                setEditingTitle(note.title);
                              }}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeNote ? (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/30">
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
                    value={activeNote.content}
                    onChange={(e) => updateNoteContent(e.target.value)}
                    placeholder="Write your notes here...

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
```"
                    className={cn(
                      "h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                      "font-mono text-sm leading-relaxed p-4",
                      "bg-background"
                    )}
                  />
                </TabsContent>

                <TabsContent value="preview" className="flex-1 m-0 overflow-auto p-4 bg-background">
                  {renderPreview(activeNote.content)}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a note or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {notes.length} note{notes.length !== 1 ? 's' : ''} 
            {activeNote && ` • ${activeNote.content.length} characters`}
          </p>
          <Button variant="outline" onClick={() => setOpen(false)} className="gap-1.5">
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

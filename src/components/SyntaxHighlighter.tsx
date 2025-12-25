import { Highlight, themes } from 'prism-react-renderer';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const normalizedLanguage = language.toLowerCase().trim();
  
  // Map common language names to Prism-supported ones
  const languageMap: Record<string, string> = {
    'java': 'java',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'python': 'python',
    'py': 'python',
    'cpp': 'cpp',
    'c++': 'cpp',
    'c': 'c',
    'go': 'go',
    'rust': 'rust',
    'sql': 'sql',
    'bash': 'bash',
    'shell': 'bash',
    'json': 'json',
    'jsx': 'jsx',
    'tsx': 'tsx',
  };

  const prismLanguage = languageMap[normalizedLanguage] || 'javascript';

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast.success('Code copied');
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border">
      <div className="bg-muted/80 px-3 py-1.5 text-xs font-mono text-muted-foreground flex items-center justify-between">
        <span>{language || 'code'}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={copyCode}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={prismLanguage as any}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre 
            className={`${className} p-3 overflow-x-auto text-sm`} 
            style={{ ...style, margin: 0, background: 'hsl(var(--muted) / 0.3)' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-muted-foreground/50 select-none text-right mr-4">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

interface NotesPreviewProps {
  text: string;
}

export function NotesPreview({ text }: NotesPreviewProps) {
  if (!text.trim()) {
    return <p className="text-muted-foreground italic">No notes yet. Start writing!</p>;
  }

  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const language = lines[0].trim() || 'code';
          const code = lines.slice(1).join('\n');
          
          return <SyntaxHighlighter key={index} code={code} language={language} />;
        }
        
        // Regular text - preserve line breaks
        return (
          <div key={index} className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
            {part}
          </div>
        );
      })}
    </>
  );
}

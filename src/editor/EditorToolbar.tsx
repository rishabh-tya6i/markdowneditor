import React from 'react';
import { Bold, Italic, Heading1, Heading2, Heading3, Code, Link, Quote, List, ListOrdered, Image } from 'lucide-react';

interface EditorToolbarProps {
  onFormat: (before: string, after?: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormat }) => {
  const buttons = [
    { icon: Bold, title: 'Bold (Cmd+B)', action: () => onFormat('**', '**') },
    { icon: Italic, title: 'Italic (Cmd+I)', action: () => onFormat('*', '*') },
    { type: 'divider' },
    { icon: Heading1, title: 'Heading 1', action: () => onFormat('# ') },
    { icon: Heading2, title: 'Heading 2', action: () => onFormat('## ') },
    { icon: Heading3, title: 'Heading 3', action: () => onFormat('### ') },
    { type: 'divider' },
    { icon: Code, title: 'Code Block', action: () => onFormat('```\n', '\n```') },
    { icon: Link, title: 'Link', action: () => onFormat('[', '](url)') },
    { icon: Image, title: 'Image', action: () => onFormat('![', '](url)') },
    { type: 'divider' },
    { icon: Quote, title: 'Blockquote', action: () => onFormat('> ') },
    { icon: List, title: 'Unordered List', action: () => onFormat('- ') },
    { icon: ListOrdered, title: 'Ordered List', action: () => onFormat('1. ') },
  ];
  
  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-sidebar/20 backdrop-blur-md">
      {buttons.map((btn, idx) => (
        btn.type === 'divider' ? (
          <div key={idx} className="h-4 w-[1px] bg-border mx-1" />
        ) : (
          <button
            key={idx}
            onClick={btn.action}
            title={btn.title}
            className="p-1 px-1.5 text-muted-text hover:text-accent hover:bg-accent/10 rounded-md transition-all group"
            data-testid={`toolbar-${idx}`}
          >
            {btn.icon && <btn.icon className="w-3.5 h-3.5 group-active:scale-95 transition-transform" />}
          </button>
        )
      ))}
    </div>
  );
};

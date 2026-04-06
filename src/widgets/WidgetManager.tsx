import React, { useEffect, useMemo } from 'react';
import { useWidgetStore } from '../store/useWidgetStore';
import { useEditorStore } from '../store/useEditorStore';
import { tableOfContentsWidget } from './TableOfContents';
import { wordCounterWidget } from './WordCounter';
import { readingTimeWidget } from './ReadingTime';
import type { EditorContext, Heading, WidgetDefinition } from './types';
import { X } from 'lucide-react';

// Register all widgets
const allWidgets: WidgetDefinition[] = [
  tableOfContentsWidget,
  wordCounterWidget,
  readingTimeWidget,
];

export const WidgetManager: React.FC<{ position: 'left' | 'right' | 'bottom' }> = ({ position }) => {
  const { registerWidget, getEnabledWidgets, toggleWidget } = useWidgetStore();
  const { content, filePath } = useEditorStore();
  
  // Register widgets on mount
  useEffect(() => {
    allWidgets.forEach(widget => {
      // In a real app we might not want to overwrite if already registered, 
      // but registerWidget handles checking for existence.
      // Explicitly providing Widget matches the store's expectation.
      registerWidget({
        id: widget.id,
        name: widget.name,
        position: widget.position,
        enabled: true, // Default to true for demo
        order: widget.order,
        render: widget.render
      });
    });
  }, [registerWidget]);
  
  // Calculate editor context
  const context = useMemo((): EditorContext => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    const lines = content.split('\n');
    
    // Extract headings
    const headings: Heading[] = [];
    lines.forEach((line, idx) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        headings.push({
          level: match[1].length,
          text: match[2],
          id: match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^\w\s-]/g, ''),
          line: idx + 1,
        });
      }
    });
    
    return {
      content,
      filePath,
      wordCount: words.length,
      charCount: content.length,
      lineCount: lines.length,
      headings,
    };
  }, [content, filePath]);
  
  const enabledWidgets = getEnabledWidgets(position);
  
  if (enabledWidgets.length === 0) return null;
  
  if (position === 'bottom') {
    return (
      <footer className="flex items-center overflow-x-auto border-t border-border bg-sidebar/20 divide-x divide-border no-print">
        {enabledWidgets.map(widget => (
          <React.Fragment key={widget.id}>
            {widget.render(context)}
          </React.Fragment>
        ))}
      </footer>
    );
  }

  return (
    <aside className={`w-64 border-border bg-sidebar/10 flex flex-col h-full overflow-y-auto no-print ${position === 'left' ? 'border-r' : 'border-l'}`}>
      <div className="p-3 py-4 border-b border-border bg-sidebar/20">
        <h2 className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Panel: {position}</h2>
      </div>
      
      {enabledWidgets.map(widget => (
        <div key={widget.id} className="border-b border-border">
          <div className="flex items-center justify-between p-3 bg-sidebar/30 group">
            <span className="text-[11px] font-bold text-muted-text uppercase tracking-widest flex items-center">
              {widget.name}
            </span>
            <button
              onClick={() => toggleWidget(widget.id)}
              className="text-muted-text hover:text-accent p-1 rounded-md transition-all opacity-0 group-hover:opacity-100"
              data-testid={`toggle-${widget.id}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {widget.render(context)}
        </div>
      ))}
    </aside>
  );
};

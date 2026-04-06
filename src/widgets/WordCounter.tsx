import React from 'react';
import type { EditorContext, WidgetDefinition } from './types';
import { Type } from 'lucide-react';

const WordCounterWidget: React.FC<{ context: EditorContext }> = ({ context }) => {
  const { wordCount, charCount, lineCount } = context;
  
  return (
    <div className="px-4 py-3 flex items-center space-x-6 text-[10px] font-bold text-muted-text uppercase tracking-widest border-t border-border bg-sidebar/10 backdrop-blur-md" data-testid="word-counter-widget">
      <div className="flex items-center space-x-2">
        <Type className="w-3 h-3 text-accent" />
        <span className="opacity-60">Lines:</span>
        <span className="text-text tabular-nums" data-testid="line-count">{lineCount}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="opacity-60">Words:</span>
        <span className="text-text tabular-nums" data-testid="word-count">{wordCount}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="opacity-60">Characters:</span>
        <span className="text-text tabular-nums" data-testid="char-count">{charCount}</span>
      </div>
    </div>
  );
};

export const wordCounterWidget: WidgetDefinition = {
  id: 'word-counter',
  name: 'Statistics',
  icon: <Type className="w-4 h-4" />,
  position: 'bottom',
  order: 1,
  render: (context) => <WordCounterWidget context={context} />,
};

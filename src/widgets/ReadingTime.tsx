import React from 'react';
import type { EditorContext, WidgetDefinition } from './types';
import { Clock } from 'lucide-react';

const ReadingTimeWidget: React.FC<{ context: EditorContext }> = ({ context }) => {
  const { wordCount } = context;
  
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return (
    <div className="flex items-center space-x-2 text-[10px] font-bold text-muted-text uppercase tracking-widest pl-6 border-l border-border/50" data-testid="reading-time-widget">
      <Clock className="w-3 h-3 text-accent" />
      <span className="opacity-60">Read:</span>
      <span className="text-text tabular-nums" data-testid="reading-time">~{readingTimeMinutes} min</span>
    </div>
  );
};

export const readingTimeWidget: WidgetDefinition = {
  id: 'reading-time',
  name: 'Reading Time',
  icon: <Clock className="w-4 h-4" />,
  position: 'bottom',
  order: 2,
  render: (context) => <ReadingTimeWidget context={context} />,
};

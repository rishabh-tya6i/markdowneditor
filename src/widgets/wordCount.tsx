import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

const WordCount: React.FC = () => {
  const { content } = useEditorStore();

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  const readingTime = Math.ceil(words / 200); // 200 wpm

  return (
    <div className="h-8 border-t border-border bg-sidebar flex items-center justify-end px-6 text-[11px] font-medium text-muted-text space-x-6 backdrop-blur-md">
      <div className="flex items-center space-x-1.5">
        <span className="uppercase tracking-widest text-[9px] opacity-70">Words:</span>
        <span className="text-text tabular-nums">{words}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="uppercase tracking-widest text-[9px] opacity-70">Chars:</span>
        <span className="text-text tabular-nums">{chars}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="uppercase tracking-widest text-[9px] opacity-70">Time:</span>
        <span className="text-text">{readingTime} min read</span>
      </div>
    </div>
  );
};

export default WordCount;

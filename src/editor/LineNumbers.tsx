import React, { forwardRef } from 'react';

interface LineNumbersProps {
  count: number;
}

export const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(({ count }, ref) => {
  return (
    <div 
      ref={ref}
      className="flex flex-col py-4 px-3 bg-sidebar/30 text-muted-text/40 text-[11px] font-mono select-none border-r border-border min-w-[3rem] overflow-hidden" 
      data-testid="line-numbers"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-[1.6] text-right cursor-default tabular-nums">
          {i + 1}
        </div>
      ))}
    </div>
  );
});

LineNumbers.displayName = 'LineNumbers';

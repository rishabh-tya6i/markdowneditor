import React from 'react';

interface LineNumbersProps {
  count: number;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({ count }) => {
  return (
    <div className="flex flex-col py-4 px-3 bg-sidebar/30 text-muted-text/40 text-[11px] font-mono select-none border-r border-border min-w-[3rem]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-[1.6] text-right cursor-default tabular-nums">
          {i + 1}
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import type { EditorContext, WidgetDefinition } from './types';
import { Layers } from 'lucide-react';

const TOCWidget: React.FC<{ context: EditorContext }> = ({ context }) => {
  const { headings } = context;
  
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="p-4" data-testid="toc-widget">
      <h3 className="text-[10px] font-bold mb-4 text-muted-text uppercase tracking-widest flex items-center">
        <Layers className="w-3 h-3 mr-2" /> Table of Contents
      </h3>
      {headings.length === 0 ? (
        <p className="text-xs italic text-muted-text/60">No headings found...</p>
      ) : (
        <ul className="space-y-2">
          {headings.map((heading, idx) => (
            <li
              key={idx}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              className="text-xs hover:text-accent cursor-pointer truncate transition-colors font-medium border-l border-transparent hover:border-accent pl-2"
              onClick={() => scrollToHeading(heading.id || '')}
              data-testid={`toc-item-${idx}`}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const tableOfContentsWidget: WidgetDefinition = {
  id: 'toc',
  name: 'Table of Contents',
  icon: <Layers className="w-4 h-4" />,
  position: 'left',
  order: 1,
  render: (context) => <TOCWidget context={context} />,
};

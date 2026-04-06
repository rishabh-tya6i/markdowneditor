import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC = () => {
  const { content } = useEditorStore();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const lines = content.split('\n');
    const headings: TocItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text, level });
      }
    });
    
    setItems(headings);
  }, [content]);

  if (items.length === 0) return (
    <div className="p-4 text-sm italic text-muted-text">No headings found...</div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="text-xs font-bold text-muted-text uppercase tracking-wider mb-4">Table of Contents</div>
      <ul className="space-y-1.5 transition-all">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="hover:text-accent transition-colors"
            style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
          >
            <a href={`#${item.id}`} className="text-sm block py-1 border-l border-transparent hover:border-accent">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;

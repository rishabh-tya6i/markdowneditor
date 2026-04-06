import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { X, FileText, Circle } from 'lucide-react';

export const TabBar: React.FC = () => {
  const { files, activeFileId, switchFile, closeFile } = useEditorStore();

  return (
    <div className="flex items-center overflow-x-auto bg-sidebar border-b border-border h-10 no-print scrollbar-hide">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => switchFile(file.id)}
          className={`
            flex items-center min-w-[120px] max-w-[200px] h-full px-3 border-r border-border cursor-pointer transition-all relative group
            ${activeFileId === file.id ? 'bg-background border-b-2 border-b-accent' : 'hover:bg-background/50'}
          `}
          title={file.filePath || file.fileName || 'Untitled'}
        >
          <FileText className={`w-3.5 h-3.5 mr-2 ${activeFileId === file.id ? 'text-accent' : 'text-muted-text/50'}`} />
          <span className={`text-xs truncate flex-1 ${activeFileId === file.id ? 'text-text font-medium' : 'text-muted-text'}`}>
            {file.fileName || 'Untitled'}
          </span>
          
          <div className="flex items-center ml-2">
            {file.isDirty ? (
              <Circle className="w-2 h-2 fill-accent text-accent animate-pulse group-hover:hidden" />
            ) : null}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className={`
                p-0.5 rounded-md hover:bg-border transition-all
                ${activeFileId === file.id || file.isDirty ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              `}
            >
              <X className="w-3 h-3 text-muted-text hover:text-text" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

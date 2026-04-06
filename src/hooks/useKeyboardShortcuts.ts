import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../store/useEditorStore';
import { openFile, saveFile, saveFileAs } from '../services/fileService';

export const useKeyboardShortcuts = (
  onFormat: (before: string, after?: string) => void
) => {
  const {
    content,
    filePath,
    layoutMode,
    setLayoutMode,
  } = useEditorStore(useShallow((state) => ({
    content: state.content,
    filePath: state.filePath,
    layoutMode: state.layoutMode,
    setLayoutMode: state.setLayoutMode
  })));
  
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (!cmdOrCtrl) return;
      
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          onFormat('**', '**');
          break;
          
        case 'i':
          e.preventDefault();
          onFormat('*', '*');
          break;
          
        case 's':
          e.preventDefault();
          if (filePath) {
            await saveFile(filePath, content);
          } else {
            await saveFileAs(content);
          }
          break;
          
        case 'o':
          e.preventDefault();
          await openFile();
          break;
          
        case 'p':
          e.preventDefault();
          setLayoutMode(layoutMode === 'preview' ? 'split' : 'preview');
          break;
          
        case 'e':
          e.preventDefault();
          setLayoutMode('editor');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, filePath, layoutMode, onFormat, setLayoutMode]);
};

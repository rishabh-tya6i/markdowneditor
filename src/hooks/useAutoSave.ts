import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../store/useEditorStore';
import { saveFile } from '../services/fileService';

export const useAutoSave = (delay: number = 3000) => {
  const { content, filePath, isDirty, setLastSaved } = useEditorStore(useShallow((state) => ({
    content: state.content,
    filePath: state.filePath,
    isDirty: state.isDirty,
    setLastSaved: state.setLastSaved
  })));
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  useEffect(() => {
    if (!isDirty || !filePath) return;
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveFile(filePath, content);
        setLastSaved(new Date());
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, filePath, isDirty, delay, setLastSaved]);
};

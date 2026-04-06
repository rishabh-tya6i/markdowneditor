import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorStore {
  content: string;
  filePath: string | null;
  fileName: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
  layoutMode: 'split' | 'editor' | 'preview';
  splitRatio: number;
  
  // Actions
  setContent: (content: string) => void;
  setFilePath: (path: string | null, name: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
  setLastSaved: (date: Date) => void;
  setLayoutMode: (mode: 'split' | 'editor' | 'preview') => void;
  setSplitRatio: (ratio: number) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      content: '# Welcome to Markdown Editor\n\nStart typing...',
      filePath: null,
      fileName: null,
      isDirty: false,
      lastSaved: null,
      layoutMode: 'split',
      splitRatio: 50,
      
      setContent: (content) => set({ content, isDirty: true }),
      setFilePath: (path, name) => set({ filePath: path, fileName: name }),
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setSplitRatio: (ratio) => set({ splitRatio: ratio }),
      reset: () => set({
        content: '',
        filePath: null,
        fileName: null,
        isDirty: false,
        lastSaved: null,
      }),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        splitRatio: state.splitRatio,
      }),
    }
  )
);

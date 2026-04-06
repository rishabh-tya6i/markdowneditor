import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OpenFile {
  id: string;
  content: string;
  filePath: string | null;
  fileName: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
}

interface EditorStore {
  files: OpenFile[];
  activeFileId: string | null;
  layoutMode: 'split' | 'editor' | 'preview';
  splitRatio: number;
  
  // Derived state helpers (since we can't easily have computed in Zustand without some tricks)
  // We'll actually store the current active file's data at the top level for performance and easy access
  content: string;
  filePath: string | null;
  fileName: string | null;
  isDirty: boolean;
  lastSaved: Date | null;

  // Actions
  addFile: (path: string | null, name: string | null, content?: string) => void;
  closeFile: (id: string) => void;
  switchFile: (id: string) => void;
  setContent: (content: string) => void;
  setFilePath: (path: string | null, name: string | null) => void;
  setIsDirty: (dirty: boolean) => void;
  setLastSaved: (date: Date) => void;
  setLayoutMode: (mode: 'split' | 'editor' | 'preview') => void;
  setSplitRatio: (ratio: number) => void;
  reset: () => void;
}

const DEFAULT_CONTENT = '# Welcome to Mdown\n\nStart typing...';

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      files: [
        {
          id: 'initial',
          content: DEFAULT_CONTENT,
          filePath: null,
          fileName: 'Untitled',
          isDirty: false,
          lastSaved: null,
        }
      ],
      activeFileId: 'initial',
      content: DEFAULT_CONTENT,
      filePath: null,
      fileName: 'Untitled',
      isDirty: false,
      lastSaved: null,
      layoutMode: 'split',
      splitRatio: 50,
      
      addFile: (path, name, content) => {
        const { files } = get();
        
        // If file already open, switch to it
        if (path) {
          const existing = files.find(f => f.filePath === path);
          if (existing) {
            get().switchFile(existing.id);
            return;
          }
        }
        
        const newFile: OpenFile = {
          id: Math.random().toString(36).substring(7),
          content: content || '',
          filePath: path,
          fileName: name || 'Untitled',
          isDirty: false,
          lastSaved: null,
        };
        
        set({
          files: [...files, newFile],
          activeFileId: newFile.id,
          content: newFile.content,
          filePath: newFile.filePath,
          fileName: newFile.fileName,
          isDirty: newFile.isDirty,
          lastSaved: newFile.lastSaved,
        });
      },
      
      closeFile: (id) => {
        const { files, activeFileId } = get();
        if (files.length <= 1) {
          // If closing last file, reset it instead of removing
          get().reset();
          return;
        }
        
        const newFiles = files.filter(f => f.id !== id);
        let newActiveId = activeFileId;
        
        if (activeFileId === id) {
          newActiveId = newFiles[Math.max(0, files.findIndex(f => f.id === id) - 1)].id;
        }
        
        const newActiveFile = newFiles.find(f => f.id === newActiveId)!;
        
        set({
          files: newFiles,
          activeFileId: newActiveId,
          content: newActiveFile.content,
          filePath: newActiveFile.filePath,
          fileName: newActiveFile.fileName,
          isDirty: newActiveFile.isDirty,
          lastSaved: newActiveFile.lastSaved,
        });
      },
      
      switchFile: (id) => {
        const { files, activeFileId, content, isDirty, filePath, fileName, lastSaved } = get();
        
        // Save current active file state into the files array
        const updatedFiles = files.map(f => 
          f.id === activeFileId 
            ? { ...f, content, isDirty, filePath, fileName, lastSaved } 
            : f
        );
        
        const nextFile = updatedFiles.find(f => f.id === id);
        if (!nextFile) return;
        
        set({
          files: updatedFiles,
          activeFileId: id,
          content: nextFile.content,
          filePath: nextFile.filePath,
          fileName: nextFile.fileName,
          isDirty: nextFile.isDirty,
          lastSaved: nextFile.lastSaved,
        });
      },
      
      setContent: (content) => {
        const { files, activeFileId } = get();
        set({ content, isDirty: true });
        
        // Update in-place to ensure switching back preserves it even if not synced yet
        set({
          files: files.map(f => f.id === activeFileId ? { ...f, content, isDirty: true } : f)
        });
      },
      
      setFilePath: (path, name) => {
        const { files, activeFileId } = get();
        set({ filePath: path, fileName: name });
        set({
          files: files.map(f => f.id === activeFileId ? { ...f, filePath: path, fileName: name } : f)
        });
      },
      
      setIsDirty: (dirty) => {
        const { files, activeFileId } = get();
        set({ isDirty: dirty });
        set({
          files: files.map(f => f.id === activeFileId ? { ...f, isDirty: dirty } : f)
        });
      },
      
      setLastSaved: (date) => {
        const { files, activeFileId } = get();
        set({ lastSaved: date, isDirty: false });
        set({
          files: files.map(f => f.id === activeFileId ? { ...f, lastSaved: date, isDirty: false } : f)
        });
      },
      
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setSplitRatio: (ratio) => set({ splitRatio: ratio }),
      reset: () => {
        const { activeFileId, files } = get();
        const resetFile = {
            id: activeFileId || 'initial',
            content: '',
            filePath: null,
            fileName: 'Untitled',
            isDirty: false,
            lastSaved: null,
        };
        set({
            activeFileId: resetFile.id,
            files: activeFileId ? files.map(f => f.id === activeFileId ? resetFile : f) : [resetFile],
            content: '',
            filePath: null,
            fileName: 'Untitled',
            isDirty: false,
            lastSaved: null,
        });
      },
    }),
    {
      name: 'editor-storage-v2',
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        splitRatio: state.splitRatio,
        files: state.files,
        activeFileId: state.activeFileId,
        // Also persist active state to avoid blank on reload
        content: state.content,
        filePath: state.filePath,
        fileName: state.fileName,
        isDirty: state.isDirty,
        lastSaved: state.lastSaved,
      }),
    }
  )
);

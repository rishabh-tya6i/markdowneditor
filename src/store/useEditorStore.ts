import { create } from 'zustand';

export interface Theme {
  name: string;
  id: string;
}

export interface Widget {
  id: string;
  name: string;
  position: "left" | "right" | "bottom";
  isEnabled: boolean;
}

export interface EditorState {
  content: string;
  filePath: string | null;
  theme: string;
  layout: "split" | "editor" | "preview";
  widgets: Widget[];
  isDirty: boolean;
  
  setContent: (content: string) => void;
  setFilePath: (path: string | null) => void;
  setTheme: (theme: string) => void;
  setLayout: (layout: "split" | "editor" | "preview") => void;
  toggleWidget: (id: string) => void;
  setDirty: (isDirty: boolean) => void;
}

const getSavedTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

export const useEditorStore = create<EditorState>((set) => ({
  content: '# Hello Markdown\n\nWrite something amazing...',
  filePath: null,
  theme: getSavedTheme(),
  layout: 'split',
  isDirty: false,
  widgets: [
    { id: 'toc', name: 'Table of Contents', position: 'left', isEnabled: true },
    { id: 'wordCount', name: 'Word Count', position: 'bottom', isEnabled: true },
  ],
  
  setContent: (content) => set({ content, isDirty: true }),
  setFilePath: (filePath) => set({ filePath, isDirty: false }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },
  setLayout: (layout) => set({ layout }),
  toggleWidget: (id) => set((state) => ({
    widgets: state.widgets.map((w) => 
      w.id === id ? { ...w, isEnabled: !w.isEnabled } : w
    )
  })),
  setDirty: (isDirty) => set({ isDirty }),
}));

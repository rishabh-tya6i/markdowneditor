import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';
import { defaultThemes } from '../themes/defaultThemes';

interface ThemeStore {
  currentTheme: Theme;
  customThemes: Theme[];
  
  setTheme: (theme: Theme) => void;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (themeId: string) => void;
  getAllThemes: () => Theme[];
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: defaultThemes[0], // Light theme
      customThemes: [],
      
      setTheme: (theme) => {
        set({ currentTheme: theme });
        applyTheme(theme);
      },
      
      addCustomTheme: (theme) => {
        set((state) => ({
          customThemes: [...state.customThemes, theme],
        }));
      },
      
      removeCustomTheme: (themeId) => {
        set((state) => ({
          customThemes: state.customThemes.filter(t => t.id !== themeId),
        }));
      },
      
      getAllThemes: () => [...defaultThemes, ...get().customThemes],
    }),
    {
      name: 'theme-storage',
    }
  )
);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--editor-bg', theme.colors.background);
  root.style.setProperty('--editor-text', theme.colors.text);
  root.style.setProperty('--editor-accent', theme.colors.accent);
  root.style.setProperty('--editor-code-bg', theme.colors.codeBlock);
  root.style.setProperty('--editor-border', theme.colors.border);
  root.style.setProperty('--editor-selection', theme.colors.selection);
}

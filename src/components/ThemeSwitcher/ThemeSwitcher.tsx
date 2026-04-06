import React, { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import type { Theme } from '../../types';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, getAllThemes } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const themes = getAllThemes();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm rounded hover:bg-white/10 dark:hover:bg-white/5 transition-colors flex items-center space-x-2"
        data-testid="theme-switcher-button"
      >
        <span className="text-lg">🎨</span>
        <span className="font-medium">{currentTheme.name}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-56 bg-sidebar border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl">
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-muted-text uppercase tracking-widest">
                Select Theme
              </div>
              {themes.map((theme: Theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left rounded-lg transition-all flex items-center justify-between group ${
                    currentTheme.id === theme.id 
                      ? 'bg-accent text-white shadow-sm' 
                      : 'hover:bg-accent/10 text-muted-text hover:text-text'
                  }`}
                  data-testid={`theme-option-${theme.id}`}
                >
                  <span className="text-sm font-medium">{theme.name}</span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      currentTheme.id === theme.id 
                        ? 'border-white/50 bg-white/20' 
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: currentTheme.id === theme.id ? undefined : theme.colors.accent }}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

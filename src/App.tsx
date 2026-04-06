import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import Layout from './editor/Layout';
import { useThemeStore } from './store/useThemeStore';

const App: React.FC = () => {
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    // Initial theme apply
    const root = document.documentElement;
    root.style.setProperty('--background', currentTheme.colors.background);
    root.style.setProperty('--text', currentTheme.colors.text);
    root.style.setProperty('--accent', currentTheme.colors.accent);
    root.style.setProperty('--code-block', currentTheme.colors.codeBlock);
    root.style.setProperty('--border', currentTheme.colors.border);
    root.style.setProperty('--selection', currentTheme.colors.selection);
    
    // Maintain editor specific ones
    root.style.setProperty('--editor-bg', currentTheme.colors.background);
    root.style.setProperty('--editor-text', currentTheme.colors.text);
    root.style.setProperty('--editor-accent', currentTheme.colors.accent);
    root.style.setProperty('--editor-code-bg', currentTheme.colors.codeBlock);
    root.style.setProperty('--editor-border', currentTheme.colors.border);
    root.style.setProperty('--editor-selection', currentTheme.colors.selection);
    
    // Also set data-theme for any CSS that still uses it
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <Layout />
    </>
  );
};

export default App;

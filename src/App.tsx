import React, { useEffect } from 'react';
import Layout from './editor/Layout';
import { useThemeStore } from './store/useThemeStore';

const App: React.FC = () => {
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    // Initial theme apply
    const root = document.documentElement;
    root.style.setProperty('--editor-bg', currentTheme.colors.background);
    root.style.setProperty('--editor-text', currentTheme.colors.text);
    root.style.setProperty('--editor-accent', currentTheme.colors.accent);
    root.style.setProperty('--editor-code-bg', currentTheme.colors.codeBlock);
    root.style.setProperty('--editor-border', currentTheme.colors.border);
    root.style.setProperty('--editor-selection', currentTheme.colors.selection);
    
    // Also set data-theme for any CSS that still uses it
    document.documentElement.setAttribute('data-theme', currentTheme.id);
  }, [currentTheme]);

  return <Layout />;
};

export default App;

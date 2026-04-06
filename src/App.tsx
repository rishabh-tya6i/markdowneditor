import React, { useEffect } from 'react';
import Layout from './editor/Layout';
import { useEditorStore } from './store/useEditorStore';

const App: React.FC = () => {
  const { theme } = useEditorStore();

  useEffect(() => {
    // Initial theme set
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <Layout />;
};

export default App;

import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../store/useEditorStore';
import Header from './Header';
import Editor from './Editor';
import Preview from './Preview';
import { WidgetManager } from '../widgets/WidgetManager';
import { getCurrentWindow } from '@tauri-apps/api/window';

const Layout: React.FC = () => {
  const { layoutMode, filePath, isDirty } = useEditorStore(useShallow((state) => ({
    layoutMode: state.layoutMode,
    filePath: state.filePath,
    isDirty: state.isDirty
  })));
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Scroll Synchronization
  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview || layoutMode !== 'split') return;

    const handleScroll = () => {
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    };

    editor.addEventListener('scroll', handleScroll);
    return () => editor.removeEventListener('scroll', handleScroll);
  }, [layoutMode]);

  // Unsaved Changes Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Tauri Window Title
  useEffect(() => {
    const updateTitle = async () => {
      try {
        const appWindow = getCurrentWindow();
        const fileName = filePath ? filePath.split('/').pop() : 'Untitled';
        await appWindow.setTitle(`Mdown - ${fileName}${isDirty ? ' •' : ''}`);
      } catch (err) {
        console.warn('Could not update window title:', err);
      }
    };
    updateTitle();
  }, [filePath, isDirty]);

  return (
    <div className="flex flex-col h-screen h-svh bg-background text-text overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <WidgetManager position="left" />

        <div className="flex-1 flex overflow-hidden">
          {(layoutMode === 'editor' || layoutMode === 'split') && (
            <div className={`flex-1 h-full min-w-0 ${layoutMode === 'split' ? '' : 'max-w-4xl mx-auto ring-1 ring-border shadow-2xl my-8 rounded-xl bg-background border border-border overflow-hidden p-6'}`}>
              <Editor ref={editorRef} />
            </div>
          )}
          
          {(layoutMode === 'preview' || layoutMode === 'split') && (
            <div className={`flex-1 h-full overflow-y-auto ${layoutMode === 'split' ? 'border-l border-border' : 'max-w-4xl mx-auto py-8'}`}>
              <Preview ref={previewRef} />
            </div>
          )}
        </div>

        <WidgetManager position="right" />
      </main>

      <WidgetManager position="bottom" />
    </div>
  );
};

export default Layout;

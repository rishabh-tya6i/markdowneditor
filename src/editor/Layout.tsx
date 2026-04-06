import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../store/useEditorStore';
import Header from './Header';
import Editor from './Editor';
import Preview from './Preview';
import WordCount from '../widgets/wordCount';
import TableOfContents from '../widgets/toc';
import { openFile, saveFile, saveFileAs } from '../services/fileService';
import { getCurrentWindow } from '@tauri-apps/api/window';

const Layout: React.FC = () => {
  const { layout, widgets, content, filePath, setLayout, isDirty } = useEditorStore();
  const isTocEnabled = widgets.find(w => w.id === 'toc')?.isEnabled;
  const isWordCountEnabled = widgets.find(w => w.id === 'wordCount')?.isEnabled;

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Scroll Synchronization
  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview || layout !== 'split') return;

    const handleScroll = () => {
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    };

    editor.addEventListener('scroll', handleScroll);
    return () => editor.removeEventListener('scroll', handleScroll);
  }, [layout]);

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

  // Drag & Drop Support
  useEffect(() => {
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file?.name.endsWith('.md')) {
        const text = await file.text();
        useEditorStore.getState().setContent(text);
        // Note: Real path can't be obtained from browser File object in web context, 
        // but Tauri's onDrop event can. We'll stick to this for now or use Tauri events.
      }
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener('drop', handleDrop);
    window.addEventListener('dragover', handleDragOver);
    return () => {
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (filePath) {
          saveFile(filePath, content);
        } else {
          saveFileAs(content);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        openFile();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setLayout(layout === 'preview' ? 'editor' : 'preview');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, filePath, layout, setLayout]);

  // Tauri Window Title
  useEffect(() => {
    const updateTitle = async () => {
      const appWindow = getCurrentWindow();
      const fileName = filePath ? filePath.split('/').pop() : 'Untitled';
      await appWindow.setTitle(`Mdown - ${fileName}${isDirty ? ' •' : ''}`);
    };
    updateTitle();
  }, [filePath, isDirty]);

  return (
    <div className="flex flex-col h-screen h-svh bg-background text-text overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {isTocEnabled && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border bg-sidebar overflow-hidden relative"
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <div className="w-[260px] h-full">
                <TableOfContents />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 flex overflow-hidden">
          {(layout === 'editor' || layout === 'split') && (
            <div className={`flex-1 h-full min-w-0 ${layout === 'split' ? '' : 'max-w-4xl mx-auto ring-1 ring-border shadow-2xl my-8 rounded-xl bg-background border border-border overflow-hidden p-6'}`}>
              <Editor ref={editorRef} />
            </div>
          )}
          
          {(layout === 'preview' || layout === 'split') && (
            <div className={`flex-1 h-full overflow-y-auto ${layout === 'split' ? 'border-l border-border' : 'max-w-4xl mx-auto py-8'}`}>
              <Preview ref={previewRef} />
            </div>
          )}
        </div>
      </main>

      {isWordCountEnabled && <WordCount />}
    </div>
  );
};

export default Layout;

import React, { useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../store/useEditorStore';
import { EditorToolbar } from './EditorToolbar';
import { LineNumbers } from './LineNumbers';
import { useAutoSave } from '../hooks/useAutoSave';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const Editor = forwardRef<HTMLTextAreaElement>((_, ref) => {
  const { content, setContent } = useEditorStore(useShallow((state) => ({
    content: state.content,
    setContent: state.setContent
  })));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  useImperativeHandle(ref, () => textareaRef.current!);

  // Scroll Sync for Line Numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Formatting helper
  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    }, 0);
  }, [content, setContent]);

  // Integrated Hooks
  useAutoSave();
  useKeyboardShortcuts(insertFormatting);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      insertFormatting('  ');
    }
  };

  const lineCount = content.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden border-r border-border">
      <EditorToolbar onFormat={insertFormatting} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LineNumbers ref={lineNumbersRef} count={lineCount} />
        
        <textarea
          ref={textareaRef}
          className="editor-textarea h-full flex-1 outline-none focus:outline-none p-4 pb-32 pl-4 text-[14px] leading-[1.6] bg-transparent text-text font-mono resize-none"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder="Start writing..."
          spellCheck={false}
          data-testid="editor-textarea"
        />
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';
export default Editor;

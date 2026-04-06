import React, { useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import debounce from 'lodash.debounce';
import { useEditorStore } from '../store/useEditorStore';
import { saveFile } from '../services/fileService';

const Editor = forwardRef<HTMLTextAreaElement>((_, ref) => {
  const { content, setContent, filePath } = useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useImperativeHandle(ref, () => textareaRef.current!);

  // Auto-save logic
  const debouncedSave = useRef(
    debounce((path: string, val: string) => {
      saveFile(path, val);
    }, 1000)
  ).current;

  useEffect(() => {
    if (filePath && content) {
      debouncedSave(filePath, content);
    }
  }, [content, filePath, debouncedSave]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Handle Bold Shortcut (Cmd + B)
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const newValue = content.substring(0, start) + `**${selected}**` + content.substring(end);
      setContent(newValue);
      setTimeout(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = end + 2;
      }, 0);
    }

    // Handle Italic Shortcut (Cmd + I)
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const newValue = content.substring(0, start) + `*${selected}*` + content.substring(end);
      setContent(newValue);
      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      }, 0);
    }
  }, [content, setContent]);

  return (
    <div className="flex-1 h-full overflow-hidden border-r border-border">
      <textarea
        ref={textareaRef}
        className="editor-textarea h-full w-full outline-none focus:outline-none"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start writing..."
        spellCheck={false}
      />
    </div>
  );
});

Editor.displayName = 'Editor';
export default Editor;

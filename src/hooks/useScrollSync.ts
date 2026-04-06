import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to synchronize scrolling between two elements.
 * 
 * @param editorRef Reference to the editor textarea
 * @param previewRef Reference to the preview container div
 * @param enabled Whether synchronization is currently active
 */
export const useScrollSync = (
  editorRef: React.RefObject<HTMLTextAreaElement>,
  previewRef: React.RefObject<HTMLDivElement>,
  enabled: boolean = true
) => {
  const isSyncing = useRef(false);

  const handleEditorScroll = useCallback(() => {
    if (isSyncing.current || !enabled) {
      isSyncing.current = false;
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;

    if (editor && preview) {
      const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      const previewScrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);

      isSyncing.current = true;
      preview.scrollTop = previewScrollTop;
    }
  }, [editorRef, previewRef, enabled]);

  const handlePreviewScroll = useCallback(() => {
    if (isSyncing.current || !enabled) {
      isSyncing.current = false;
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;

    if (editor && preview) {
      const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      const editorScrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight);

      isSyncing.current = true;
      editor.scrollTop = editorScrollTop;
    }
  }, [editorRef, previewRef, enabled]);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (enabled && editor && preview) {
      editor.addEventListener('scroll', handleEditorScroll, { passive: true });
      preview.addEventListener('scroll', handlePreviewScroll, { passive: true });
    }

    return () => {
      editor?.removeEventListener('scroll', handleEditorScroll);
      preview?.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [enabled, editorRef, previewRef, handleEditorScroll, handlePreviewScroll]);
};

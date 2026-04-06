import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEditorStore } from '../store/useEditorStore';
import { StorageService } from './storageService';
import { toast } from 'sonner';

export const openFile = async () => {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown']
      }]
    });

    if (selected && typeof selected === 'string') {
      const content = await readTextFile(selected);
      const name = selected.split('/').pop() || 'Untitled';
      useEditorStore.getState().addFile(selected, name, content);
      await StorageService.addRecentFile(selected, name);
      toast.success('File opened successfully');
    }
  } catch (error) {
    console.error('Failed to open file:', error);
    toast.error('Failed to open file');
  }
};

export const saveFileAs = async (content: string) => {
  try {
    const path = await save({
      filters: [{
        name: 'Markdown',
        extensions: ['md']
      }]
    });

    if (path) {
      await writeTextFile(path, content);
      const name = path.split('/').pop() || 'Untitled';
      useEditorStore.getState().setFilePath(path, name);
      useEditorStore.getState().setLastSaved(new Date());
      useEditorStore.getState().setIsDirty(false);
      await StorageService.addRecentFile(path, name);
      toast.success('File saved');
      return path;
    }
  } catch (error) {
    console.error('Failed to save file:', error);
    toast.error('Failed to save file');
  }
  return null;
};

export const saveFile = async (path: string, content: string) => {
  try {
    await writeTextFile(path, content);
    useEditorStore.getState().setIsDirty(false);
    useEditorStore.getState().setLastSaved(new Date());
    toast.success('All changes saved');
  } catch (error) {
    console.error('Failed to save file:', error);
    toast.error('Failed to save changes');
  }
};

export const exportToHTML = async (content: string) => {
  try {
    const path = await save({
      filters: [{
        name: 'HTML',
        extensions: ['html']
      }]
    });

    if (path) {
      // Basic HTML wrapper with better styling
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exported Markdown</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    padding: 3rem;
    line-height: 1.6;
    max-width: 900px;
    margin: 0 auto;
    color: #24292e;
  }
  pre {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 1rem;
    overflow: auto;
  }
  code {
    background: #f6f8fa;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  img { max-width: 100%; }
</style>
</head>
<body>
  ${content}
</body>
</html>`;
      await writeTextFile(path, html);
      toast.success('Exported to HTML successfully');
    }
  } catch (error) {
    console.error('Failed to export HTML:', error);
    toast.error('Failed to export HTML');
  }
};

export const printToPDF = () => {
  window.print();
};

export const newFile = () => {
  useEditorStore.getState().addFile(null, 'Untitled', '');
  toast.info('New document created');
};

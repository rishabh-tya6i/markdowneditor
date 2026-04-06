import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEditorStore } from '../store/useEditorStore';
import { StorageService } from './storageService';

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
      useEditorStore.getState().setContent(content);
      useEditorStore.getState().setFilePath(selected, name);
      useEditorStore.getState().setIsDirty(false);
      await StorageService.addRecentFile(selected, name);
    }
  } catch (error) {
    console.error('Failed to open file:', error);
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
      await StorageService.addRecentFile(path, name);
      return path;
    }
  } catch (error) {
    console.error('Failed to save file:', error);
  }
  return null;
};

export const saveFile = async (path: string, content: string) => {
  try {
    await writeTextFile(path, content);
    useEditorStore.getState().setIsDirty(false);
    useEditorStore.getState().setLastSaved(new Date());
  } catch (error) {
    console.error('Failed to save file:', error);
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
      // Basic HTML wrapper
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Export</title><style>body{font-family:sans-serif;padding:2rem;line-height:1.6;max-width:800px;margin:0 auto;}</style></head><body>${content}</body></html>`;
      await writeTextFile(path, html);
    }
  } catch (error) {
    console.error('Failed to export HTML:', error);
  }
};

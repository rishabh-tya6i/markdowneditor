import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEditorStore } from '../store/useEditorStore';
import { addRecentFile } from './recentFiles';

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
      useEditorStore.getState().setContent(content);
      useEditorStore.getState().setFilePath(selected);
      addRecentFile(selected);
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
      useEditorStore.getState().setFilePath(path);
      addRecentFile(path);
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
    useEditorStore.getState().setDirty(false);
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

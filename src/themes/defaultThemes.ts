import type { Theme } from '../types';

export const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#3b82f6',
      codeBlock: '#f3f4f6',
      border: '#e5e7eb',
      selection: '#dbeafe',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      background: '#1e1e1e',
      text: '#d4d4d4',
      accent: '#60a5fa',
      codeBlock: '#2d2d2d',
      border: '#3f3f3f',
      selection: '#264f78',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      background: '#282a36',
      text: '#f8f8f2',
      accent: '#ff79c6',
      codeBlock: '#44475a',
      border: '#6272a4',
      selection: '#44475a',
    },
  },
  {
    id: 'github',
    name: 'GitHub',
    colors: {
      background: '#ffffff',
      text: '#24292f',
      accent: '#0969da',
      codeBlock: '#f6f8fa',
      border: '#d0d7de',
      selection: '#b6e3ff',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    colors: {
      background: '#272822',
      text: '#f8f8f2',
      accent: '#a6e22e',
      codeBlock: '#1e1f1c',
      border: '#49483e',
      selection: '#49483e',
    },
  },
];

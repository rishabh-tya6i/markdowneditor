import React from 'react';

export interface EditorState {
  content: string;
  filePath: string | null;
  fileName: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
}

export interface LayoutMode {
  mode: 'split' | 'editor' | 'preview';
  splitRatio?: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    codeBlock: string;
    border: string;
    selection: string;
  };
}

export interface Widget {
  id: string;
  name: string;
  position: 'left' | 'right' | 'bottom';
  enabled: boolean;
  order: number;
  render: (context: EditorContext) => React.ReactNode;
}

export interface EditorContext {
  content: string;
  filePath: string | null;
  wordCount: number;
  charCount: number;
  lineCount: number;
  headings: Heading[];
}

export interface Heading {
  level: number;
  text: string;
  id: string;
  line: number;
}

export interface RecentFile {
  path: string;
  name: string;
  lastOpened: Date;
}

import type { ReactNode } from 'react';

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

export interface WidgetDefinition {
  id: string;
  name: string;
  icon: string | ReactNode;
  position: 'left' | 'right' | 'bottom';
  order: number;
  render: (context: EditorContext) => ReactNode;
}

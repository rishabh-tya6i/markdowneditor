import Dexie, { type Table } from 'dexie';

export interface RecentFile {
  path: string;
  name: string;
  lastOpened: Date;
}

class MarkdownEditorDB extends Dexie {
  recentFiles!: Table<RecentFile, string>;
  
  constructor() {
    super('MarkdownEditorDB');
    this.version(1).stores({
      recentFiles: 'path, lastOpened',
    });
  }
}

const db = new MarkdownEditorDB();

export class StorageService {
  static async addRecentFile(path: string, name: string): Promise<void> {
    await db.recentFiles.put({
      path,
      name,
      lastOpened: new Date(),
    });
  }
  
  static async getRecentFiles(limit = 10): Promise<RecentFile[]> {
    return db.recentFiles
      .orderBy('lastOpened')
      .reverse()
      .limit(limit)
      .toArray();
  }
  
  static async clearRecentFiles(): Promise<void> {
    await db.recentFiles.clear();
  }
}

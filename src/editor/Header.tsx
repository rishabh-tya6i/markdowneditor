import React, { useState, useEffect } from 'react';
import { Layout, FileText, Monitor, Columns, Settings, Save, FolderOpen, Download, Clock } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { useWidgetStore } from '../store/useWidgetStore';
import { ThemeSwitcher } from '../components/ThemeSwitcher/ThemeSwitcher';
import { StorageService, type RecentFile } from '../services/storageService';
import { openFile, saveFile, saveFileAs, exportToHTML } from '../services/fileService';

const Header: React.FC = () => {
  const { layoutMode, setLayoutMode, content, filePath, isDirty } = useEditorStore();
  const { widgets, toggleWidget } = useWidgetStore();
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const files = await StorageService.getRecentFiles();
      setRecentFiles(files);
    };
    fetchRecent();
  }, [filePath, isDirty]);

  const handleSave = async () => {
    if (filePath) {
      await saveFile(filePath, content);
    } else {
      await saveFileAs(content);
    }
  };

  const handleOpenRecent = async (file: RecentFile) => {
    // We would need a dedicated openRecent in fileService, but for now 
    // let's assume we can trigger a reload with the path.
    // In a real app, this would call readTextFile(file.path) and set content.
    console.log('Open recent:', file.path);
  };

  return (
    <header className="h-14 border-b border-border bg-sidebar flex items-center justify-between px-6 select-none relative z-[100]">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mr-6 group cursor-default">
          <FileText className="w-5 h-5 text-accent" />
          <span className="font-bold tracking-tight text-lg">Mdown</span>
          {isDirty && <div className="w-2 h-2 bg-accent rounded-full animate-pulse ml-1" title="Unsaved changes" />}
        </div>
        
        <div className="flex bg-background rounded-lg p-1 border border-border">
          <div className="relative group">
            <button 
              onClick={openFile}
              className="p-1.5 rounded-md text-muted-text hover:text-accent hover:bg-accent/10 transition-all flex items-center space-x-1" 
              title="Open (Cmd+O)"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            {recentFiles.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-sidebar border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <div className="text-[10px] font-bold px-2 py-1 text-muted-text uppercase tracking-widest mb-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5" /> Recent Files
                </div>
                {recentFiles.map((file, i) => (
                  <button
                    key={i}
                    onClick={() => handleOpenRecent(file)}
                    className="w-full text-left px-2 py-1.5 hover:bg-background rounded-md text-xs truncate text-muted-text hover:text-text"
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleSave}
            className="p-1.5 rounded-md text-muted-text hover:text-accent hover:bg-accent/10 transition-all" 
            title="Save (Cmd+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => exportToHTML(content)}
            className="p-1.5 rounded-md text-muted-text hover:text-accent hover:bg-accent/10 transition-all" 
            title="Export to HTML"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        
        {filePath && (
          <span className="text-[11px] text-muted-text truncate max-w-[200px] ml-4 font-mono opacity-60">
            {filePath}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex bg-background rounded-lg p-1 border border-border">
          <button
            onClick={() => setLayoutMode('editor')}
            className={`p-1.5 rounded-md transition-all ${layoutMode === 'editor' ? 'bg-accent text-white shadow-sm' : 'text-muted-text hover:text-text'}`}
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('split')}
            className={`p-1.5 rounded-md transition-all ${layoutMode === 'split' ? 'bg-accent text-white shadow-sm' : 'text-muted-text hover:text-text'}`}
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('preview')}
            className={`p-1.5 rounded-md transition-all ${layoutMode === 'preview' ? 'bg-accent text-white shadow-sm' : 'text-muted-text hover:text-text'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-border mx-2" />

        <ThemeSwitcher />

        <div className="h-6 w-[1px] bg-border mx-2" />

        <div className="relative group">
          <button className="p-1.5 rounded-full text-muted-text hover:text-text transition-all hover:bg-background">
            <Settings className="w-4 h-4" />
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-sidebar border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            <div className="text-[10px] font-bold px-2 py-1 text-muted-text uppercase tracking-widest mb-1">Widgets</div>
            {widgets.map((widget) => (
              <label key={widget.id} className="flex items-center px-2 py-1.5 hover:bg-background rounded-md cursor-pointer group/item">
                <div className={`w-3 h-3 rounded-sm border mr-2 flex items-center justify-center transition-all ${widget.enabled ? 'bg-accent border-accent' : 'border-muted-text'}`}>
                  {widget.enabled && <div className="w-1 h-1 bg-white rounded-full" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={widget.enabled}
                  onChange={() => toggleWidget(widget.id)}
                />
                <span className="text-xs transition-colors group-hover/item:text-accent">{widget.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

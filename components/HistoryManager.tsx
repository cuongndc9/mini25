import React, { useRef } from 'react';
import { HistoryEntry } from '../types';
import { DownloadIcon, UploadIcon } from './icons';

interface HistoryManagerProps {
  history: HistoryEntry[];
  setHistory: (history: HistoryEntry[]) => void;
  clearHistory: () => void;
}

const HistoryManager: React.FC<HistoryManagerProps> = ({ history, setHistory, clearHistory }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (history.length === 0) {
      alert("There's no history to export yet!");
      return;
    }
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const exportFileDefaultName = 'mini25_history.json';
    
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedHistory = JSON.parse(text);
          if (Array.isArray(importedHistory) && importedHistory.every(item => 'id' in item && 'timestamp' in item)) {
            if (window.confirm("This will overwrite your current history. Are you sure?")) {
              setHistory(importedHistory);
              alert('History imported successfully!');
            }
          } else {
            alert('Looks like that file is not in the right format.');
          }
        }
      } catch (error) {
        alert('Oops! Something went wrong reading that file.');
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const buttonBaseStyle = "flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";

  return (
    <div className="glass-pane p-6 rounded-lg mt-8">
      <h3 className="text-xl font-bold mb-4">Your Focus History</h3>
      <div className="flex flex-wrap gap-4 mb-4">
        <button onClick={handleExport} className={`${buttonBaseStyle} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400`}>
          <DownloadIcon className="w-5 h-5"/>
          <span>Export</span>
        </button>
        <button onClick={triggerFileSelect} className={`${buttonBaseStyle} bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400`}>
          <UploadIcon className="w-5 h-5"/>
          <span>Import</span>
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImport}
          className="hidden"
        />
        <button onClick={clearHistory} className={`${buttonBaseStyle} bg-slate-500 hover:bg-slate-600 text-white focus:ring-slate-400`}>
          Clear
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto pr-2 bg-[rgba(0,0,0,0.03)] rounded-lg p-2">
        <ul className="space-y-2">
          {history.length > 0 ? [...history].reverse().map(entry => (
            <li key={entry.id} className="bg-[var(--glass-bg)] p-3 rounded-md flex justify-between items-center text-sm">
              <span className="text-[var(--text-primary)] truncate pr-4">{entry.taskName || "Focus Session"}</span>
              <span className="text-[var(--text-secondary)] flex-shrink-0">{new Date(entry.timestamp).toLocaleString()}</span>
            </li>
          )) : <p className="text-[var(--text-secondary)] text-center p-4">Let's get the first session done!</p>}
        </ul>
      </div>
    </div>
  );
};

export default HistoryManager;
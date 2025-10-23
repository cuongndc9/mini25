import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { HistoryEntry } from './types';
import Timer from './components/Timer';
import Player from './components/Player';
import Dashboard from './components/Dashboard';
import HistoryManager from './components/HistoryManager';

type Tab = 'FOCUS' | 'DASHBOARD';

const App: React.FC = () => {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('pomodoroHistory', []);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('FOCUS');

  const addHistoryEntry = (taskName: string) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      taskName: taskName || 'A little focus session',
      timestamp: Date.now(),
    };
    setHistory(prevHistory => [...prevHistory, newEntry]);
    setCurrentTask(''); // Clear task after completion
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your focus history? This can't be undone.")) {
      setHistory([]);
    }
  };

  const tabButtonClasses = (tabName: Tab) =>
    `relative px-6 py-3 font-medium text-lg transition-colors focus:outline-none ${
      activeTab === tabName ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">Mini25</h1>
        <p className="text-[var(--text-secondary)] mt-3 text-lg">Your little bubble of focus.</p>
      </header>
      
      <main className="w-full max-w-xl mx-auto">
        <div className="flex justify-center border-b border-[var(--glass-border)] mb-px">
            <button onClick={() => setActiveTab('FOCUS')} className={tabButtonClasses('FOCUS')}>
              Focus
              {activeTab === 'FOCUS' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary-accent)] rounded-full"></span>}
            </button>
            <button onClick={() => setActiveTab('DASHBOARD')} className={tabButtonClasses('DASHBOARD')}>
              Progress
              {activeTab === 'DASHBOARD' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary-accent)] rounded-full"></span>}
            </button>
        </div>

        <div className="p-4 sm:p-8 glass-pane rounded-b-2xl">
          {activeTab === 'FOCUS' && (
            <div className="space-y-8">
              <div>
                  <label htmlFor="task-input" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">What's on your mind? (optional)</label>
                  <input
                    id="task-input"
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="e.g., Design the new landing page"
                    className="w-full bg-white/50 border border-[var(--glass-border)] text-[var(--text-primary)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-[var(--primary-accent)] transition placeholder:text-slate-400"
                  />
              </div>
              <Timer onPomodoroComplete={addHistoryEntry} currentTask={currentTask} />
              <Player />
            </div>
          )}

          {activeTab === 'DASHBOARD' && (
            <div>
              <Dashboard history={history} />
              <HistoryManager history={history} setHistory={setHistory} clearHistory={clearHistory} />
            </div>
          )}
        </div>
      </main>
      <footer className="mt-10 text-center text-[var(--text-secondary)] text-sm">
        <p>Designed for calm & clarity.</p>
      </footer>
    </div>
  );
};

export default App;

import { useEffect, useState } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';

function App() {
  const {
    tag,
    setTag,
    isRunning,
    mode,
    defaultWorkTime,
    defaultBreakTime,
  } = usePomodoro();

  const [activeView, setActiveView] = useState('timer'); // timer | stats

  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem("pomodoroTags")) || ["General"];
    const lastTag = localStorage.getItem("lastUsedTag");
    if (lastTag && savedTags.includes(lastTag)) {
      setTag(lastTag);
    }
  }, [setTag]);

  useEffect(() => {
    if (tag) {
      localStorage.setItem("lastUsedTag", tag);
    }
  }, [tag]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo-title">🍅 Pomodoro</h1>
      </header>

      <main className="main-content">
        {activeView === 'timer' && (
          <>
            <div className="card timer-card">
              <Timer />
            </div>

            <div className="card tagselector-card">
              <TagSelector tag={tag} setTag={setTag} />
              <p className="mode-subtitle">
                {mode === 'work'
                  ? `🎯 Enfócate en: "${tag}" (${defaultWorkTime / 60} min)`
                  : `☕ Descanso (${defaultBreakTime / 60} min)`}
              </p>
            </div>
          </>
        )}

        {activeView === 'stats' && (
          <div className="card stats-card">
            <TagStats />
          </div>
        )}
      </main>

      <footer className="bottom-nav">
        <div
          className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveView('timer')}
        >
          ⏱<span>Timer</span>
        </div>
        <div
          className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveView('stats')}
        >
          📊<span>Estadísticas</span>
        </div>
        <div className="nav-item disabled">
          ⚙️<span>Ajustes</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

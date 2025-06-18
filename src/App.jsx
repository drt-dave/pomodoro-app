import { useEffect, useState } from 'react';
import { usePomodoro } from './hooks/PomodoroContext.jsx'; // ✅ Asegúrese de que este sea el path correcto
import { Timer } from './components/Timer';
import { TagSelector } from './components/TagSelector';
import { TagStats } from './components/TagStats';
import './App.css';

// Root component that handles view switching and shared state
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

  // Restore last used tag when the app loads
  useEffect(() => {
	const savedTags = JSON.parse(localStorage.getItem("pomodoroTags")) || ["General"];
	const lastTag = localStorage.getItem("lastUsedTag");
	if (lastTag && savedTags.includes(lastTag)) {
	  setTag(lastTag);
	}
  }, [setTag]);

  // Persist the selected tag for future sessions
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
			<TagSelector tag={tag} setTag={setTag} mode={mode} />
	 	  </div>
		  </>
		)}

	{activeView === 'stats' && (
	  <div className="card stats-card">
		<TagStats />
	  </div>
	)}
	</main>

	{/* Simple navigation bar for mobile and desktop */}
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
	  {/* Settings view is not implemented yet */}
	  <div className="nav-item disabled">
		⚙️<span>Ajustes</span>
	  </div>
	</footer>
	</div>
  );
}

export default App;

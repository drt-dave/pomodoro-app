import { useEffect } from 'react';
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
    defaultBreakTime
  } = usePomodoro();

  // Cargar última etiqueta usada al iniciar
  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem("pomodoroTags")) || ["General"];
    const lastTag = localStorage.getItem("lastUsedTag");
    if (lastTag && savedTags.includes(lastTag)) {
      setTag(lastTag);
    }
  }, []);

  // Guardar última etiqueta usada
  useEffect(() => {
    if (tag) {
      localStorage.setItem("lastUsedTag", tag);
    }
  }, [tag]);

  return (
    <div className="app">
      <header>
        <h1>🍅 Pomodoro Timer</h1>
        <p className="subtitle">
          {mode === 'work' 
            ? `Enfócate en "${tag}" por ${defaultWorkTime/60} minutos`
            : `Descansa por ${defaultBreakTime/60} minutos`}
        </p>
      </header>

      <main>
        <TagSelector tag={tag} setTag={setTag} />
        <Timer />
        <TagStats />
      </main>

      <footer>
        <p>
          {isRunning 
            ? "¡En marcha! Mantén el enfoque."
            : "Selecciona una tarea y comienza cuando estés listo."}
        </p>
      </footer>
    </div>
  );
}

export default App;

import { usePomodoro } from '../hooks/usePomodoro';

export const Timer = () => {
  const {
    isRunning,
    setIsRunning,
    secondsLeft,
    setSecondsLeft,
    mode,
    switchMode,
    defaultWorkTime,
    defaultBreakTime
  } = usePomodoro();

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const secsRemaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (minutes) => {
    const secs = parseInt(minutes) * 60;
    if (!isNaN(secs)) {
      setSecondsLeft(secs);
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <h2 className={`mode-indicator ${mode}`}>
          {mode === "work" ? "🛠️ Trabajo" : "☕ Descanso"}
        </h2>
        <h1 className="time">{formatTime(secondsLeft)}</h1>
      </div>

      {!isRunning && (
        <div className="timer-controls">
          <div className="time-adjustment">
            <label>
              Minutos:
              <input
                type="number"
                min="1"
                max="60"
                value={Math.floor(secondsLeft / 60)}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={isRunning}
              />
            </label>
          </div>
          
          <div className="mode-buttons">
            <button
              onClick={() => switchMode("work")}
              className={mode === "work" ? "active" : ""}
            >
              Modo Trabajo
            </button>
            <button
              onClick={() => switchMode("break")}
              className={mode === "break" ? "active" : ""}
            >
              Modo Descanso
            </button>
          </div>
        </div>
      )}

      <button
        className={`main-button ${isRunning ? "pause" : "start"}`}
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "⏸ Pausar" : "▶ Comenzar"}
      </button>
    </div>
  );
};

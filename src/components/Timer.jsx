import { usePomodoro } from '../hooks/PomodoroContext.jsx';

/**
 * Temporizador principal de la App Pomodoro
 */
export const Timer = () => {
  const {
	isRunning,
	setIsRunning,
	secondsLeft,
	setSecondsLeft,
	mode,
	switchMode,
  } = usePomodoro();

  /**
   * Formatea los segundos como MM:SS
   * [EN] Formats seconds into MM:SS
   * [FR] Formate les secondes en MM:SS
   */
  const formatTime = (secs) => {
	const mins = Math.floor(secs / 60);
	const secsRemaining = secs % 60;

	return `${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
  };

  /**
   * Cambia el tiempo del temporizador (en minutos)
   */
  const handleMinutesInput = (minutesInput) => {
	const mins = parseInt(minutesInput, 10);
	if (!isNaN(mins) && mins > 0 && mins <= 60) {
	  setSecondsLeft(mins * 60);
	} else {
	  console.warn("Entrada inválida para minutos:", minutesInput);
	}
  };

console.log("Modo actual:", mode);
  return (
	<div className="timer-container">
	  <div className="timer-display">
		<h2 className={`mode-indicator ${mode}`}>
		  {mode === "work" ? "🛠️ Trabajo" : "☕ Descanso"}
		</h2>

		{isRunning ? (
			<h1 className="time">{formatTime(secondsLeft)}</h1>
		) : (
		<input
		  className="time-input"
		  type="number"
		  min="1"
		  max="60"
		  value={Math.floor(secondsLeft / 60)}
		  onChange={(e) => handleMinutesInput(e.target.value)}
		  aria-label="Modificar minutos del temporizador"
		/>
		)}
	</div>
	  {/* ------- */}
	  {/* Controles visibles solo si el temporizador está pausado */}
	  {!isRunning && (
		  <div className="timer-controls">

	  {/* Botones para cambiar de modo */}
	  <div className="mode-buttons">
		<button
		  onClick={() => switchMode("work")}
		  className={mode === "work" ? "active" : ""}
		  aria-label="Cambiar al modo trabajo"
		>
		  Modo Trabajo
		</button>
		<button
		  onClick={() => switchMode("break")}
		  className={mode === "break" ? "active" : ""}
		  aria-label="Cambiar al modo descanso"
		>
		  Modo Descanso
		</button>
	  </div>
	</div>
	  )}

	{/* Botón principal para iniciar/pausar */}
	<button
	  className={`main-button ${isRunning ? "pause" : "start"}`}
	  onClick={() => setIsRunning(!isRunning)}
	  aria-label={isRunning ? "Pausar temporizador" : "Iniciar temporizador"}
	>
	  {isRunning ? "⏸ Pausar" : "▶ Comenzar"}
	</button>
	</div>
  );
};

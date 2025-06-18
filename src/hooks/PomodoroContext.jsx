
// PomodoroContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { saveSession } from "../utils/storage";

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children }) => {
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [tag, setTag] = useState("General");
  const [defaultWorkTime, setDefaultWorkTime] = useState(25 * 60);
  const [defaultBreakTime, setDefaultBreakTime] = useState(5 * 60);

  // 🎯 Temporizador
  useEffect(() => {
    let interval;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode]);

  // 🔔 Alarma y cambio de modo
  const handleSessionEnd = () => {
    playAlarm();
    saveSession({
      tag: tag || "General",
      mode,
      duration: mode === "work" ? defaultWorkTime : defaultBreakTime
    });

    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    setSecondsLeft(newMode === "work" ? defaultWorkTime : defaultBreakTime);
    setIsRunning(false);
  };

  const playAlarm = () => {
    const audio = new Audio("/alarm.mp3");
    audio.play().catch(e => console.error("No se pudo reproducir audio:", e));
  };

  // ✅ Cambiar modo manualmente
  const switchMode = (newMode) => {
    if (!isRunning && ["work", "break"].includes(newMode)) {
      setMode(newMode);
      setSecondsLeft(newMode === "work" ? defaultWorkTime : defaultBreakTime);
    }
  };

  // Cambiar tiempo manualmente
  const validateAndSetTime = (secs) => {
    const validSecs = Math.max(60, Math.min(secs, 3600));
    if (!isRunning) {
      setSecondsLeft(validSecs);
      if (mode === "work") setDefaultWorkTime(validSecs);
      else setDefaultBreakTime(validSecs);
    }
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        setMode,
        switchMode,
        isRunning,
        setIsRunning,
        secondsLeft,
        setSecondsLeft: validateAndSetTime,
        tag,
        setTag,
        defaultWorkTime,
        defaultBreakTime,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

// 🧠 Hook unificado
export const usePomodoro = () => useContext(PomodoroContext);

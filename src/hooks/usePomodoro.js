import { useEffect, useState } from "react";
import { saveSession, getAvailableTags } from "../utils/storage";

export const usePomodoro = () => {
  // Estados iniciales con valores por defecto
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [tag, setTag] = useState(() => {
    const tags = getAvailableTags();
    return tags[0] || "General"; // Fallback seguro
  });
  const [defaultWorkTime, setDefaultWorkTime] = useState(25 * 60);
  const [defaultBreakTime, setDefaultBreakTime] = useState(5 * 60);

  // Efecto principal del temporizador
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

  const handleSessionEnd = () => {
    try {
      playAlarm();
      saveSession({
        tag: tag || "General", // Fallback explícito
        mode,
        duration: mode === "work" ? defaultWorkTime : defaultBreakTime
      });
      
      const newMode = mode === "work" ? "break" : "work";
      setMode(newMode);
      setSecondsLeft(newMode === "work" ? defaultWorkTime : defaultBreakTime);
      setIsRunning(false);
    } catch (error) {
      console.error("Error al finalizar sesión:", error);
    }
  };

  const playAlarm = () => {
    try {
      const audio = new Audio("/alarm.mp3");
      audio.play().catch(e => console.error("Error al reproducir:", e));
    } catch (error) {
      console.error("Error con el audio:", error);
    }
  };

  const validateAndSetTime = (secs) => {
    const validSecs = Math.max(60, Math.min(secs, 3600)); // 1-60 minutos
    if (!isRunning) {
      setSecondsLeft(validSecs);
      if (mode === "work") {
        setDefaultWorkTime(validSecs);
      } else {
        setDefaultBreakTime(validSecs);
      }
    }
  };

  const switchMode = (newMode) => {
    if (!isRunning && ["work", "break"].includes(newMode)) {
      setMode(newMode);
      setSecondsLeft(newMode === "work" ? defaultWorkTime : defaultBreakTime);
    }
  };

  return {
    isRunning,
    setIsRunning,
    secondsLeft,
    setSecondsLeft: validateAndSetTime,
    mode,
    switchMode,
    tag,
    setTag,
    defaultWorkTime,
    defaultBreakTime
  };
};

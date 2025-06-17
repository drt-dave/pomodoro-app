
// Funciones para manejar el localStorage de forma segura
// [EN] Safe localStorage access helpers
// [FR] Fonctions d'accès sécurisé à localStorage

// Devuelve las etiquetas disponibles desde localStorage o un conjunto por defecto
export const getAvailableTags = () => {
  try {
    const tags = JSON.parse(localStorage.getItem("pomodoroTags"));
    return Array.isArray(tags) && tags.length > 0
      ? tags
      : ["General", "Trabajo", "Estudio"];
  } catch (error) {
    console.warn("Error leyendo etiquetas:", error);
    return ["General", "Trabajo", "Estudio"];
  }
};

// Guarda una sesión de Pomodoro con validaciones
export const saveSession = ({ tag = "General", mode, duration }) => {
  try {
    // Validación de duración
    if (typeof duration !== "number" || duration <= 0) {
      console.error("Duración inválida:", duration);
      return;
    }

    // Validación explícita de modo
    if (!["work", "break"].includes(mode)) {
      console.error("Modo inválido:", mode);
      return;
    }

    const session = {
      tag: getAvailableTags().includes(tag) ? tag : "General",
      mode,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Agrega al historial
    const history = getSessionHistory();
    localStorage.setItem("pomodoroHistory", JSON.stringify([...history, session]));

    // Actualiza resumen por etiqueta
    const summary = getTagSummary();
    if (!summary[session.tag]) {
      summary[session.tag] = { work: 0, break: 0 };
    }
    summary[session.tag][session.mode] += session.duration;
    localStorage.setItem("tagSummary", JSON.stringify(summary));
  } catch (error) {
    console.error("Error al guardar sesión:", error);
  }
};

// Recupera historial de sesiones
export const getSessionHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem("pomodoroHistory"));
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.warn("Error leyendo historial:", error);
    return [];
  }
};

// Recupera resumen por etiqueta
export const getTagSummary = () => {
  try {
    const summary = JSON.parse(localStorage.getItem("tagSummary"));
    return summary && typeof summary === "object" ? summary : {};
  } catch (error) {
    console.warn("Error leyendo resumen:", error);
    return {};
  }
};

// Limpia todos los datos guardados
export const clearAllData = () => {
  localStorage.removeItem("pomodoroHistory");
  localStorage.removeItem("tagSummary");
  localStorage.removeItem("pomodoroTags");
};

// Funciones para manejar el localStorage de forma segura
export const getAvailableTags = () => {
  try {
    const tags = JSON.parse(localStorage.getItem("pomodoroTags"));
    return Array.isArray(tags) && tags.length > 0 ? tags : ["General", "Trabajo", "Estudio"];
  } catch {
    return ["General", "Trabajo", "Estudio"];
  }
};

export const saveSession = ({ tag = "General", mode, duration }) => {
  try {
    // Validación de datos antes de guardar
    if (typeof duration !== "number" || duration <= 0) {
      console.error("Duración inválida:", duration);
      return;
    }

    const session = {
      tag: getAvailableTags().includes(tag) ? tag : "General",
      mode: ["work", "break"].includes(mode) ? mode : "work",
      duration,
      timestamp: new Date().toISOString()
    };

    // Guardar en historial
    const history = getSessionHistory();
    localStorage.setItem("pomodoroHistory", JSON.stringify([...history, session]));

    // Actualizar resumen por etiqueta
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

export const getSessionHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem("pomodoroHistory"));
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

export const getTagSummary = () => {
  try {
    const summary = JSON.parse(localStorage.getItem("tagSummary"));
    return summary && typeof summary === "object" ? summary : {};
  } catch {
    return {};
  }
};

export const clearAllData = () => {
  localStorage.removeItem("pomodoroHistory");
  localStorage.removeItem("tagSummary");
  localStorage.removeItem("pomodoroTags");
};

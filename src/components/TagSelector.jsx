import { useState, useEffect } from "react";
import { getAvailableTags } from "../utils/storage";

/**
 * Componente para seleccionar o añadir una etiqueta de actividad
 * [EN] Tag selector for Pomodoro sessions
 * [FR] Sélecteur d’étiquettes pour les sessions Pomodoro
 */
export const TagSelector = ({ tag, setTag, mode }) => {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(getAvailableTags());
  const [error, setError] = useState("");

  // Si el tag actual no está en la lista, lo corrige
  useEffect(() => {
	if (tag && !tags.includes(tag)) {
	  setTag(tags[0] || "General");
	}
  }, [tags, tag, setTag]);

  // Capitaliza la primera letra de una etiqueta
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const handleAddTag = () => {
	const trimmedTag = newTag.trim();

	if (!trimmedTag) {
	  setError("El nombre no puede estar vacío");
	  return;
	}

	const tagToAdd = capitalize(trimmedTag);

	if (tags.includes(tagToAdd)) {
	  setError("Esta etiqueta ya existe");
	  return;
	}

	if (tagToAdd.length > 20) {
	  setError("Máximo 20 caracteres");
	  return;
	}

	const updatedTags = [...tags, tagToAdd];

	// Guarda y sincroniza
	localStorage.setItem("pomodoroTags", JSON.stringify(updatedTags));
	setTags(getAvailableTags());
	setTag(tagToAdd);
	setNewTag("");
	setError("");
  };

console.log("Modo actual:", mode);
  return (
	<div className="tag-selector">
	  <div className="tag-input-container">
		<select
		  value={tag}
		  onChange={(e) => setTag(e.target.value)}
		  className="tag-dropdown"
		>
		  {tags.map((t) => (
			  <option key={t} value={t}>{t}</option>
		  ))}
	  </select>

		<div className="add-tag-wrapper">
		  <input
			type="text"
			value={newTag}
			onChange={(e) => {
			  setNewTag(e.target.value);
			  setError("");
			}}
			onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
			placeholder="Nueva actividad"
			maxLength={20}
		  />
		  <button 
			onClick={handleAddTag}
			disabled={!newTag.trim()}
			aria-label="Añadir etiqueta"
		  >
			+
		  </button>
		</div>
	</div>

	  {error && <div className="tag-error">{error}</div>}
	  <p className="mode-subtitle">
		{mode === 'work'
		  ? `🎯 Enfócate en: "${tag}"`
		  : `🌿 Relájate con: "${tag}"`}
	  </p>
	</div>
  );
};

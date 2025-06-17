import { useState, useEffect } from "react";
import { getAvailableTags, saveSession } from "../utils/storage";

export const TagSelector = ({ tag, setTag }) => {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(getAvailableTags());
  const [error, setError] = useState("");

  useEffect(() => {
    if (tag && !tags.includes(tag)) {
      setTag(tags[0] || "General");
    }
  }, [tags, tag]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    
    if (!trimmedTag) {
      setError("El nombre no puede estar vacío");
      return;
    }
    
    if (tags.includes(trimmedTag)) {
      setError("Esta etiqueta ya existe");
      return;
    }

    if (trimmedTag.length > 20) {
      setError("Máximo 20 caracteres");
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    setTags(updatedTags);
    setTag(trimmedTag);
    localStorage.setItem("pomodoroTags", JSON.stringify(updatedTags));
    setNewTag("");
    setError("");
  };

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
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Nueva etiqueta"
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
    </div>
  );
};

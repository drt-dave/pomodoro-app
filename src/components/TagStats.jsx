import { useEffect, useState } from 'react';
import {  getSessionHistory } from '../utils/storage';

/**
 * Componente que muestra estadísticas detalladas del uso de Pomodoro
 * Incluye resumen por etiquetas e historial completo de sesiones
 */
export const TagStats = () => {
  const [summary, setSummary] = useState({});
  const [history, setHistory] = useState([]);
  const [activeView, setActiveView] = useState('summary'); // 'summary' o 'history'
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'week', 'today'

  // Cargar datos iniciales
  useEffect(() => {
    updateStats();
  }, [timeRange]);

  /**
   * Actualiza las estadísticas filtrando por rango de tiempo
   */
  const updateStats = () => {
    setIsLoading(true);
    try {
      const allHistory = getSessionHistory();
      const filteredHistory = filterByTimeRange(allHistory, timeRange);
      
      setHistory(filteredHistory);
      setSummary(calculateSummary(filteredHistory));
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtra sesiones por rango de tiempo seleccionado
   * @param {Array} sessions - Todas las sesiones
   * @param {String} range - Rango a filtrar
   * @returns {Array} Sesiones filtradas
   */
  const filterByTimeRange = (sessions, range) => {
    const now = new Date();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      
      switch(range) {
        case 'today':
          return sessionDate.toDateString() === now.toDateString();
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return sessionDate >= weekStart;
        default:
          return true;
      }
    });
  };

  /**
   * Calcula el resumen por etiqueta a partir del historial
   * @param {Array} sessions - Sesiones a procesar
   * @returns {Object} Resumen organizado por etiqueta
   */
  const calculateSummary = (sessions) => {
    return sessions.reduce((acc, session) => {
      if (!acc[session.tag]) {
        acc[session.tag] = { work: 0, break: 0 };
      }
      acc[session.tag][session.mode] += session.duration;
      return acc;
    }, {});
  };

  /**
   * Formatea segundos a minutos legibles
   * @param {Number} seconds - Tiempo en segundos
   * @returns {Number} Minutos redondeados
   */
  const toMinutes = (seconds) => Math.round(seconds / 60);

  /**
   * Formatea fecha para mostrar
   * @param {String} timestamp - Fecha ISO
   * @returns {String} Fecha formateada
   */
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div className="loading-stats">Cargando estadísticas...</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h3>📊 Estadísticas</h3>
        <div className="view-controls">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-filter"
          >
            <option value="all">Todo el tiempo</option>
            <option value="week">Esta semana</option>
            <option value="today">Hoy</option>
          </select>
          
          <div className="view-tabs">
            <button
              className={activeView === 'summary' ? 'active' : ''}
              onClick={() => setActiveView('summary')}
            >
              Resumen
            </button>
            <button
              className={activeView === 'history' ? 'active' : ''}
              onClick={() => setActiveView('history')}
            >
              Historial
            </button>
          </div>
        </div>
      </div>

      {activeView === 'summary' ? (
        <div className="summary-view">
          {Object.keys(summary).length === 0 ? (
            <p className="no-data">No hay datos para mostrar</p>
          ) : (
            <>
              <div className="total-cards">
                <div className="total-card work">
                  <span>Trabajo total</span>
                  <strong>
                    {toMinutes(Object.values(summary).reduce((sum, tag) => sum + (tag.work || 0), 0))} min
                  </strong>
                </div>
                <div className="total-card break">
                  <span>Descanso total</span>
                  <strong>
                    {toMinutes(Object.values(summary).reduce((sum, tag) => sum + (tag.break || 0), 0))} min
                  </strong>
                </div>
              </div>

              <table className="tag-table">
                <thead>
                  <tr>
                    <th>Etiqueta</th>
                    <th>Trabajo</th>
                    <th>Descanso</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary)
                    .sort((a, b) => (b[1].work + b[1].break) - (a[1].work + a[1].break))
                    .map(([tag, times]) => (
                      <tr key={tag}>
                        <td>{tag}</td>
                        <td>{toMinutes(times.work || 0)} min</td>
                        <td>{toMinutes(times.break || 0)} min</td>
                        <td>{toMinutes((times.work || 0) + (times.break || 0))} min</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ) : (
        <div className="history-view">
          {history.length === 0 ? (
            <p className="no-data">No hay sesiones registradas</p>
          ) : (
            <div className="session-list">
              {history
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((session, index) => (
                  <div key={index} className="session-card">
                    <div className={`session-type ${session.mode}`}>
                      {session.mode === 'work' ? '🛠️' : '☕'}
                    </div>
                    <div className="session-details">
                      <span className="session-tag">{session.tag}</span>
                      <span className="session-time">
                        {toMinutes(session.duration)} min
                      </span>
                      <span className="session-date">
                        {formatDate(session.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

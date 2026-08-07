import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './CrearTorneoMejorado.css';

export function CrearTorneoMejorado() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    
    // Paso 2: Configuración
    tipoTorneo: 'leagues', // 'leagues', 'elimination', 'mixed'
    categoria: '',
    maximoEquipos: 8,
    maximoGrupos: 2,
    tipoDeEvaluacion: 'points', // 'points', 'performance'
    requiereTransmision: false,
    
    // Paso 3: Árbitros
    utilizarArbitros: false,
    numeroArbitrosRequeridos: 1,
    
    // Paso 4: Revisión
    terminosAceptados: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{
          name: formData.nombre,
          description: formData.descripcion,
          tournament_start: formData.fechaInicio,
          tournament_end: formData.fechaFin,
          format: formData.tipoTorneo,
          category: formData.categoria,
          max_teams: formData.maximoEquipos,
          max_groups: formData.maximoGrupos,
          evaluation_type: formData.tipoDeEvaluacion,
          is_live_required: formData.requiereTransmision,
          status: 'draft'
        }])
        .select();

      if (error) throw error;

      const newId = data?.[0]?.id;
      setSuccess(true);
      // Nav inmediata al panel del torneo
      if (newId) navigate(`/torneo/${newId}`, { replace: true });
      else navigate('/torneos', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al crear el torneo');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.nombre && formData.fechaInicio && formData.fechaFin;
      case 2:
        return formData.tipoTorneo && formData.categoria;
      case 3:
        return !formData.utilizarArbitros || formData.numeroArbitrosRequeridos > 0;
      case 4:
        return formData.terminosAceptados;
      default:
        return false;
    }
  };

  return (
    <div className="crear-torneo-container">
      {/* Header */}
      <div className="crear-torneo-header">
        <h1>🏆 Crear Nuevo Torneo</h1>
        <p>Sigue los pasos para crear tu torneo personalizado</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`step ${step >= num ? 'active' : ''} ${step === num ? 'current' : ''}`}>
              <div className="step-number">{num}</div>
              <div className="step-label">
                {num === 1 && 'Básico'}
                {num === 2 && 'Configuración'}
                {num === 3 && 'Árbitros'}
                {num === 4 && 'Revisar'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && <div className="alert alert-error">❌ {error}</div>}
      {success && <div className="alert alert-success">✅ ¡Torneo creado exitosamente!</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="crear-torneo-form">
        {/* Paso 1: Información Básica */}
        {step === 1 && (
          <div className="form-step">
            <h2>📋 Información Básica</h2>
            
            <div className="form-group">
              <label>Nombre del Torneo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Copa de Verano 2024"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe tu torneo (formato, objetivos, etc.)"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Inicio *</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha de Fin *</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Configuración */}
        {step === 2 && (
          <div className="form-step">
            <h2>⚙️ Configuración del Torneo</h2>
            
            <div className="form-group">
              <label>Tipo de Torneo *</label>
              <select
                name="tipoTorneo"
                value={formData.tipoTorneo}
                onChange={handleChange}
              >
                <option value="leagues">Ligas (Round Robin)</option>
                <option value="elimination">Eliminación Directa</option>
                <option value="mixed">Mixto (Grupos + Eliminación)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="">Seleccionar categoría</option>
                <option value="senior">Senior (18+)</option>
                <option value="sub21">Sub-21</option>
                <option value="sub18">Sub-18</option>
                <option value="sub16">Sub-16</option>
                <option value="sub14">Sub-14</option>
                <option value="master">Master (40+)</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Máximo de Equipos</label>
                <input
                  type="number"
                  name="maximoEquipos"
                  value={formData.maximoEquipos}
                  onChange={handleChange}
                  min="2"
                  max="32"
                />
              </div>
              <div className="form-group">
                <label>Máximo de Grupos</label>
                <input
                  type="number"
                  name="maximoGrupos"
                  value={formData.maximoGrupos}
                  onChange={handleChange}
                  min="1"
                  max="8"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tipo de Evaluación</label>
              <select
                name="tipoDeEvaluacion"
                value={formData.tipoDeEvaluacion}
                onChange={handleChange}
              >
                <option value="points">Por Puntos (3V, 1E, 0D)</option>
                <option value="performance">Por Rendimiento</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="requiereTransmision"
                name="requiereTransmision"
                checked={formData.requiereTransmision}
                onChange={handleChange}
              />
              <label htmlFor="requiereTransmision">
                Requiere transmisión en vivo 📡
              </label>
            </div>
          </div>
        )}

        {/* Paso 3: Árbitros */}
        {step === 3 && (
          <div className="form-step">
            <h2>⚖️ Configuración de Árbitros</h2>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="utilizarArbitros"
                name="utilizarArbitros"
                checked={formData.utilizarArbitros}
                onChange={handleChange}
              />
              <label htmlFor="utilizarArbitros">
                Asignar árbitros a este torneo
              </label>
            </div>

            {formData.utilizarArbitros && (
              <div className="form-group">
                <label>Número de Árbitros Requeridos</label>
                <input
                  type="number"
                  name="numeroArbitrosRequeridos"
                  value={formData.numeroArbitrosRequeridos}
                  onChange={handleChange}
                  min="1"
                  max="10"
                />
                <small>Los árbitros serán solicitados a través del panel de organizador</small>
              </div>
            )}

            <div className="info-box">
              <p>💡 Los árbitros podrán ver y confirmar los partidos asignados desde su panel personal.</p>
            </div>
          </div>
        )}

        {/* Paso 4: Revisión */}
        {step === 4 && (
          <div className="form-step">
            <h2>✅ Revisar Información</h2>
            
            <div className="review-box">
              <div className="review-section">
                <h3>Información Básica</h3>
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Fechas:</strong> {formData.fechaInicio} al {formData.fechaFin}</p>
                {formData.descripcion && <p><strong>Descripción:</strong> {formData.descripcion}</p>}
              </div>

              <div className="review-section">
                <h3>Configuración</h3>
                <p><strong>Tipo:</strong> {formData.tipoTorneo === 'leagues' ? 'Ligas' : formData.tipoTorneo === 'elimination' ? 'Eliminación' : 'Mixto'}</p>
                <p><strong>Categoría:</strong> {formData.categoria}</p>
                <p><strong>Equipos:</strong> Máx. {formData.maximoEquipos}</p>
                <p><strong>Grupos:</strong> Máx. {formData.maximoGrupos}</p>
                {formData.requiereTransmision && <p><strong>Transmisión:</strong> Requerida 📡</p>}
              </div>

              {formData.utilizarArbitros && (
                <div className="review-section">
                  <h3>Árbitros</h3>
                  <p><strong>Árbitros Requeridos:</strong> {formData.numeroArbitrosRequeridos}</p>
                </div>
              )}
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="terminos"
                name="terminosAceptados"
                checked={formData.terminosAceptados}
                onChange={handleChange}
              />
              <label htmlFor="terminos">
                Acepto los términos y condiciones del torneo *
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              ← Atrás
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed() || loading}
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success"
              disabled={!canProceed() || loading}
            >
              {loading ? 'Creando...' : '🚀 Crear Torneo'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CrearTorneoMejorado;

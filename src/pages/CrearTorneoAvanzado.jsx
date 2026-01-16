import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const COUNTRIES = ['Colombia', 'Argentina', 'Brasil', 'Mexico', 'España', 'USA'];
const CATEGORIES = [
  'Masculino', 'Femenino', 'Mixto', 
  'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20',
  'Libre', 'Veteranos', 'Amateur', 'Profesional'
];
const TOURNAMENT_FORMATS = [
  { value: 'league', label: 'Liga (todos contra todos)' },
  { value: 'knockout', label: 'Eliminación Directa (Llaves)' },
  { value: 'group_knockout', label: 'Grupos + Eliminación Directa' },
  { value: 'repechaje', label: 'Con Repechaje (mejor tercero)' },
  { value: 'sudden_death', label: 'Muerte Súbita' }
];
const PLAYOFF_TYPES = [
  { value: 'standard', label: 'Clásico (Victoria=3pts, Empate=1pt, Derrota=0)' },
  { value: 'no_draw', label: 'Sin Empate (Penaltis definen ganador)' }
];
const CURRENCIES = ['USD', 'EUR', 'COP', 'ARS', 'BRL', 'MXN'];

export default function CrearTorneoAvanzado() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Masculino',
    min_age: 0,
    max_age: 100,
    max_teams: 8,
    max_players_per_team: 11,
    location: '',
    country: 'Colombia',
    registration_type: 'free',
    registration_fee: 0,
    currency: 'USD',
    tournament_format: 'league',
    playoff_type: 'standard',
    start_date: '',
    end_date: '',
    rules: '',
    is_live_required: false,
    schedule: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user?.id) throw new Error('Debes estar autenticado');
      if (!form.name || !form.location) throw new Error('Completa campos requeridos');

      // 1. Crear torneo
      const { data: tournament, error: insertErr } = await supabase
        .from('tournaments')
        .insert([{
          creator_id: user.id,
          name: form.name,
          description: form.description,
          category: form.category,
          min_age: form.min_age,
          max_age: form.max_age,
          max_teams: form.max_teams,
          max_players_per_team: form.max_players_per_team,
          location: form.location,
          country: form.country,
          registration_type: form.registration_type,
          registration_fee: form.registration_fee,
          currency: form.currency,
          tournament_format: form.tournament_format,
          playoff_type: form.playoff_type,
          status: 'draft',
          start_date: form.start_date,
          end_date: form.end_date,
          rules: form.rules,
          is_live_required: form.is_live_required
        }])
        .select();

      if (insertErr) throw insertErr;

      setSuccess('✅ ¡Torneo creado exitosamente!');
      setTimeout(() => {
        navigate(`/torneo/${tournament[0].id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      padding: 32,
      color: '#FFD700'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/torneos')}
          style={{ background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20 }}
        >
          ← Volver
        </button>

        <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 32 }}>🏆 Crear Torneo Profesional</h1>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} onClick={() => setStep(s)} style={{
              flex: 1,
              height: 8,
              background: s <= step ? '#FFD700' : '#333',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* PASO 1: Información Básica */}
          {step === 1 && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>📝 Información Básica</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Nombre del Torneo *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Copa Libertadores 2026"
                  style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe tu torneo, objetivos, etc."
                  style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, minHeight: 100 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Categoría *</label>
                  <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Límite de Edad</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" name="min_age" value={form.min_age} onChange={handleChange} placeholder="Min" min="0" max="100" style={{ flex: 1, padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                    <input type="number" name="max_age" value={form.max_age} onChange={handleChange} placeholder="Max" min="0" max="100" style={{ flex: 1, padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Configuración de Equipos y Ubicación */}
          {step === 2 && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>⚽ Configuración del Torneo</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Máximo de Equipos *</label>
                  <input type="number" name="max_teams" value={form.max_teams} onChange={handleChange} min="2" max="128" style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Jugadores por Equipo *</label>
                  <select name="max_players_per_team" value={form.max_players_per_team} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                    <option value="5">5 (Futsal/Micro)</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11 (Fútbol completo)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Ubicación (Dirección) *</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ciudad/Dirección del torneo"
                  style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>País</label>
                <select name="country" value={form.country} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Formato de Torneo</label>
                  <select name="tournament_format" value={form.tournament_format} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                    {TOURNAMENT_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                {form.tournament_format !== 'league' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tipo de Clasificación</label>
                    <select name="playoff_type" value={form.playoff_type} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                      {PLAYOFF_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 3: Inscripciones y Fechas */}
          {step === 3 && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>💳 Inscripciones y Fechas</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tipo de Inscripción</label>
                <select name="registration_type" value={form.registration_type} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                  <option value="free">Gratuita</option>
                  <option value="paid_usd">Pagada (USD)</option>
                  <option value="paid_eur">Pagada (EUR)</option>
                  <option value="paid_cop">Pagada (COP)</option>
                </select>
              </div>

              {form.registration_type !== 'free' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tarifa de Inscripción</label>
                    <input type="number" name="registration_fee" value={form.registration_fee} onChange={handleChange} min="0" step="0.01" style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Moneda</label>
                    <select name="currency" value={form.currency} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Fecha de Inicio</label>
                  <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Fecha de Fin</label>
                  <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8 }} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8, fontWeight: 'bold' }}>
                  <input type="checkbox" name="is_live_required" checked={form.is_live_required} onChange={handleChange} />
                  <span>Requerir transmisión en vivo para validar partidos</span>
                </label>
              </div>
            </div>
          )}

          {/* PASO 4: Reglas y Confirmación */}
          {step === 4 && (
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>📋 Reglas y Confirmación</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Reglas del Torneo</label>
                <textarea
                  name="rules"
                  value={form.rules}
                  onChange={handleChange}
                  placeholder="Define las reglas específicas de tu torneo..."
                  style={{ width: '100%', padding: 12, background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, minHeight: 150 }}
                />
              </div>

              {/* Resumen */}
              <div style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)', padding: 16, borderRadius: 12, border: '1px solid #FFD700', marginBottom: 16 }}>
                <h3 style={{ marginBottom: 12 }}>📊 Resumen del Torneo</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
                  <div><strong>Nombre:</strong> {form.name}</div>
                  <div><strong>Categoría:</strong> {form.category}</div>
                  <div><strong>Ubicación:</strong> {form.location}, {form.country}</div>
                  <div><strong>Máx Equipos:</strong> {form.max_teams}</div>
                  <div><strong>Formato:</strong> {TOURNAMENT_FORMATS.find(f => f.value === form.tournament_format)?.label}</div>
                  <div><strong>Inscripción:</strong> {form.registration_type === 'free' ? 'Gratuita' : `${form.registration_fee} ${form.currency}`}</div>
                </div>
              </div>
            </div>
          )}

          {/* Errores y Mensajes */}
          {error && <div style={{ background: '#ff6b6b', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 }}>❌ {error}</div>}
          {success && <div style={{ background: '#2ecc71', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 }}>✅ {success}</div>}

          {/* Botones de Navegación */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              style={{ background: step === 1 ? '#666' : '#3498db', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 'bold', cursor: step === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Anterior
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(Math.min(4, step + 1))}
                style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#666' : '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 40px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16 }}
              >
                {loading ? '⏳ Creando...' : '✅ Crear Torneo'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

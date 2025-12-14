import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { MatchParticipationService } from '../services/MatchParticipationService';

export default function Amistoso() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    duracion: '90',
    notas: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [weeklyStats, setWeeklyStats] = useState({ count: 0, remaining: 2 });

  useEffect(() => {
    loadEquipos();
    checkWeeklyLimit();
  }, [user]);

  const checkWeeklyLimit = async () => {
    if (!user?.email) return;
    
    const result = await MatchParticipationService.canPlayFriendly(user.email);
    setWeeklyStats({
      count: result.count,
      remaining: result.remaining
    });
  };

  const loadEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');

      if (data) {
        setEquipos(data);
      }
    } catch (err) {
      console.log('Error cargando equipos:', err);
      // Equipos de ejemplo
      setEquipos([
        { id: 1, name: 'FutPro FC' },
        { id: 2, name: 'Stars United' },
        { id: 3, name: 'Golden Team' },
        { id: 4, name: 'Champions FC' }
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!form.equipoLocal || !form.equipoVisitante || !form.fecha || !form.hora || !form.ubicacion) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    if (form.equipoLocal === form.equipoVisitante) {
      setError('El equipo local y visitante no pueden ser el mismo');
      setLoading(false);
      return;
    }

    // Verificar límite semanal del usuario actual
    if (user?.email) {
      const canPlay = await MatchParticipationService.canPlayFriendly(user.email);
      if (!canPlay.canPlay) {
        setError(`Ya has jugado ${canPlay.count} amistosos esta semana. El límite es 2 amistosos por semana. Podrás jugar nuevamente después de 7 días desde tu primer partido.`);
        setLoading(false);
        return;
      }
    }

    try {
      const fechaHora = `${form.fecha}T${form.hora}:00`;

      const { data, error: supabaseError } = await supabase
        .from('matches')
        .insert([{
          home_team_id: parseInt(form.equipoLocal),
          away_team_id: parseInt(form.equipoVisitante),
          match_date: fechaHora,
          location: form.ubicacion,
          duration_minutes: parseInt(form.duracion),
          type: 'amistoso',
          notes: form.notas,
          status: 'scheduled',
          organizer_email: user?.email,
          created_at: new Date().toISOString()
        }])
        .select();

      if (supabaseError) throw supabaseError;

      // Registrar participación automática del organizador
      if (data && data[0] && user?.email) {
        await MatchParticipationService.registerParticipations(
          data[0].id,
          [{ email: user.email, teamId: form.equipoLocal }],
          2 // +2 puntos por amistoso
        );
      }

      setSuccess('¡Amistoso creado exitosamente! Has ganado +2 puntos para tu Card FIFA 🎴');
      
      // Actualizar contador semanal
      await checkWeeklyLimit();
      
      setTimeout(() => {
        navigate('/partidos');
      }, 3000);
    } catch (err) {
      console.error('Error creando amistoso:', err);
      setError('Error al crear el amistoso. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            🤝 Crear Amistoso
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px' }}>
            Organiza un partido amistoso entre equipos
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff88',
              borderRadius: '20px',
              padding: '8px 16px'
            }}>
              <span style={{ fontSize: '24px' }}>🎴</span>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>+2 Puntos Card FIFA</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: weeklyStats.remaining === 0 ? 'rgba(255,51,102,0.1)' : 'rgba(0,204,255,0.1)',
              border: `1px solid ${weeklyStats.remaining === 0 ? '#ff3366' : '#00ccff'}`,
              borderRadius: '20px',
              padding: '8px 16px'
            }}>
              <span style={{ fontSize: '24px' }}>📅</span>
              <span style={{ 
                color: weeklyStats.remaining === 0 ? '#ff3366' : '#00ccff', 
                fontWeight: 'bold' 
              }}>
                {weeklyStats.remaining === 0 
                  ? 'Límite alcanzado (2/2)' 
                  : `Disponibles: ${weeklyStats.remaining}/2 esta semana`}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#181818',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {/* Equipos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                🏠 Equipo Local *
              </label>
              <select
                name="equipoLocal"
                value={form.equipoLocal}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="">Selecciona equipo local</option>
                {equipos.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                ✈️ Equipo Visitante *
              </label>
              <select
                name="equipoVisitante"
                value={form.equipoVisitante}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="">Selecciona equipo visitante</option>
                {equipos.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                📅 Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                🕐 Hora *
              </label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                ⏱️ Duración (min)
              </label>
              <input
                type="number"
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                min="45"
                max="120"
                step="15"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              📍 Ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Estadio, dirección completa"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Notas */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              📝 Notas (Opcional)
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Reglas especiales, detalles adicionales..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              background: '#ff3366',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#00ff88',
              color: '#000',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {success}
            </div>
          )}

          {/* Info Box */}
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid #FFD700',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#aaa'
          }}>
            💡 <strong style={{ color: '#FFD700' }}>Consejo:</strong> Los partidos amistosos son perfectos para practicar estrategias, probar nuevos jugadores y divertirse sin presión competitiva.
          </div>

          {/* Reglas de Amistosos */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,204,255,0.1))',
            border: '1px solid #00ff88',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>
              ⭐ Beneficios y Reglas de Amistosos
            </div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎴</span>
                <span>
                  <strong style={{ color: '#FFD700' }}>+2 Puntos en Card FIFA:</strong> {' '}
                  <span style={{ color: '#aaa' }}>Cada jugador que participe suma 2 puntos a su tarjeta</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📅</span>
                <span>
                  <strong style={{ color: '#FFD700' }}>Límite Semanal:</strong> {' '}
                  <span style={{ color: '#aaa' }}>Máximo 2 amistosos por jugador cada semana</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>💪</span>
                <span>
                  <strong style={{ color: '#FFD700' }}>Sin Presión:</strong> {' '}
                  <span style={{ color: '#aaa' }}>Mejora habilidades sin afectar ranking competitivo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/partidos')}
              style={{
                background: '#333',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#666' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(255,215,0,0.3)'
              }}
            >
              {loading ? 'Creando...' : 'Crear Amistoso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

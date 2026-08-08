import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function CrearTorneo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'liga',
    categoria: 'masculina',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    maxEquipos: 8,
    premio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    if (!form.nombre || !form.fechaInicio || !form.ubicacion) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('tournaments')
        .insert([{
          name: form.nombre,
          description: form.descripcion,
          type: form.tipo,
          category: form.categoria,
          start_date: form.fechaInicio,
          end_date: form.fechaFin || null,
          location: form.ubicacion,
          max_teams: parseInt(form.maxEquipos),
          prize: form.premio,
          organizer_email: user?.email,
          status: 'upcoming',
          created_at: new Date().toISOString()
        }])
        .select();

      if (supabaseError) throw supabaseError;

      setSuccess('¡Torneo creado exitosamente!');
      setTimeout(() => {
        navigate('/torneos');
      }, 2000);
    } catch (err) {
      console.error('Error creando torneo:', err);
      setError('Error al crear el torneo. Intenta nuevamente.');
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
            🏆 Crear Torneo
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px' }}>
            Organiza tu propio torneo de fútbol
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#181818',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {/* Nombre */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Nombre del Torneo *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ejemplo: Copa FutPro 2025"
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

          {/* Descripción */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el torneo, reglas, premios..."
              rows={4}
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

          {/* Grid 2 columnas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Tipo */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                Tipo de Torneo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
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
                <option value="liga">Liga</option>
                <option value="copa">Copa (Eliminación Directa)</option>
                <option value="grupos">Fase de Grupos</option>
                <option value="mixto">Mixto (Grupos + Eliminación)</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                Categoría
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
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
                <option value="masculina">Masculina</option>
                <option value="femenina">Femenina</option>
                <option value="mixta">Mixta</option>
                <option value="infantil_masculina">Infantil Masculina</option>
                <option value="infantil_femenina">Infantil Femenina</option>
              </select>
            </div>
          </div>

          {/* Fechas */}
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
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
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
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
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

          {/* Ubicación y Max Equipos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
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
                Ubicación *
              </label>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ciudad, País"
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
                Max Equipos
              </label>
              <input
                type="number"
                name="maxEquipos"
                value={form.maxEquipos}
                onChange={handleChange}
                min="4"
                max="32"
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

          {/* Premio */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              marginBottom: '8px',
              fontWeight: 'bold'
            }}>
              Premio (Opcional)
            </label>
            <input
              type="text"
              name="premio"
              value={form.premio}
              onChange={handleChange}
              placeholder="Ejemplo: $5000 USD, Trofeo de Oro, etc."
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

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/torneos')}
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
              {loading ? 'Creando...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

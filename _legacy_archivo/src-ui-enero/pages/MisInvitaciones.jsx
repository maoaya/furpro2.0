import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import InvitacionesService from '../services/InvitacionesService';

const MisInvitaciones = () => {
  const { user } = useAuth();
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarInvitaciones();
  }, [user?.id]);

  const cargarInvitaciones = async () => {
    setLoading(true);
    try {
      const data = await InvitacionesService.getMisInvitaciones(user.id);
      setInvitaciones(data);
    } catch (err) {
      setError('Error cargando invitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aceptarInvitacion = async (invitacionId) => {
    setError('');
    setSuccess('');
    try {
      await InvitacionesService.aceptarInvitacion(invitacionId, user.id);
      setSuccess('✅ Invitación aceptada');
      setTimeout(() => cargarInvitaciones(), 500);
    } catch (err) {
      setError('Error aceptando invitación');
      console.error(err);
    }
  };

  const rechazarInvitacion = async (invitacionId) => {
    setError('');
    setSuccess('');
    try {
      await InvitacionesService.rechazarInvitacion(invitacionId);
      setSuccess('✅ Invitación rechazada');
      setTimeout(() => cargarInvitaciones(), 500);
    } catch (err) {
      setError('Error rechazando invitación');
      console.error(err);
    }
  };

  const pendientes = invitaciones.filter(i => i.status === 'pending');
  const aceptadas = invitaciones.filter(i => i.status === 'accepted');
  const rechazadas = invitaciones.filter(i => i.status === 'rejected');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '20px',
      color: '#fff'
    }}>
      <h1 style={{ color: '#FFD700', marginBottom: 24, textAlign: 'center' }}>
        📮 Mis Invitaciones a Equipos
      </h1>

      {error && (
        <div style={{
          background: '#FF6B6B',
          color: '#fff',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#2ecc71',
          color: '#000',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: '#FFD700', padding: 40 }}>
          ⚽ Cargando invitaciones...
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* PENDIENTES */}
          {pendientes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#FFD700', marginBottom: 16, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⏳ Pendientes de respuesta ({pendientes.length})
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {pendientes.map(inv => (
                  <div
                    key={inv.id}
                    style={{
                      background: 'rgba(24,24,24,0.9)',
                      border: '2px solid #FFD700',
                      borderRadius: 12,
                      padding: 16,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 16
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#FFD700' }}>
                        {inv.team?.name || 'Equipo'}
                      </div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                        📊 Campeonato: <strong>{inv.championship_type}</strong>
                      </div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                        👥 Categoría: <strong>{inv.category || '—'}</strong>
                      </div>
                      {inv.max_age && (
                        <div style={{ fontSize: 13, color: '#888' }}>
                          🎂 Edad máx: <strong>{inv.max_age} años</strong>
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
                        {new Date(inv.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'space-between' }}>
                      <button
                        onClick={() => aceptarInvitacion(inv.id)}
                        style={{
                          background: '#2ecc71',
                          color: '#000',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        ✅ Aceptar
                      </button>
                      <button
                        onClick={() => rechazarInvitacion(inv.id)}
                        style={{
                          background: '#FF6B6B',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACEPTADAS */}
          {aceptadas.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#2ecc71', marginBottom: 16, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✅ Aceptadas ({aceptadas.length})
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {aceptadas.map(inv => (
                  <div
                    key={inv.id}
                    style={{
                      background: 'rgba(46,204,113,0.1)',
                      border: '2px solid #2ecc71',
                      borderRadius: 12,
                      padding: 16
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: 16, color: '#2ecc71', marginBottom: 8 }}>
                      {inv.team?.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      📊 {inv.championship_type} • 👥 {inv.category} • 
                      <span style={{ color: '#2ecc71', fontWeight: 'bold' }}> Miembro desde {new Date(inv.responded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECHAZADAS */}
          {rechazadas.length > 0 && (
            <div>
              <h2 style={{ color: '#888', marginBottom: 16, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                ❌ Rechazadas ({rechazadas.length})
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {rechazadas.map(inv => (
                  <div
                    key={inv.id}
                    style={{
                      background: 'rgba(100,100,100,0.1)',
                      border: '1px solid #555',
                      borderRadius: 12,
                      padding: 16
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: 14, color: '#888', marginBottom: 4 }}>
                      {inv.team?.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      Rechazada el {new Date(inv.responded_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invitaciones.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 40,
              background: 'rgba(255,215,0,0.05)',
              borderRadius: 12,
              border: '1px solid #FFD700',
              color: '#888'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <div>No tienes invitaciones a equipos aún.</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Los equipos pueden invitarte a través de la función de convocatoria.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MisInvitaciones;

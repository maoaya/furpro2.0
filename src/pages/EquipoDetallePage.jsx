import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function EquipoDetallePage() {
  const { id: teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const { data, error: teamErr } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
      
      if (teamErr) throw teamErr;
      setTeam(data);
      setIsOwner(user?.id === data.captain_id);

      // Cargar miembros
      const { data: membersData } = await supabase
        .from('team_invitations')
        .select('*, player:invited_player_id(nombre, apellido, avatar_url, posicion)')
        .eq('team_id', teamId)
        .eq('status', 'accepted');
      
      setMembers(membersData || []);
    } catch (err) {
      console.error('Error cargando equipo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 24 }}>⏳ Cargando...</div>
    </div>
  );

  if (error || !team) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#FFD700', padding: 32, textAlign: 'center' }}>
      <h1>❌ Error</h1>
      <p style={{ color: '#ff6b6b', marginBottom: 20 }}>{error || 'Equipo no encontrado'}</p>
      <button onClick={() => navigate('/equipos')} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer' }}>
        Volver a equipos
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', color: '#FFD700', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <button onClick={() => navigate('/equipos')} style={{ background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20 }}>
          ← Volver
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 24, marginBottom: 32 }}>
          {/* Logo y Nombre */}
          <div style={{ textAlign: 'center' }}>
            {team.logo_url && (
              <img src={team.logo_url} alt={team.name} style={{ width: 200, height: 200, borderRadius: 12, objectFit: 'cover', border: '3px solid #FFD700', marginBottom: 16 }} />
            )}
            <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>{team.name}</h1>
            <div style={{ fontSize: 14, color: '#FFD70099' }}>
              {team.city}, {team.country}
            </div>
          </div>

          {/* Detalles */}
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>📊 Información del Equipo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: '#FFD70099', fontSize: 12 }}>FORMATO</label>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{team.format || 'N/A'}</div>
              </div>
              <div>
                <label style={{ color: '#FFD70099', fontSize: 12 }}>NIVEL</label>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{team.level || 'N/A'}</div>
              </div>
              <div>
                <label style={{ color: '#FFD70099', fontSize: 12 }}>MÁXIMO DE JUGADORES</label>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{team.max_members || 11}</div>
              </div>
              <div>
                <label style={{ color: '#FFD70099', fontSize: 12 }}>MIEMBROS ACTUALES</label>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{members.length}</div>
              </div>
            </div>
            {team.description && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #FFD700' }}>
                <label style={{ color: '#FFD70099', fontSize: 12 }}>DESCRIPCIÓN</label>
                <p>{team.description}</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>⚙️ Acciones</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isOwner ? (
                <>
                  <button onClick={() => navigate(`/convocar-jugadores/${teamId}`)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🎯 Convocar Jugadores
                  </button>
                  <button onClick={() => navigate(`/equipo/${teamId}/plantilla`)} style={{ background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ⚽ Ver Plantilla
                  </button>
                  <button onClick={() => navigate(`/equipo/${teamId}/editar`)} style={{ background: '#f39c12', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ✏️ Editar Equipo
                  </button>
                </>
              ) : (
                <>
                  <button style={{ background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📲 Pedir Invitación
                  </button>
                  <button onClick={() => navigate(`/perfil/${team.captain_id}`)} style={{ background: '#9b59b6', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    👤 Ver Capitán
                  </button>
                </>
              )}
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
                📤 Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Plantilla de jugadores */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 12, border: '1px solid #FFD700' }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>👥 Jugadores ({members.length}/{team.max_members || 11})</h2>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#FFD70099', padding: 32 }}>
              No hay jugadores aún
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
              {members.map((inv) => (
                <div key={inv.id} style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)', padding: 16, borderRadius: 12, textAlign: 'center', border: '1px solid rgba(255,215,0,0.3)' }}>
                  {inv.player?.avatar_url && (
                    <img src={inv.player.avatar_url} alt="" style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #FFD700', marginBottom: 12 }} />
                  )}
                  <div style={{ fontWeight: 'bold' }}>{inv.player?.nombre || '?'} {inv.player?.apellido || ''}</div>
                  <div style={{ fontSize: 12, color: '#FFD70099' }}>{inv.player?.posicion || 'N/A'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
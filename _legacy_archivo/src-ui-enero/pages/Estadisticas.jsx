import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function Estadisticas() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    partidos: 0,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0,
    ovr: 75,
    victorias: 0,
    derrotas: 0,
    empates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('stats, ovr, goles, asistencias, partidos')
        .eq('email', user.email)
        .single();

      if (data) {
        setStats({
          partidos: data.partidos || 0,
          goles: data.goles || 0,
          asistencias: data.asistencias || 0,
          tarjetasAmarillas: data.stats?.tarjetas_amarillas || 0,
          tarjetasRojas: data.stats?.tarjetas_rojas || 0,
          ovr: data.ovr || 75,
          victorias: data.stats?.victorias || 0,
          derrotas: data.stats?.derrotas || 0,
          empates: data.stats?.empates || 0
        });
      }
    } catch (err) {
      console.log('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, color = '#FFD700' }) => (
    <div style={{
      background: '#181818',
      border: `2px solid ${color}`,
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      minWidth: '150px',
      boxShadow: `0 0 20px ${color}40`
    }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max = 100, color = '#FFD700' }) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#fff', fontSize: '14px' }}>{label}</span>
        <span style={{ color, fontWeight: 'bold' }}>{value}</span>
      </div>
      <div style={{
        background: '#0a0a0a',
        height: '12px',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        <div style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          height: '100%',
          width: `${(value / max) * 100}%`,
          transition: 'width 0.3s ease',
          boxShadow: `0 0 10px ${color}`
        }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#FFD700' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
        <div style={{ fontSize: '18px' }}>Cargando estadísticas...</div>
      </div>
    );
  }

  const winRate = stats.partidos > 0 
    ? Math.round((stats.victorias / stats.partidos) * 100) 
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '48px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          📊 Mis Estadísticas
        </h1>
        <p style={{ color: '#aaa', fontSize: '16px' }}>
          {user?.email || 'Usuario'}
        </p>
      </div>

      {/* OVR Principal */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        borderRadius: '24px',
        padding: '48px',
        textAlign: 'center',
        marginBottom: '48px',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
      }}>
        <div style={{ fontSize: '96px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
          {stats.ovr}
        </div>
        <div style={{ fontSize: '24px', color: '#000', fontWeight: '500' }}>
          OVR OVERALL
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <StatCard icon="⚽" label="Goles" value={stats.goles} color="#00ff88" />
        <StatCard icon="🎯" label="Asistencias" value={stats.asistencias} color="#00ccff" />
        <StatCard icon="🏟️" label="Partidos" value={stats.partidos} color="#FFD700" />
        <StatCard icon="🏆" label="Victorias" value={stats.victorias} color="#ff9500" />
        <StatCard icon="🟨" label="T. Amarillas" value={stats.tarjetasAmarillas} color="#ffdd00" />
        <StatCard icon="🟥" label="T. Rojas" value={stats.tarjetasRojas} color="#ff3366" />
      </div>

      {/* Progreso */}
      <div style={{
        background: '#181818',
        borderRadius: '16px',
        padding: '32px',
        border: '2px solid #FFD700',
        marginBottom: '48px'
      }}>
        <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '24px' }}>
          📈 Progreso y Rendimiento
        </h2>
        <ProgressBar label="Velocidad" value={85} color="#00ff88" />
        <ProgressBar label="Tiro" value={stats.ovr} color="#ff9500" />
        <ProgressBar label="Pase" value={stats.ovr - 5} color="#00ccff" />
        <ProgressBar label="Regate" value={stats.ovr + 3} color="#ff3366" />
        <ProgressBar label="Defensa" value={stats.ovr - 10} color="#9966ff" />
        <ProgressBar label="Físico" value={stats.ovr} color="#FFD700" />
      </div>

      {/* Win Rate */}
      <div style={{
        background: '#181818',
        borderRadius: '16px',
        padding: '32px',
        border: '2px solid #00ff88',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#00ff88', marginBottom: '8px' }}>
          {winRate}%
        </div>
        <div style={{ fontSize: '18px', color: '#aaa' }}>
          Tasa de Victoria
        </div>
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
          <div>
            <div style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.victorias}
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Ganados</div>
          </div>
          <div>
            <div style={{ color: '#ffdd00', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.empates}
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Empates</div>
          </div>
          <div>
            <div style={{ color: '#ff3366', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.derrotas}
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Perdidos</div>
          </div>
        </div>
      </div>
    </div>
  );
}

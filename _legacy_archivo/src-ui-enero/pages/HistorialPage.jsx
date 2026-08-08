import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HistorialPage() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de historial desde localStorage o API
    const cargarHistorial = () => {
      const historialGuardado = JSON.parse(localStorage.getItem('futpro_historial') || '[]');
      setHistorial(historialGuardado);
      setLoading(false);
    };

    cargarHistorial();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: '#181818',
        color: '#FFD700',
        minHeight: '100vh',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📈</div>
          <h2>Cargando historial...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#181818',
      color: '#FFD700',
      minHeight: '100vh',
      padding: '32px'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        📈 Historial de Partidos
      </h2>

      {historial.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#232323',
          borderRadius: '12px',
          border: '2px solid #FFD700'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚽</div>
          <h3 style={{ marginBottom: '16px' }}>No hay partidos registrados</h3>
          <p style={{ color: '#ccc' }}>
            Tus partidos jugados aparecerán aquí una vez que completes algunos encuentros.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {historial.map((partido, index) => (
            <div key={index} style={{
              background: '#232323',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #FFD700',
              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {partido.equipo1} vs {partido.equipo2}
                </h3>
                <span style={{
                  background: partido.resultado === 'victoria' ? '#4CAF50' :
                             partido.resultado === 'derrota' ? '#F44336' : '#FF9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {partido.resultado?.toUpperCase() || 'PENDIENTE'}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                fontSize: '14px'
              }}>
                <div>
                  <strong>Fecha:</strong> {partido.fecha || 'No especificada'}
                </div>
                <div>
                  <strong>Marcador:</strong> {partido.marcador || 'No disponible'}
                </div>
                <div>
                  <strong>Torneo:</strong> {partido.torneo || 'Amistoso'}
                </div>
                <div>
                  <strong>Duración:</strong> {partido.duracion || '90 min'}
                </div>
              </div>

              {partido.estadisticas && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #444' }}>
                  <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Estadísticas:</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    {partido.estadisticas.goles && <div>Goles: {partido.estadisticas.goles}</div>}
                    {partido.estadisticas.asistencias && <div>Asistencias: {partido.estadisticas.asistencias}</div>}
                    {partido.estadisticas.amarillas && <div>🟨 {partido.estadisticas.amarillas}</div>}
                    {partido.estadisticas.rojas && <div>🟥 {partido.estadisticas.rojas}</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

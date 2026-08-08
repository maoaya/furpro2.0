import React, { useState } from 'react';
import RankingJugadores from './RankingJugadores.jsx';
import RankingCampeonatos from './RankingCampeonatos.jsx';

export default function RankingDashboard() {
  const [activeTab, setActiveTab] = useState('jugadores');

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    border: 'none',
    background: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 20px 0', 
            color: '#333',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            🏆 Sistema de Rankings FutPro
          </h1>
          <p style={{ 
            margin: '0', 
            color: '#666',
            fontSize: '1.1rem'
          }}>
            Consulta los rankings de jugadores y campeonatos con filtros avanzados
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '2px',
          marginBottom: '0'
        }}>
          <button
            onClick={() => setActiveTab('jugadores')}
            style={tabStyle(activeTab === 'jugadores')}
          >
            👨‍⚽ Ranking de Jugadores
          </button>
          <button
            onClick={() => setActiveTab('campeonatos')}
            style={tabStyle(activeTab === 'campeonatos')}
          >
            🏆 Ranking de Campeonatos
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        background: 'white',
        borderRadius: '0 8px 8px 8px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {activeTab === 'jugadores' && <RankingJugadores />}
        {activeTab === 'campeonatos' && <RankingCampeonatos />}
      </div>

      {/* Footer Info */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '40px auto 0', 
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>
          💡 <strong>Tip:</strong> Usa los filtros para encontrar exactamente lo que buscas. 
          Los rankings se actualizan en tiempo real basados en el rendimiento y engagement.
        </p>
      </div>
    </div>
  );
}
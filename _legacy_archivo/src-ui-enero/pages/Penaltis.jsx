import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Penaltis() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [showTutorial, setShowTutorial] = useState(true);
  const [score, setScore] = useState({ goles: 0, fallos: 0 });
  const [currentShot, setCurrentShot] = useState(1);
  const [totalShots] = useState(5);
  const [selectedZone, setSelectedZone] = useState(null);
  const [porteroZone, setPorteroZone] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({
    partidasJugadas: 0,
    golesAnotados: 0,
    tirosEfectividad: 0
  });

  const zones = [
    { id: 1, name: 'Superior Izquierda', emoji: '↖️', x: 20, y: 20 },
    { id: 2, name: 'Superior Centro', emoji: '⬆️', x: 50, y: 20 },
    { id: 3, name: 'Superior Derecha', emoji: '↗️', x: 80, y: 20 },
    { id: 4, name: 'Medio Izquierda', emoji: '⬅️', x: 20, y: 50 },
    { id: 5, name: 'Centro', emoji: '⚫', x: 50, y: 50 },
    { id: 6, name: 'Medio Derecha', emoji: '➡️', x: 80, y: 50 },
    { id: 7, name: 'Inferior Izquierda', emoji: '↙️', x: 20, y: 80 },
    { id: 8, name: 'Inferior Centro', emoji: '⬇️', x: 50, y: 80 },
    { id: 9, name: 'Inferior Derecha', emoji: '↘️', x: 80, y: 80 }
  ];

  const startGame = () => {
    setGameState('playing');
    setScore({ goles: 0, fallos: 0 });
    setCurrentShot(1);
    setSelectedZone(null);
    setPorteroZone(null);
    setResult(null);
  };

  const shoot = () => {
    if (!selectedZone) return;

    // Portero elige zona aleatoria
    const porteroChoice = zones[Math.floor(Math.random() * zones.length)];
    setPorteroZone(porteroChoice);

    // Determinar si es gol (85% de probabilidad si no coincide con portero, 15% si coincide)
    const isGoal = selectedZone.id !== porteroChoice.id 
      ? Math.random() > 0.15 // 85% gol si portero está en otra zona
      : Math.random() > 0.85; // 15% gol si portero ataja

    setResult(isGoal ? 'gol' : 'fallo');
    
    if (isGoal) {
      setScore(prev => ({ ...prev, goles: prev.goles + 1 }));
    } else {
      setScore(prev => ({ ...prev, fallos: prev.fallos + 1 }));
    }

    // Siguiente tiro o finalizar
    setTimeout(() => {
      if (currentShot < totalShots) {
        setCurrentShot(prev => prev + 1);
        setSelectedZone(null);
        setPorteroZone(null);
        setResult(null);
      } else {
        // Fin del juego
        setGameState('result');
        updateStats(score.goles + (isGoal ? 1 : 0));
      }
    }, 2500);
  };

  const updateStats = (finalScore) => {
    setStats(prev => ({
      partidasJugadas: prev.partidasJugadas + 1,
      golesAnotados: prev.golesAnotados + finalScore,
      tirosEfectividad: Math.round(((prev.golesAnotados + finalScore) / ((prev.partidasJugadas + 1) * totalShots)) * 100)
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '1000px',
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
            ⚽ Juego de Penaltis
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px' }}>
            Demuestra tu puntería y conviértete en el rey de los penaltis
          </p>
        </div>

        {/* Estadísticas Globales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: '#181818',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>
              {stats.partidasJugadas}
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Partidas Jugadas</div>
          </div>
          <div style={{
            background: '#181818',
            border: '2px solid #00ff88',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>
              {stats.golesAnotados}
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Goles Totales</div>
          </div>
          <div style={{
            background: '#181818',
            border: '2px solid #00ccff',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ccff' }}>
              {stats.tirosEfectividad}%
            </div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Efectividad</div>
          </div>
        </div>

        {/* INTRO - Tutorial y Comenzar */}
        {gameState === 'intro' && (
          <div>
            {/* Tutorial */}
            {showTutorial && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
                border: '2px solid #FFD700',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '28px' }}>
                      🎯 ¿Cómo jugar Penaltis?
                    </h2>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ color: '#00ff88', fontSize: '20px', marginBottom: '12px' }}>
                        📋 Reglas del Juego:
                      </h3>
                      <ul style={{ color: '#aaa', fontSize: '15px', lineHeight: '2', paddingLeft: '20px' }}>
                        <li><strong style={{ color: '#FFD700' }}>Objetivo:</strong> Anotar el máximo de goles en {totalShots} tiros</li>
                        <li><strong style={{ color: '#FFD700' }}>Tienes 9 zonas:</strong> Elige estratégicamente dónde patear</li>
                        <li><strong style={{ color: '#FFD700' }}>El portero:</strong> Intentará adivinar tu tiro</li>
                        <li><strong style={{ color: '#FFD700' }}>Puntuación:</strong> Cada gol suma 1 punto</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ color: '#00ccff', fontSize: '20px', marginBottom: '12px' }}>
                        💡 Estrategia y Consejos:
                      </h3>
                      <div style={{ 
                        background: '#0a0a0a', 
                        padding: '16px', 
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
                          <strong style={{ color: '#00ff88' }}>✓ Varía tus tiros:</strong> No apuntes siempre al mismo lugar<br/>
                          <strong style={{ color: '#00ff88' }}>✓ Esquinas superiores:</strong> Más difíciles de atajar (mayor recompensa)<br/>
                          <strong style={{ color: '#ff9500' }}>⚠️ Centro:</strong> Arriesgado, el portero puede quedarse ahí<br/>
                          <strong style={{ color: '#00ff88' }}>✓ Laterales bajos:</strong> Opción segura y efectiva<br/>
                          <strong style={{ color: '#00ccff' }}>💎 Consejo Pro:</strong> Observa patrones del portero
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255,215,0,0.1)',
                      border: '1px solid #FFD700',
                      borderRadius: '8px',
                      padding: '16px',
                      marginTop: '16px'
                    }}>
                      <p style={{ color: '#FFD700', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                        🏆 Domina el juego: Intenta hacer {totalShots}/{totalShots} perfecto para ser el campeón
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTutorial(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFD700',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '0 8px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Botón Comenzar */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  border: 'none',
                  padding: '20px 60px',
                  borderRadius: '16px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(255,215,0,0.5)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 12px 40px rgba(255,215,0,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 32px rgba(255,215,0,0.5)';
                }}
              >
                🚀 Comenzar Juego
              </button>
              {!showTutorial && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => setShowTutorial(true)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #FFD700',
                      color: '#FFD700',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    📖 Ver Tutorial Nuevamente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* JUGANDO */}
        {gameState === 'playing' && (
          <div>
            {/* Marcador */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              background: '#181818',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FFD700'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '4px' }}>
                  Tiro {currentShot} de {totalShots}
                </div>
                <div style={{
                  background: '#0a0a0a',
                  height: '8px',
                  width: '200px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                    height: '100%',
                    width: `${(currentShot / totalShots) * 100}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>
                    {score.goles}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>GOLES</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff3366' }}>
                    {score.fallos}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>FALLOS</div>
                </div>
              </div>
            </div>

            {/* Cancha y Portería */}
            <div style={{
              background: '#0a5a0a',
              borderRadius: '16px',
              padding: '40px',
              marginBottom: '24px',
              position: 'relative',
              minHeight: '400px'
            }}>
              {/* Mensaje de Resultado */}
              {result && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: result === 'gol' 
                    ? 'rgba(0,255,136,0.95)' 
                    : 'rgba(255,51,102,0.95)',
                  padding: '32px 60px',
                  borderRadius: '16px',
                  zIndex: 10,
                  animation: 'popIn 0.5s',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                  <div style={{
                    fontSize: '72px',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    {result === 'gol' ? '⚽' : '❌'}
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#000',
                    textAlign: 'center'
                  }}>
                    {result === 'gol' ? '¡GOOOOL!' : '¡ATAJADO!'}
                  </div>
                </div>
              )}

              {/* Portería */}
              <div style={{
                background: 'linear-gradient(180deg, #333 0%, #1a1a1a 100%)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '40px',
                border: '4px solid #fff'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px'
                }}>
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => !result && setSelectedZone(zone)}
                      style={{
                        background: selectedZone?.id === zone.id
                          ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                          : porteroZone?.id === zone.id
                          ? 'linear-gradient(135deg, #ff3366, #ff0066)'
                          : 'rgba(255,255,255,0.1)',
                        padding: '40px 20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: result ? 'not-allowed' : 'pointer',
                        border: selectedZone?.id === zone.id ? '3px solid #FFD700' : '2px dashed rgba(255,255,255,0.3)',
                        transition: 'all 0.3s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!result && selectedZone?.id !== zone.id) {
                          e.currentTarget.style.background = 'rgba(255,215,0,0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!result && selectedZone?.id !== zone.id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                        {zone.emoji}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: selectedZone?.id === zone.id ? '#000' : '#fff',
                        fontWeight: 'bold'
                      }}>
                        {zone.name}
                      </div>
                      {porteroZone?.id === zone.id && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '64px'
                        }}>
                          🧤
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instrucciones */}
              <div style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {!selectedZone && !result && '👆 Selecciona una zona para disparar'}
                {selectedZone && !result && '🎯 Zona seleccionada: ' + selectedZone.name}
              </div>
            </div>

            {/* Botón Disparar */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={shoot}
                disabled={!selectedZone || result !== null}
                style={{
                  background: (!selectedZone || result !== null)
                    ? '#666'
                    : 'linear-gradient(135deg, #00ff88, #00ccff)',
                  color: '#000',
                  border: 'none',
                  padding: '16px 48px',
                  borderRadius: '12px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: (!selectedZone || result !== null) ? 'not-allowed' : 'pointer',
                  boxShadow: (!selectedZone || result !== null) 
                    ? 'none' 
                    : '0 4px 20px rgba(0,255,136,0.5)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (selectedZone && !result) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ⚽ DISPARAR
              </button>
            </div>
          </div>
        )}

        {/* RESULTADO FINAL */}
        {gameState === 'result' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: '#181818',
              border: '3px solid #FFD700',
              borderRadius: '16px',
              padding: '48px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '96px', marginBottom: '16px' }}>
                {score.goles === totalShots ? '🏆' : score.goles >= 3 ? '⭐' : '👍'}
              </div>
              <h2 style={{
                fontSize: '36px',
                color: '#FFD700',
                marginBottom: '24px'
              }}>
                {score.goles === totalShots ? '¡PERFECTO!' : 
                 score.goles >= 3 ? '¡Buen Trabajo!' : '¡Sigue Practicando!'}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: '#0a0a0a',
                  padding: '24px',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff88' }}>
                    {score.goles}
                  </div>
                  <div style={{ color: '#aaa' }}>Goles Anotados</div>
                </div>
                <div style={{
                  background: '#0a0a0a',
                  padding: '24px',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700' }}>
                    {Math.round((score.goles / totalShots) * 100)}%
                  </div>
                  <div style={{ color: '#aaa' }}>Efectividad</div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔄 Jugar de Nuevo
              </button>
              <button
                onClick={() => setGameState('intro')}
                style={{
                  background: '#333',
                  color: '#fff',
                  border: '1px solid #666',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🏠 Menú Principal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

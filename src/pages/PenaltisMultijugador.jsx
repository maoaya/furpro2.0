import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PenaltyService from '../services/PenaltyService';

export default function PenaltisMultijugador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // menu, searching, playing, finished
  const [matchId, setMatchId] = useState(null);
  const [match, setMatch] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentShooter, setCurrentShooter] = useState('home'); // home o away
  const [round, setRound] = useState(1);
  const [gameHistory, setGameHistory] = useState(null);
  const [unsubscribeFn, setUnsubscribeFn] = useState(null);
  const canvasRef = useRef(null);

  // Cleanup al desmontar o cambiar de partida
  useEffect(() => {
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [unsubscribeFn]);

  const generateTeamName = () => {
    const adjectives = ['Rápido', 'Fuerte', 'Ágil', 'Valiente', 'Dinámico'];
    const nouns = ['Halcones', 'Tigres', 'Águilas', 'Leones', 'Dragones'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  };

  const startGame = async () => {
    try {
      // Crear partida en BD usando PenaltyService
      const newMatch = await PenaltyService.createPenaltyMatch(
        user?.id,
        null, // Sin oponente (modo CPU por ahora)
        'cpu', // Tipo: cpu (o 'pvp' si hay oponente real)
        'media' // Dificultad
      );

      setMatchId(newMatch.id);
      setMatch(newMatch);
      setGameState('playing');
      
      setHomeTeam({
        name: user?.email?.split('@')[0] || 'Tú',
        score: 0,
        shots: []
      });
      setAwayTeam({
        name: generateTeamName(),
        score: 0,
        shots: []
      });
      setHomeScore(0);
      setAwayScore(0);
      setCurrentShooter('home');
      setRound(1);
      setGameHistory([]);

      // Suscribirse a cambios de la partida
      const unsubscribe = PenaltyService.subscribeToPenaltyMatch(
        newMatch.id,
        (updatedMatch) => {
          setMatch(updatedMatch);
          if (updatedMatch.status === 'completed') {
            handleMatchCompleted(updatedMatch);
          }
        }
      );
      setUnsubscribeFn(() => unsubscribe);

    } catch (error) {
      console.error('Error al crear partida:', error);
      alert('Error al iniciar partida: ' + error.message);
    }
  };

  const shootPenalty = async (isGoal) => {
    if (!matchId || !user?.id) return;

    try {
      // Determinar dirección (simulado - en versión completa sería input del usuario)
      const directions = ['left', 'center', 'right'];
      const direction = directions[Math.floor(Math.random() * 3)];
      const power = Math.random() * 0.5 + 0.5; // 0.5 - 1.0
      const goalieDirection = directions[Math.floor(Math.random() * 3)];

      // Registrar disparo en BD
      const updatedMatch = await PenaltyService.recordPenaltyShot(
        matchId,
        user.id,
        isGoal,
        direction,
        power,
        goalieDirection
      );

      // Actualizar estado local
      const newHistory = [...(gameHistory || [])];
      newHistory.push({
        round,
        shooter: currentShooter,
        isGoal,
        direction,
        power,
        timestamp: new Date().toISOString()
      });

      if (isGoal) {
        if (currentShooter === 'home') {
          setHomeScore(prev => prev + 1);
        } else {
          setAwayScore(prev => prev + 1);
        }
      }

      setGameHistory(newHistory);

      // Cambiar de tirador
      if (currentShooter === 'home') {
        setCurrentShooter('away');
      } else {
        setCurrentShooter('home');
        setRound(prev => prev + 1);
      }

      // La partida se completa automáticamente en el servicio tras 10 disparos
      if (updatedMatch.status === 'completed') {
        setGameState('finished');
      }

    } catch (error) {
      console.error('Error al registrar disparo:', error);
      alert('Error al registrar disparo: ' + error.message);
    }
  };

  const handleMatchCompleted = (completedMatch) => {
    setGameState('finished');
    console.log('Partida completada:', completedMatch);
    // El servicio ya actualizó automáticamente las estadísticas del jugador
  };

  const drawPenaltyShot = (isGoal) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar portería
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.rect(50, 50, 300, 200);
    ctx.stroke();

    // Línea de penalti
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(200, 250);
    ctx.lineTo(200, 350);
    ctx.stroke();
    ctx.setLineDash([]);

    if (isGoal) {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
      ctx.fillRect(50, 50, 300, 200);
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡GOOOOL!', 200, 180);
    } else {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.fillRect(50, 50, 300, 200);
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ATAJADO', 200, 180);
    }

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Golpe número ' + round, 200, 300);
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
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 20 }}
        >
          ← Volver
        </button>

        <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>⚽ Penaltis Multijugador</h1>

        {gameState === 'menu' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: 40,
            borderRadius: 12,
            border: '1px solid #FFD700',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 28, marginBottom: 24 }}>¡Desafía a otro jugador!</h2>
            <p style={{ fontSize: 16, marginBottom: 32, color: '#FFD70099' }}>
              Compite en penaltis contra otro usuario. El que marque más goles gana.
            </p>
            <button
              onClick={startGame}
              style={{
                background: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '16px 40px',
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: 16
              }}
            >
              🎮 Jugar Ahora
            </button>
            <div style={{ marginTop: 40 }}>
              <h3 style={{ marginBottom: 16 }}>📋 Cómo Jugar</h3>
              <ul style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto', lineHeight: 1.8 }}>
                <li>Se alternan 5 penaltis por equipo</li>
                <li>Cada jugador intenta marcar gol</li>
                <li>El portero intenta atajar</li>
                <li>Gana el que marque más goles</li>
                <li>En caso de empate, se juegan penaltis adicionales</li>
              </ul>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: 24,
            borderRadius: 12,
            border: '1px solid #FFD700'
          }}>
            {/* Marcador */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 24,
              marginBottom: 32,
              background: 'rgba(0,0,0,0.3)',
              padding: 20,
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#FFD70099', marginBottom: 8 }}>{homeTeam?.name}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold' }}>{homeScore}</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>VS</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#FFD70099', marginBottom: 8 }}>{awayTeam?.name}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold' }}>{awayScore}</div>
              </div>
            </div>

            {/* Canvas del juego */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{
                  background: '#2d8659',
                  border: '3px solid #FFD700',
                  borderRadius: 8,
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>

            {/* Info del tiro */}
            <div style={{
              textAlign: 'center',
              marginBottom: 32,
              padding: 16,
              background: 'rgba(255,215,0,0.1)',
              borderRadius: 8
            }}>
              <div style={{ fontSize: 14, color: '#FFD70099', marginBottom: 8 }}>Turno de:</div>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {currentShooter === 'home' ? homeTeam?.name : awayTeam?.name}
              </div>
              <div style={{ fontSize: 14, color: '#FFD70099', marginTop: 8 }}>Penalti {round}/5</div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <button
                onClick={() => {
                  shootPenalty(true);
                  drawPenaltyShot(true);
                }}
                style={{
                  background: '#2ecc71',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '16px 24px',
                  fontSize: 18,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ⚽ ¡GOOOOL!
              </button>
              <button
                onClick={() => {
                  shootPenalty(false);
                  drawPenaltyShot(false);
                }}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '16px 24px',
                  fontSize: 18,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🛑 ATAJADO
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: 40,
            borderRadius: 12,
            border: '1px solid #FFD700',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 32, marginBottom: 32 }}>
              {homeScore > awayScore ? '🎉 ¡GANASTE!' : awayScore > homeScore ? '😢 Perdiste' : '🤝 Empate'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              marginBottom: 40
            }}>
              <div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{homeTeam?.name}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold' }}>{homeScore}</div>
              </div>
              <div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{awayTeam?.name}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold' }}>{awayScore}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,215,0,0.1)',
              padding: 20,
              borderRadius: 8,
              marginBottom: 32
            }}>
              <h3 style={{ marginBottom: 16 }}>📊 Estadísticas</h3>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                <div>Total de penaltis: {gameHistory?.length || 0}</div>
                <div>Penaltis convertidos (Local): {gameHistory?.filter(g => g.shooter === 'home' && g.isGoal).length || 0}</div>
                <div>Penaltis convertidos (Visitante): {gameHistory?.filter(g => g.shooter === 'away' && g.isGoal).length || 0}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setGameState('menu');
                setGameHistory(null);
              }}
              style={{
                background: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Jugar de Nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

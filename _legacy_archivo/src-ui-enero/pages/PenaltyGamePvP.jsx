import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPenaltyMatch, joinPenaltyMatch, recordPenaltyShot } from '../services/PenaltyService';
import { supabase } from '../config/supabase';

const DIRECTIONS = ['left', 'center', 'right'];

export default function PenaltyGamePvP() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('menu'); // 'menu', 'waiting', 'playing', 'finished'
  const [currentMatch, setCurrentMatch] = useState(null);
  const [availableMatches, setAvailableMatches] = useState([]);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [power, setPower] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (mode === 'menu') {
      loadAvailableMatches();
    }
  }, [mode]);

  useEffect(() => {
    if (currentMatch?.id && mode === 'playing') {
      const channel = supabase
        .channel(`penalty-match-${currentMatch.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'penalty_matches',
          filter: `id=eq.${currentMatch.id}`
        }, (payload) => {
          setCurrentMatch(payload.new);
          if (payload.new.status === 'completed') {
            setMode('finished');
          }
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentMatch?.id, mode]);

  const loadAvailableMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('penalty_matches')
        .select('*, player1:player1_id(nombre, apellido, avatar_url)')
        .eq('status', 'waiting_opponent')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setAvailableMatches(data || []);
    } catch (err) {
      console.error('Error loading matches:', err);
    }
  };

  const handleCreateMatch = async () => {
    setLoading(true);
    setError('');
    try {
      const match = await createPenaltyMatch(user.id, null, 'pvp', 'media');
      setCurrentMatch(match);
      setMode('waiting');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (matchId) => {
    setLoading(true);
    setError('');
    try {
      const match = await joinPenaltyMatch(matchId, user.id);
      setCurrentMatch(match);
      setMode('playing');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShoot = async () => {
    if (!selectedDirection) {
      setError('Selecciona una dirección');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // Simular si es gol (70% de probabilidad base, ajustado por potencia)
      const successRate = 0.5 + (power / 200);
      const isGoal = Math.random() < successRate;
      
      await recordPenaltyShot(
        currentMatch.id,
        user.id,
        isGoal,
        selectedDirection,
        power
      );
      
      setSelectedDirection(null);
      setPower(50);
      
      // Recargar match actualizado
      const { data } = await supabase
        .from('penalty_matches')
        .select('*')
        .eq('id', currentMatch.id)
        .single();
      
      if (data) {
        setCurrentMatch(data);
        if (data.status === 'completed') {
          setMode('finished');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isMyTurn = currentMatch?.current_turn === user?.id;
  const myGoals = currentMatch?.player1_id === user?.id ? currentMatch?.player1_goals : currentMatch?.player2_goals;
  const opponentGoals = currentMatch?.player1_id === user?.id ? currentMatch?.player2_goals : currentMatch?.player1_goals;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      padding: 24,
      color: '#FFD700'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: '2px solid #FFD700',
            color: '#FFD700',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: 20
          }}
        >
          ← Volver
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          ⚽ Penaltis PvP
        </h1>

        {error && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {mode === 'menu' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <button
                onClick={handleCreateMatch}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: 12,
                  padding: '16px 32px',
                  fontSize: 18,
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Creando...' : '🆕 Crear Partida'}
              </button>
            </div>

            <h2 style={{ fontSize: 24, marginBottom: 16 }}>Partidas Disponibles</h2>
            {availableMatches.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No hay partidas esperando oponente</p>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {availableMatches.map(match => (
                  <div key={match.id} style={{
                    background: '#1a1a2e',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '2px solid #333'
                  }}>
                    <div>
                      <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {match.player1?.nombre || 'Jugador'} esperando...
                      </p>
                      <p style={{ color: '#999', fontSize: 14 }}>
                        Dificultad: {match.difficulty}
                      </p>
                    </div>
                    <button
                      onClick={() => handleJoinMatch(match.id)}
                      style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 24px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Unirse
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'waiting' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>Esperando oponente...</h2>
            <p style={{ color: '#999' }}>Otro jugador se unirá pronto</p>
            <button
              onClick={() => setMode('menu')}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: 'pointer',
                marginTop: 24
              }}
            >
              Cancelar
            </button>
          </div>
        )}

        {mode === 'playing' && (
          <div>
            <div style={{
              background: '#1a1a2e',
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 48, fontWeight: 'bold' }}>
                <div>
                  <div>{myGoals || 0}</div>
                  <div style={{ fontSize: 14, color: '#999' }}>Tú</div>
                </div>
                <div style={{ color: '#666' }}>-</div>
                <div>
                  <div>{opponentGoals || 0}</div>
                  <div style={{ fontSize: 14, color: '#999' }}>Rival</div>
                </div>
              </div>
            </div>

            {isMyTurn ? (
              <div>
                <h3 style={{ textAlign: 'center', fontSize: 20, marginBottom: 24 }}>
                  🎯 Tu turno - Elige dirección
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                  {DIRECTIONS.map(dir => (
                    <button
                      key={dir}
                      onClick={() => setSelectedDirection(dir)}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        border: selectedDirection === dir ? '4px solid #FFD700' : '2px solid #333',
                        background: selectedDirection === dir ? '#FFD70033' : '#1a1a2e',
                        color: selectedDirection === dir ? '#FFD700' : '#999',
                        fontSize: 32,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {dir === 'left' ? '←' : dir === 'right' ? '→' : '↑'}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', marginBottom: 8 }}>
                    Potencia: {power}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={power}
                    onChange={(e) => setPower(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  onClick={handleShoot}
                  disabled={!selectedDirection || loading}
                  style={{
                    width: '100%',
                    background: selectedDirection ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : '#666',
                    color: '#000',
                    border: 'none',
                    borderRadius: 12,
                    padding: '20px',
                    fontSize: 20,
                    fontWeight: 'bold',
                    cursor: selectedDirection && !loading ? 'pointer' : 'not-allowed',
                    opacity: selectedDirection && !loading ? 1 : 0.5
                  }}
                >
                  {loading ? 'Disparando...' : '⚽ DISPARAR'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
                <h3 style={{ fontSize: 20 }}>Turno del rival...</h3>
              </div>
            )}
          </div>
        )}

        {mode === 'finished' && currentMatch && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>
              {currentMatch.winner_id === user.id ? '🏆' : '😢'}
            </div>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>
              {currentMatch.winner_id === user.id ? '¡VICTORIA!' : 'Derrota'}
            </h2>
            <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 24 }}>
              {myGoals} - {opponentGoals}
            </div>
            <button
              onClick={() => {
                setMode('menu');
                setCurrentMatch(null);
                loadAvailableMatches();
              }}
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                padding: '16px 32px',
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Jugar de Nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

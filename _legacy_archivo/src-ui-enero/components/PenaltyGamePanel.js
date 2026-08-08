import React, { useState } from 'react';
import './PenaltyGamePanel.css';

const directions = ['Izquierda', 'Centro', 'Derecha'];
const getRandomDirection = () => directions[Math.floor(Math.random() * directions.length)];

export default function PenaltyGamePanel({ onExit, onScore }) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Selecciona la dirección para patear');
  const [showResult, setShowResult] = useState(false);
  const [userDir, setUserDir] = useState(null);
  const [keeperDir, setKeeperDir] = useState(null);

  const handleKick = (dir) => {
    setUserDir(dir);
    const kDir = getRandomDirection();
    setKeeperDir(kDir);
    setShowResult(true);
    if (dir === kDir) {
      setMessage('¡Atajó el arquero!');
    } else {
      setMessage('¡Gol!');
      setScore((s) => s + 1);
      if (onScore) onScore(round, dir, kDir);
    }
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setShowResult(false);
    setUserDir(null);
    setKeeperDir(null);
    setMessage('Selecciona la dirección para patear');
  };

  return (
    <div className="penalty-game-panel">
      <h3>Juego de Penaltis</h3>
      <div className="penalty-arco">
        <div
          className="penalty-keeper"
          style={{ left: keeperDir === 'Izquierda' ? 0 : keeperDir === 'Centro' ? 60 : 120 }}
        />
        <div className="penalty-ball" />
      </div>
      <div className="penalty-directions">
        {directions.map((dir) => (
          <button key={dir} className="penalty-btn" disabled={showResult} onClick={() => handleKick(dir)}>
            {dir}
          </button>
        ))}
      </div>
      <div className="penalty-info">
        <b>Ronda:</b> {round} / 5 &nbsp; <b>Goles:</b> {score}
      </div>
      <div className="penalty-message">{message}</div>
      {showResult && (
        <div className="penalty-result">
          <div>
            Tu dirección: <b>{userDir}</b>
          </div>
          <div>
            Dirección arquero: <b>{keeperDir}</b>
          </div>
          <button className="penalty-next-btn" onClick={round < 5 ? nextRound : onExit}>
            {round < 5 ? 'Siguiente ronda' : 'Salir'}
          </button>
        </div>
      )}
      {!showResult && (
        <button className="penalty-exit-btn" onClick={onExit}>
          Salir
        </button>
      )}
    </div>
  );
}

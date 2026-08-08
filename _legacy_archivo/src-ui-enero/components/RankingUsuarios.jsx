import React from 'react';

export default function RankingUsuarios({ ranking }) {
  return (
    <div style={{ background: '#232323', borderRadius: 12, padding: 18, marginBottom: 24 }}>
      <h3>Ranking de Usuarios por Valoración Promedio</h3>
      {ranking.length > 0 ? (
        <ol>
          {ranking.map((r, idx) => (
            <li key={r.usuario} style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? '#FFD700' : '#fff', marginBottom: 8 }}>
              {r.usuario.charAt(0).toUpperCase() + r.usuario.slice(1)}: {r.promedio}
            </li>
          ))}
        </ol>
      ) : <div>No hay datos de ranking aún.</div>}
    </div>
  );
}

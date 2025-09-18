import React from 'react';

const seguidoresMock = ['maria', 'pedro', 'lucas'];

export default function PerfilSeguidoresPanel({ seguidores = seguidoresMock, onSeguir }) {
    const seguidoresFinal = Array.isArray(seguidores) && seguidores.length > 0 ? seguidores : seguidoresMock;
    return (
        <div className="perfil-seguidores-panel">
            <h3>Seguidores</h3>
            <ul>
                {seguidoresFinal.map((s, idx) => (
                    <li key={idx}>{typeof s === 'string' ? s : s?.nombre || 'usuario'}</li>
                ))}
            </ul>
            {onSeguir && (
                <form onSubmit={e => { e.preventDefault(); onSeguir(e.target.usuario.value); e.target.reset(); }}>
                    <input name="usuario" type="text" placeholder="Usuario a seguir..." />
                    <button type="submit">Seguir</button>
                </form>
            )}
        </div>
    );
}

import React from 'react';

const comentariosMock = [
    { usuario: 'maria', texto: '¡Gran perfil!' },
    { usuario: 'lucas', texto: 'Te sigo desde el torneo.' }
];

export default function PerfilComentariosPanel({ comentarios = comentariosMock, onComentar }) {
    const comentariosFinal = comentarios && comentarios.length > 0 ? comentarios : comentariosMock;
    return (
        <div className="perfil-comentarios-panel">
            <h3>Comentarios</h3>
            <ul>
                {comentariosFinal.map((c, idx) => (
                    <li key={idx}><strong>{c.usuario}:</strong> {c.texto}</li>
                ))}
            </ul>
            {onComentar && (
                <form onSubmit={e => {e.preventDefault();onComentar('Tú',e.target.texto.value);e.target.reset();}}>
                    <input name="texto" type="text" placeholder="Escribe un comentario..." />
                    <button type="submit">Comentar</button>
                </form>
            )}
        </div>
    );
}

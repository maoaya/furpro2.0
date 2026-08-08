import React from 'react';

export default function PerfilLikesPanel({ likes }) {
    return (
        <div className="perfil-panel">
            <h3><i className="fas fa-heart"></i> Likes recibidos</h3>
            <ul>
                {likes && likes.length > 0 ? (
                    likes.map((like, idx) => (
                        <li key={idx}>
                            <img src={like.avatar} alt={like.nombre} className="avatar-mini" />
                            {like.nombre} en {like.post}
                        </li>
                    ))
                ) : (
                    <li>No tienes likes aún.</li>
                )}
            </ul>
        </div>
    );
}

import React from 'react';

export default function PerfilGaleriaFotosPanel({ posts }) {
    const imagenes = posts.filter(post => post.media_url && post.media_type === 'image');
    return (
        <div className="perfil-panel galeria-panel">
            <h3><i className="fas fa-images"></i> Galería de Fotos</h3>
            <div className="galeria-grid">
                {imagenes.length > 0 ? (
                    imagenes.map((img, idx) => (
                        <div key={idx} className="galeria-item">
                            <img src={img.media_url} alt="Foto del usuario" className="galeria-img" />
                        </div>
                    ))
                ) : (
                    <div className="galeria-empty">No hay fotos aún.</div>
                )}
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { Button } from './Button';

export default function FormNuevaPublicacion({ onCrear, loading, feedback, show, onClose, usuarioTipo }) {
  const [nuevo, setNuevo] = useState({ titulo: '', descripcion: '', etiquetas: '' });
  const [errores, setErrores] = useState({});

  function validarCampos() {
    const err = {};
    if (!usuarioTipo || usuarioTipo === 'todos') {
      err.usuarioTipo = 'Selecciona un tipo de usuario válido.';
    }
    if (!nuevo.titulo || nuevo.titulo.trim().length < 5) {
      err.titulo = 'El título debe tener al menos 5 caracteres.';
    } else if (!/^[\w\sáéíóúÁÉÍÓÚüÜñÑ.,:;!?¡¿-]+$/.test(nuevo.titulo)) {
      err.titulo = 'El título contiene caracteres no permitidos.';
    }
    if (!nuevo.descripcion || nuevo.descripcion.trim().length < 10) {
      err.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    } else if (!/^[\w\sáéíóúÁÉÍÓÚüÜñÑ.,:;!?¡¿-]+$/.test(nuevo.descripcion)) {
      err.descripcion = 'La descripción contiene caracteres no permitidos.';
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validarCampos()) {
      // Procesar etiquetas a array
      const etiquetas = nuevo.etiquetas
        ? nuevo.etiquetas.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      onCrear({ ...nuevo, etiquetas }, setNuevo);
    }
  }

  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#181818cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, minWidth: 320 }}>
        <h3>Crear publicación</h3>
        <input value={nuevo.titulo} onChange={e => setNuevo({ ...nuevo, titulo: e.target.value })} placeholder="Título" style={{ borderRadius: 8, padding: 8, marginBottom: 4, width: '100%' }} />
        {errores.titulo && <div style={{ color: 'red', marginBottom: 8 }}>{errores.titulo}</div>}
        <input value={nuevo.descripcion} onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} placeholder="Descripción" style={{ borderRadius: 8, padding: 8, marginBottom: 4, width: '100%' }} />
        {errores.descripcion && <div style={{ color: 'red', marginBottom: 8 }}>{errores.descripcion}</div>}
        {/* Campo para etiquetas */}
        <input value={nuevo.etiquetas} onChange={e => setNuevo({ ...nuevo, etiquetas: e.target.value })} placeholder="Etiquetar usuarios (separados por coma)" style={{ borderRadius: 8, padding: 8, marginBottom: 4, width: '100%' }} />
        <div style={{ fontSize: 12, color: '#FFD70099', marginBottom: 8 }}>Ejemplo: juanperez, maria23</div>
        {errores.usuarioTipo && <div style={{ color: 'red', marginBottom: 8 }}>{errores.usuarioTipo}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} type="submit" disabled={loading}>Crear</Button>
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} type="button" onClick={onClose}>Cancelar</Button>
        </div>
        {feedback && <div style={{ color: '#FFD700', marginTop: 8 }}>{feedback}</div>}
      </form>
    </div>
  );
}

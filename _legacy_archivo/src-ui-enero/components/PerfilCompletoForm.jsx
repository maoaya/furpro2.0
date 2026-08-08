import React, { useState } from 'react';

export default function PerfilCompletoForm({ user, onComplete }) {
  const [nombre, setNombre] = useState(user?.displayName || '');
  const [foto, setFoto] = useState(user?.photoURL || '');
  const [descripcion, setDescripcion] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [tipo, setTipo] = useState('jugador');
  const [error, setError] = useState('');

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('La foto debe ser menor a 2MB');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre) return setError('El nombre es obligatorio');
    // Guardar en localStorage (simula almacenamiento local tipo Instagram)
    localStorage.setItem('perfil', JSON.stringify({ nombre, foto, descripcion, sugerencias, tipo }));
    onComplete && onComplete({ nombre, foto, descripcion, sugerencias, tipo });
  };

  return (
    <form className="perfil-completo-form" onSubmit={handleSubmit}>
      <h2>Completa tu perfil</h2>
      <label>Nombre:
        <input value={nombre} onChange={e => setNombre(e.target.value)} required />
      </label>
      <label>Tipo de usuario:
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{marginLeft:8}}>
          <option value="jugador">Jugador</option>
          <option value="entrenador">Entrenador</option>
          <option value="arbitro">Árbitro</option>
        </select>
      </label>
      <label>Foto de perfil:
        <input type="file" accept="image/*" onChange={handleFoto} />
        {foto && <img src={foto} alt="preview" style={{ width: 80, borderRadius: '50%' }} />}
      </label>
      <label>Descripción:
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Cuéntanos sobre ti..." />
      </label>
      <label>Sugerencias a seguir:
        <input value={sugerencias} onChange={e => setSugerencias(e.target.value)} placeholder="¿A quién te gustaría seguir?" />
      </label>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Guardar perfil</button>
    </form>
  );
}

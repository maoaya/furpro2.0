import React, { useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function CrearUsuarioForm({ onSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    edad: '',
    equipo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!form.rol) {
      setError('Rol requerido');
      toast.error('Selecciona un rol');
      setLoading(false);
      return;
    }
    if (!form.edad || parseInt(form.edad) < 12) {
      setError('Edad mínima: 12 años');
      toast.error('La edad mínima es 12 años');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setError('');
        setLoading(false);
        toast.success('¡Usuario creado exitosamente!', { icon: '👤', style: { background: '#181818', color: '#FFD700' } });
        onSuccess && onSuccess();
      } else {
        setError('Error al crear usuario');
        toast.error('Error al crear usuario');
        setLoading(false);
      }
    } catch (err) {
      setError('Error de red');
      toast.error('Error de red');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-8 mt-8 flex flex-col gap-4 animate-fadeIn"
      autoComplete="off"
      aria-label="Formulario de creación de usuario"
    >
      <h2 className="text-2xl font-bold text-yellow-400 mb-2 text-center">Crear Usuario</h2>
      <input
        name="nombre"
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={handleChange}
        required
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
        autoFocus
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        type="email"
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña segura"
        value={form.password}
        onChange={handleChange}
        required
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      />
      <select
        name="rol"
        value={form.rol}
        onChange={handleChange}
        required
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      >
        <option value="">Selecciona rol</option>
        <option value="jugador">Jugador</option>
        <option value="organizador">Organizador</option>
        <option value="arbitro">Árbitro</option>
      </select>
      <input
        name="edad"
        type="number"
        placeholder="Edad (mínimo 12)"
        value={form.edad}
        onChange={handleChange}
        required
        min={12}
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      />
      <input
        name="equipo"
        placeholder="Equipo (opcional)"
        value={form.equipo}
        onChange={handleChange}
        className="p-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg mt-2 hover:bg-yellow-300 transition-all duration-200 focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
      >
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
      {error && <div className="text-red-400 text-center animate-shake mt-2">{error}</div>}
    </form>
  );
}

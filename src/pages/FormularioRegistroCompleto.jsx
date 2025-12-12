import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FormularioRegistroCompleto() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    categoria: 'masculina',
    nombre: '',
    apellido: '',
    edad: '',
    posicion: 'Flexible',
    nivelHabilidad: 'Principiante'
  });

  // Cargar categoría desde navegación
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('categoria');
    if (cat) {
      setFormData(prev => ({ ...prev, categoria: cat }));
    }
  }, [location]);

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error OAuth:', error);
    }
  };

  const siguientePaso = () => {
    if (pasoActual < 3) setPasoActual(pasoActual + 1);
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) setPasoActual(pasoActual - 1);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto', color: '#FFD700', background: '#222', borderRadius: 16 }}>
      <h1>Registro Completo - Paso {pasoActual}/3</h1>
      
      {pasoActual === 1 && (
        <div>
          <h2>Credenciales</h2>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
          <button onClick={handleGoogleSignup} style={{ width: '100%', padding: 12, background: '#4285F4', color: '#fff', border: 'none', borderRadius: 8 }}>
            Continuar con Google
          </button>
        </div>
      )}

      {pasoActual === 2 && (
        <div>
          <h2>Datos Personales</h2>
          <input
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
          <input
            placeholder="Apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
          <input
            type="number"
            placeholder="Edad"
            value={formData.edad}
            onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          />
        </div>
      )}

      {pasoActual === 3 && (
        <div>
          <h2>Info Futbolística</h2>
          <select
            value={formData.posicion}
            onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8 }}
          >
            <option value="Flexible">Flexible</option>
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Mediocampista">Mediocampista</option>
            <option value="Delantero">Delantero</option>
          </select>
          <button
            onClick={() => {
              console.log('Registro completo:', formData);
              navigate('/perfil-card');
            }}
            style={{ width: '100%', padding: 12, background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold' }}
          >
            Completar Registro
          </button>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        {pasoActual > 1 && (
          <button onClick={pasoAnterior} style={{ padding: 10, background: '#444', color: '#fff', border: 'none', borderRadius: 8 }}>
            ← Anterior
          </button>
        )}
        {pasoActual < 3 && (
          <button onClick={siguientePaso} style={{ padding: 10, background: '#FFD700', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', marginLeft: 'auto' }}>
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const gold = '#FFD700';
const black = '#222';

export default function ValidarUsuarioForm() {
  const { user, userProfile, completeUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha_nacimiento: '',
    pais: '',
    ciudad: '',
    posicion_favorita: '',
    equipo_favorito: '',
    experiencia_futbol: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Inicializar formulario con datos existentes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombre: userProfile.nombre || user?.displayName?.split(' ')[0] || '',
        apellido: userProfile.apellido || user?.displayName?.split(' ').slice(1).join(' ') || '',
        telefono: userProfile.telefono || '',
        fecha_nacimiento: userProfile.fecha_nacimiento || '',
        pais: userProfile.pais || '',
        ciudad: userProfile.ciudad || '',
        posicion_favorita: userProfile.posicion_favorita || '',
        equipo_favorito: userProfile.equipo_favorito || '',
        experiencia_futbol: userProfile.experiencia_futbol || ''
      });
    }
  }, [userProfile, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim() || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim() || formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (formData.telefono && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    if (formData.fecha_nacimiento) {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.fecha_nacimiento = 'Debes tener al menos 13 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await completeUserProfile(formData);
      
      if (result.error) {
        setSubmitStatus({ type: 'error', message: result.error });
      } else {
        setSubmitStatus({ type: 'success', message: '¡Perfil completado exitosamente!' });
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Error inesperado. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipToProfile = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: black,
        color: gold
      }}>
        🔄 Cargando perfil...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: black, 
      color: gold,
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto',
        background: '#333',
        borderRadius: 16,
        padding: 40,
        boxShadow: `0 8px 32px ${gold}22`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ color: gold, fontSize: '2.5em', marginBottom: 16 }}>
            ¡Bienvenido a FutPro! ⚽
          </h1>
          <p style={{ fontSize: '1.1em', color: '#ddd', marginBottom: 8 }}>
            Hola <strong>{user?.displayName || user?.email}</strong>
          </p>
          <p style={{ color: '#aaa' }}>
            Completa tu perfil para aprovechar al máximo la plataforma
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div style={{
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            background: submitStatus.type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            textAlign: 'center'
          }}>
            {submitStatus.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
          {/* Información Personal */}
          <div>
            <h3 style={{ color: gold, marginBottom: 16 }}>Información Personal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: errors.nombre ? '2px solid #f44336' : '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="Tu nombre"
                />
                {errors.nombre && <span style={{ color: '#f44336', fontSize: '0.9em' }}>{errors.nombre}</span>}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: errors.apellido ? '2px solid #f44336' : '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="Tu apellido"
                />
                {errors.apellido && <span style={{ color: '#f44336', fontSize: '0.9em' }}>{errors.apellido}</span>}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: errors.telefono ? '2px solid #f44336' : '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="+1234567890"
                />
                {errors.telefono && <span style={{ color: '#f44336', fontSize: '0.9em' }}>{errors.telefono}</span>}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: errors.fecha_nacimiento ? '2px solid #f44336' : '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                />
                {errors.fecha_nacimiento && <span style={{ color: '#f44336', fontSize: '0.9em' }}>{errors.fecha_nacimiento}</span>}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h3 style={{ color: gold, marginBottom: 16 }}>Ubicación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  País
                </label>
                <input
                  type="text"
                  value={formData.pais}
                  onChange={(e) => handleInputChange('pais', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="Ej: México"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="Ej: Ciudad de México"
                />
              </div>
            </div>
          </div>

          {/* Preferencias de Fútbol */}
          <div>
            <h3 style={{ color: gold, marginBottom: 16 }}>Preferencias de Fútbol</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Posición Favorita
                </label>
                <select
                  value={formData.posicion_favorita}
                  onChange={(e) => handleInputChange('posicion_favorita', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                >
                  <option value="">Selecciona una posición</option>
                  <option value="portero">Portero</option>
                  <option value="defensa">Defensa</option>
                  <option value="mediocampista">Mediocampista</option>
                  <option value="delantero">Delantero</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Equipo Favorito
                </label>
                <input
                  type="text"
                  value={formData.equipo_favorito}
                  onChange={(e) => handleInputChange('equipo_favorito', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                  placeholder="Ej: Real Madrid, Barcelona, etc."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Experiencia en Fútbol
                </label>
                <select
                  value={formData.experiencia_futbol}
                  onChange={(e) => handleInputChange('experiencia_futbol', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid #555',
                    background: '#444',
                    color: 'white',
                    fontSize: '1em'
                  }}
                >
                  <option value="">Selecciona tu nivel</option>
                  <option value="principiante">Principiante</option>
                  <option value="amateur">Amateur</option>
                  <option value="semi-profesional">Semi-profesional</option>
                  <option value="profesional">Profesional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{ 
            display: 'flex', 
            gap: 16, 
            justifyContent: 'center',
            marginTop: 32 
          }}>
            <button
              type="button"
              onClick={skipToProfile}
              style={{
                padding: '14px 28px',
                borderRadius: 8,
                border: `2px solid ${gold}`,
                background: 'transparent',
                color: gold,
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = gold;
                e.target.style.color = black;
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = gold;
              }}
            >
              Omitir por ahora
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '14px 28px',
                borderRadius: 8,
                border: 'none',
                background: gold,
                color: black,
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s'
              }}
            >
              {isSubmitting ? '🔄 Guardando...' : '✅ Completar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export default function RegistroCompleto() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    edad: '',
    pais: '',
    ciudad: '',
    posicion: [], // posiciones que juega el usuario
    experiencia: '',
    diasDisponibles: [],
    horariosEntrenamiento: '', // NUEVO: horarios preferidos
    equipoFavorito: '',
    foto: null,
    fotoNombre: '',
    fotoTipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);

  const procesarImagenCuadrada = (file) => new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
          canvas.toBlob((blob) => {
            const processedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
            resolve({ processedFile, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
          }, 'image/jpeg', 0.8);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError('Selecciona un archivo de imagen válido');
      return;
    }

    try {
      const { processedFile, dataUrl } = await procesarImagenCuadrada(file);
      if (processedFile.size > 5 * 1024 * 1024) {
        setError('La imagen procesada sigue siendo grande (>5MB). Elige otra más pequeña.');
        return;
      }
      setFormData(prev => ({ 
        ...prev, 
        foto: processedFile, 
        fotoNombre: file.name, 
        fotoTipo: file.type 
      }));
      setPreviewImagen(dataUrl);
      setError('');
    } catch (err) {
      setError('Error procesando la imagen: ' + err.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Google Auth handler - PRINCIPAL MÉTODO DE REGISTRO
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      // Guardar draft antes de redirigir
      const { foto, ...rest } = formData;
      const draftData = {
        ...rest,
        previewImagen,
        timestamp: Date.now()
      };
      localStorage.setItem('futpro_registro_draft', JSON.stringify(draftData));
      localStorage.setItem('postLoginRedirect', '/home');
      
      console.log('📝 Draft guardado:', draftData);
      console.log('🚀 Iniciando Google Auth...');
      
      // Llamar al servicio de autenticación
      await authService.signInWithGoogle();
    } catch (err) {
      console.error('❌ Error con Google Auth:', err);
      setError('Error al conectar con Google: ' + (err.message || 'Intenta de nuevo')); 
    } finally {
      setLoading(false);
    }
  };

  // Autoguardado
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (formData.email || formData.nombre) {
        setAutoSaving(true);
        const { foto, ...rest } = formData;
        localStorage.setItem('futpro_registro_draft', JSON.stringify({
          ...rest,
          previewImagen
        }));
        setLastSaved(Date.now());
        setTimeout(() => setAutoSaving(false), 500);
      }
    }, 1000);
    return () => clearTimeout(saveTimer);
  }, [formData, previewImagen]);

  // Cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem('futpro_registro_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { previewImagen: savedPreview, ...rest } = parsed;
        setFormData(prev => ({ ...prev, ...rest }));
        if (savedPreview) setPreviewImagen(savedPreview);
      } catch (e) {
        console.error('Error cargando datos guardados:', e);
      }
    }
  }, []);

  // Estilos mejorados
  const inputStyle = { 
    padding: '12px 14px', 
    borderRadius: 8, 
    border: '1px solid #333', 
    background: '#1a1a1a', 
    color: '#fff',
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  };

  // Todas las posiciones posibles (únicas)
  const posiciones = [
    'Portero',
    'Lateral Derecho',
    'Defensa Central',
    'Lateral Izquierdo',
    'Libero',
    'Mediocentro Defensivo',
    'Mediocentro',
    'Mediocentro Ofensivo',
    'Mediapunta',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero Centro',
    'Segundo Delantero',
    'Defensa',
    'Medio',
    'Delantero',
    'Cierre',
    'Ala',
    'Pivot',
    'Ataque'
  ];

  // Ciudades
  const ciudades = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 
    'Cartagena', 'Pereira', 'Manizales', 'Cúcuta', 'Ibagué', 
    'Santa Marta', 'Villavicencio', 'Pasto', 'Armenia', 'Otra'
  ];

  // Días de la semana
  const diasSemana = [
    { value: 'lunes', label: 'Lun' },
    { value: 'martes', label: 'Mar' },
    { value: 'miercoles', label: 'Mié' },
    { value: 'jueves', label: 'Jue' },
    { value: 'viernes', label: 'Vie' },
    { value: 'sabado', label: 'Sáb' },
    { value: 'domingo', label: 'Dom' }
  ];

  // Opciones de experiencia
  const nivelesExperiencia = [
    { value: 'principiante', label: '⚪ Principiante' },
    { value: 'intermedio', label: '🟡 Intermedio' },
    { value: 'avanzado', label: '🟠 Avanzado' },
    { value: 'profesional', label: '🔴 Profesional' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '20px 10px'
    }}>
      <div style={{ 
        background: 'rgba(26, 26, 26, 0.95)', 
        borderRadius: 16, 
        padding: '32px 28px', 
        width: '100%', 
        maxWidth: 560, 
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.1)',
        border: '1px solid rgba(255, 215, 0, 0.15)'
      }}>
        <h2 style={{ 
          color: '#FFD700', 
          textAlign: 'center', 
          marginBottom: 8,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: -0.5
        }}>
          ⚽ FutPro
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#999', 
          marginBottom: 28, 
          fontSize: 14 
        }}>
          Crea tu perfil profesional de jugador
        </p>
        
        {error && (
          <div style={{ 
            background: 'linear-gradient(135deg, #c62828 0%, #8e0000 100%)', 
            color: '#fff', 
            padding: '12px 16px', 
            borderRadius: 8, 
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ 
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', 
            color: '#fff', 
            padding: '12px 16px', 
            borderRadius: 8, 
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleGoogleAuth(); }} style={{ marginBottom: 0 }}>
          {/* Información Personal */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              fontSize: 12, 
              color: '#FFD700', 
              textTransform: 'uppercase', 
              letterSpacing: 1.2, 
              marginBottom: 12,
              fontWeight: 700
            }}>
              📋 Información Personal
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input 
                placeholder="Nombre *" 
                value={formData.nombre} 
                onChange={e => handleChange('nombre', e.target.value)} 
                style={inputStyle} 
              />
              <input 
                placeholder="Apellido" 
                value={formData.apellido} 
                onChange={e => handleChange('apellido', e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <input 
                type="email" 
                placeholder="Email *" 
                value={formData.email} 
                onChange={e => handleChange('email', e.target.value)} 
                style={inputStyle} 
              />
              <input 
                type="tel" 
                placeholder="Teléfono" 
                value={formData.telefono} 
                onChange={e => handleChange('telefono', e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <input 
                type="number" 
                min="10" 
                max="100" 
                placeholder="Edad" 
                value={formData.edad} 
                onChange={e => handleChange('edad', e.target.value)} 
                style={inputStyle} 
              />
              <input 
                placeholder="País" 
                value={formData.pais} 
                onChange={e => handleChange('pais', e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <select 
              value={formData.ciudad} 
              onChange={e => handleChange('ciudad', e.target.value)} 
              style={{...inputStyle, marginTop: 12, width: '100%'}}
            >
              <option value="">Selecciona tu ciudad</option>
              {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Información Deportiva */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              fontSize: 12, 
              color: '#FFD700', 
              textTransform: 'uppercase', 
              letterSpacing: 1.2, 
              marginBottom: 12,
              fontWeight: 700
            }}>
              ⚽ Perfil Deportivo
            </h3>
            
            {/* Posiciones: SIEMPRE todas */}
            <label style={labelStyle}>Posiciones que juegas</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
              gap: 8, 
              marginBottom: 16,
              maxHeight: 200,
              overflowY: 'auto',
              padding: 8,
              background: '#0f0f0f',
              borderRadius: 8,
              border: '1px solid #333'
            }}>
              {posiciones.map(pos => (
                <label 
                  key={pos} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: formData.posicion.includes(pos) ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                    border: `1px solid ${formData.posicion.includes(pos) ? '#FFD700' : '#222'}`,
                    fontSize: 12,
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={formData.posicion.includes(pos)}
                    onChange={e => {
                      const newPos = e.target.checked 
                        ? [...formData.posicion, pos] 
                        : formData.posicion.filter(p => p !== pos);
                      handleChange('posicion', newPos);
                    }}
                    style={{ margin: 0, accentColor: '#FFD700' }}
                  />
                  <span>{pos}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Nivel de experiencia</label>
                <select 
                  value={formData.experiencia} 
                  onChange={e => handleChange('experiencia', e.target.value)} 
                  style={inputStyle}
                >
                  <option value="">Selecciona nivel</option>
                  {nivelesExperiencia.map(niv => (
                    <option key={niv.value} value={niv.value}>{niv.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Equipo favorito</label>
                <input 
                  placeholder="Ej: Real Madrid" 
                  value={formData.equipoFavorito} 
                  onChange={e => handleChange('equipoFavorito', e.target.value)} 
                  style={inputStyle} 
                />
              </div>
            </div>
          </div>

          {/* Disponibilidad */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              fontSize: 12, 
              color: '#FFD700', 
              textTransform: 'uppercase', 
              letterSpacing: 1.2, 
              marginBottom: 12,
              fontWeight: 700
            }}>
              📅 Disponibilidad
            </h3>
            
            <label style={labelStyle}>Días disponibles para jugar</label>
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              flexWrap: 'wrap', 
              marginBottom: 16 
            }}>
              {diasSemana.map(dia => (
                <button
                  key={dia.value}
                  type="button"
                  onClick={() => {
                    const newDias = formData.diasDisponibles.includes(dia.value)
                      ? formData.diasDisponibles.filter(d => d !== dia.value)
                      : [...formData.diasDisponibles, dia.value];
                    handleChange('diasDisponibles', newDias);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: `2px solid ${formData.diasDisponibles.includes(dia.value) ? '#FFD700' : '#333'}`,
                    background: formData.diasDisponibles.includes(dia.value) ? 'rgba(255, 215, 0, 0.2)' : '#1a1a1a',
                    color: formData.diasDisponibles.includes(dia.value) ? '#FFD700' : '#999',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                >
                  {dia.label}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Horarios de entrenamiento preferidos</label>
            <select 
              value={formData.horariosEntrenamiento} 
              onChange={e => handleChange('horariosEntrenamiento', e.target.value)} 
              style={{...inputStyle, width: '100%'}}
            >
              <option value="">Selecciona horario</option>
              <option value="manana">🌅 Mañana (6:00 AM - 12:00 PM)</option>
              <option value="tarde">☀️ Tarde (12:00 PM - 6:00 PM)</option>
              <option value="noche">🌙 Noche (6:00 PM - 10:00 PM)</option>
              <option value="flexible">🔄 Flexible / Cualquier horario</option>
            </select>
          </div>

          {/* Foto de Perfil */}
          <div style={{ marginBottom: 28, padding: 16, background: '#0f0f0f', borderRadius: 10 }}>
            <label style={{...labelStyle, marginBottom: 10}}>📷 Foto de perfil (opcional)</label>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ 
                width: '100%', 
                padding: 10, 
                background: '#1a1a1a', 
                border: '1px dashed #444',
                borderRadius: 8,
                color: '#999',
                fontSize: 12,
                cursor: 'pointer'
              }} 
            />
            {previewImagen && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '2px solid #FFD700',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)'
                }}>
                  <img src={previewImagen} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, fontSize: 11, color: '#999' }}>
                  <div>📄 {formData.fotoNombre}</div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { 
                    setPreviewImagen(null); 
                    setFormData(prev => ({ ...prev, foto: null, fotoNombre: '', fotoTipo: '' })); 
                    if (fileInputRef.current) fileInputRef.current.value = ''; 
                  }} 
                  style={{ 
                    padding: '6px 12px', 
                    background: '#c62828', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Botón Google */}
          <button 
            type="submit"
            disabled={loading || !formData.nombre || !formData.email} 
            style={{ 
              width: '100%',
              padding: '16px', 
              background: loading ? '#555' : 'linear-gradient(135deg, #4285F4 0%, #34a853 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 10, 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 700, 
              fontSize: 16,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 12,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(66, 133, 244, 0.4)',
              transition: 'all 0.3s',
              fontFamily: 'inherit',
              opacity: loading || !formData.nombre || !formData.email ? 0.6 : 1
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loading ? '⏳ Procesando...' : '🚀 Continuar con Google'}
          </button>

          <div style={{ 
            marginTop: 20, 
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}>
            <div style={{
              height: 1,
              flex: 1,
              background: '#333'
            }}></div>
            <span style={{ 
              color: autoSaving ? '#FFD700' : '#666', 
              fontSize: 11, 
              textTransform: 'uppercase', 
              letterSpacing: 1,
              fontWeight: 600,
              padding: '0 8px'
            }}>
              {autoSaving ? '💾 Guardando...' : (lastSaved ? `✓ Guardado ${new Date(lastSaved).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : '📝 Auto-guardado activo')}
            </span>
            <div style={{
              height: 1,
              flex: 1,
              background: '#333'
            }}></div>
          </div>

          <button 
            type="button" 
            onClick={() => { 
              try { 
                navigate('/'); 
              } catch { 
                window.location.href = '/'; 
              } 
            }} 
            style={{ 
              width: '100%',
              marginTop: 16,
              padding: '10px', 
              background: 'transparent', 
              color: '#999', 
              border: '1px solid #333', 
              borderRadius: 8, 
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            ← Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
}
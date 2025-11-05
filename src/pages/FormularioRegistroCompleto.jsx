import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';

export default function FormularioRegistroCompleto() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pasoActual, setPasoActual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado del formulario completo
  const [formData, setFormData] = useState({
    // Paso 1: Credenciales
    email: '',
    password: '',
    confirmPassword: '',
    categoria: 'infantil_femenina',
    
    // Paso 2: Datos Personales
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    pais: '',
    ciudad: '',
    
    // Paso 3: Info Futbolística
    posicion: 'Flexible',
    nivelHabilidad: 'Principiante',
    equipoFavorito: '',
    peso: '',
    altura: '',
    pieHabil: 'Derecho',
    
    // Paso 4: Disponibilidad
    frecuenciaJuego: 'ocasional',
    horarioPreferido: 'tardes',
    objetivos: '',
    
    // Paso 5: Foto
    imagenPerfil: null,
    previewUrl: null
  });

  // Leer categoría desde navegación
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qs = params.get('categoria');
      const fromState = location.state?.categoria;
      const draftRaw = localStorage.getItem('draft_carfutpro');
      const draft = draftRaw ? JSON.parse(draftRaw) : null;
      const initial = fromState || qs || draft?.categoria;
      if (initial) setFormData(prev => ({ ...prev, categoria: initial }));
    } catch (e) {
      console.warn('No se pudo inicializar categoría:', e);
    }
  }, [location.state]);

  // Autoguardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const draft = { ...formData, ultimoGuardado: new Date().toISOString() };
        localStorage.setItem('draft_registro_completo', JSON.stringify(draft));
        console.log('📝 Autoguardado realizado');
      } catch (e) {
        console.warn('Error en autoguardado:', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagenPerfil: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const validarPaso = (paso) => {
    setError(null);
    switch (paso) {
      case 1:
        if (!formData.email || !formData.password) {
          setError('Email y contraseña son requeridos');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return false;
        }
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return false;
        }
        return true;
      case 2:
        if (!formData.nombre || !formData.apellido || !formData.edad) {
          setError('Nombre, apellido y edad son requeridos');
          return false;
        }
        return true;
      case 3:
        if (!formData.posicion) {
          setError('Selecciona una posición');
          return false;
        }
        return true;
      case 4:
        return true; // Opcional
      case 5:
        return true; // Foto es opcional
      default:
        return true;
    }
  };

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual(prev => Math.min(prev + 1, 5));
    }
  };

  const pasoAnterior = () => {
    setPasoActual(prev => Math.max(prev - 1, 1));
  };

  const completarRegistro = async () => {
    if (!validarPaso(pasoActual)) return;
    
    try {
      setLoading(true);
      setError(null);

      // 1. Crear cuenta en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nombre} ${formData.apellido}`,
            display_name: formData.nombre
          }
        }
      });

      if (authError) throw authError;

      // 2. Subir foto si existe
      let fotoUrl = null;
      if (formData.imagenPerfil && authData.user) {
        const fileName = `${authData.user.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.imagenPerfil);
        
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(uploadData.path);
          fotoUrl = urlData.publicUrl;
        }
      }

      // 3. Crear registro en tabla carfutpro
      if (authData.user) {
        const cardData = {
          user_id: authData.user.id,
          categoria: formData.categoria,
          nombre: `${formData.nombre} ${formData.apellido}`,
          ciudad: formData.ciudad,
          pais: formData.pais,
          posicion_favorita: formData.posicion,
          nivel_habilidad: formData.nivelHabilidad,
          puntaje: 50, // Puntaje inicial
          equipo: formData.equipoFavorito,
          avatar_url: fotoUrl,
          creada_en: new Date().toISOString(),
          estado: 'activa',
          // Datos adicionales
          edad: parseInt(formData.edad),
          telefono: formData.telefono,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          altura: formData.altura ? parseFloat(formData.altura) : null,
          pie_habil: formData.pieHabil,
          frecuencia_juego: formData.frecuenciaJuego,
          horario_preferido: formData.horarioPreferido,
          objetivos: formData.objetivos
        };

        const { data, error: insertError } = await supabase
          .from('carfutpro')
          .insert([cardData])
          .select()
          .single();

        if (insertError) throw insertError;

        // 4. Guardar datos para la card
        const cardDisplay = {
          id: data.id,
          categoria: data.categoria,
          nombre: data.nombre,
          ciudad: data.ciudad,
          pais: data.pais,
          posicion_favorita: data.posicion_favorita,
          nivel_habilidad: data.nivel_habilidad,
          puntaje: data.puntaje,
          equipo: data.equipo,
          fecha_registro: data.creada_en,
          esPrimeraCard: true,
          avatar_url: data.avatar_url,
          partidos_jugados: 0,
          goles: 0,
          asistencias: 0
        };

        localStorage.setItem('futpro_user_card_data', JSON.stringify(cardDisplay));
        localStorage.setItem('show_first_card', 'true');
        localStorage.removeItem('draft_registro_completo');

        // 5. Guardar en Firebase Realtime
        try {
          const { database } = await import('../config/firebase.js');
          const { ref, set } = await import('firebase/database');
          await set(ref(database, `carfutpro/${authData.user.id}`), data);
        } catch (e) {
          console.warn('Firebase sync opcional falló:', e);
        }

        // 6. Navegar a la card
        navigate('/perfil-card', { state: { cardData: cardDisplay } });
      }
    } catch (e) {
      setError(e.message || 'Error al completar registro');
      console.error('Error en registro:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>Paso 1: Credenciales</h2>
            <input type="email" name="email" required placeholder="Correo electrónico" value={formData.email} onChange={handleChange} style={inputStyle} />
            <input type="password" name="password" required placeholder="Contraseña" value={formData.password} onChange={handleChange} style={inputStyle} />
            <input type="password" name="confirmPassword" required placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
            <select name="categoria" value={formData.categoria} onChange={handleChange} required style={inputStyle}>
              <option value="infantil_femenina">Infantil Femenina</option>
              <option value="infantil_masculina">Infantil Masculina</option>
              <option value="femenina">Femenina</option>
              <option value="masculina">Masculina</option>
            </select>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>Paso 2: Datos Personales</h2>
            <input type="text" name="nombre" required placeholder="Nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} />
            <input type="text" name="apellido" required placeholder="Apellido" value={formData.apellido} onChange={handleChange} style={inputStyle} />
            <input type="number" name="edad" required placeholder="Edad" value={formData.edad} onChange={handleChange} style={inputStyle} min="5" max="99" />
            <input type="tel" name="telefono" placeholder="Teléfono (opcional)" value={formData.telefono} onChange={handleChange} style={inputStyle} />
            <input type="text" name="pais" placeholder="País" value={formData.pais} onChange={handleChange} style={inputStyle} />
            <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} style={inputStyle} />
          </>
        );
      
      case 3:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>Paso 3: Info Futbolística</h2>
            <select name="posicion" value={formData.posicion} onChange={handleChange} required style={inputStyle}>
              <option value="Portero">🥅 Portero</option>
              <option value="Defensa Central">🛡️ Defensa Central</option>
              <option value="Lateral Derecho">➡️ Lateral Derecho</option>
              <option value="Lateral Izquierdo">⬅️ Lateral Izquierdo</option>
              <option value="Mediocampista Defensivo">🔒 Mediocampista Defensivo</option>
              <option value="Mediocampista Central">⚖️ Mediocampista Central</option>
              <option value="Mediocampista Ofensivo">🎯 Mediocampista Ofensivo</option>
              <option value="Extremo Derecho">🏃‍♂️ Extremo Derecho</option>
              <option value="Extremo Izquierdo">🏃‍♂️ Extremo Izquierdo</option>
              <option value="Delantero Centro">⚽ Delantero Centro</option>
              <option value="Flexible">🔄 Flexible</option>
            </select>
            <select name="nivelHabilidad" value={formData.nivelHabilidad} onChange={handleChange} style={inputStyle}>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Élite">Élite</option>
            </select>
            <input type="text" name="equipoFavorito" placeholder="Equipo favorito" value={formData.equipoFavorito} onChange={handleChange} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input type="number" name="peso" placeholder="Peso (kg)" value={formData.peso} onChange={handleChange} style={inputStyle} />
              <input type="number" name="altura" placeholder="Altura (cm)" value={formData.altura} onChange={handleChange} style={inputStyle} />
            </div>
            <select name="pieHabil" value={formData.pieHabil} onChange={handleChange} style={inputStyle}>
              <option value="Derecho">Pie Derecho</option>
              <option value="Izquierdo">Pie Izquierdo</option>
              <option value="Ambidiestro">Ambidiestro</option>
            </select>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>Paso 4: Disponibilidad</h2>
            <select name="frecuenciaJuego" value={formData.frecuenciaJuego} onChange={handleChange} style={inputStyle}>
              <option value="ocasional">Ocasional (1-2 veces/mes)</option>
              <option value="regular">Regular (1 vez/semana)</option>
              <option value="frecuente">Frecuente (2-3 veces/semana)</option>
              <option value="intensivo">Intensivo (4+ veces/semana)</option>
            </select>
            <select name="horarioPreferido" value={formData.horarioPreferido} onChange={handleChange} style={inputStyle}>
              <option value="mañanas">Mañanas</option>
              <option value="tardes">Tardes</option>
              <option value="noches">Noches</option>
              <option value="fines_semana">Fines de semana</option>
            </select>
            <textarea name="objetivos" placeholder="¿Qué buscas en FutPro? (opcional)" value={formData.objetivos} onChange={handleChange} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
          </>
        );
      
      case 5:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>Paso 5: Foto de Perfil</h2>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {formData.previewUrl ? (
                <img src={formData.previewUrl} alt="Preview" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}` }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ ...inputStyle, padding: 8 }} />
            <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>Foto opcional. Puedes agregarla después desde tu perfil.</p>
          </>
        );
      
      default:
        return null;
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 12,
    background: '#1c1c1c',
    color: '#eee',
    border: '1px solid #333',
    borderRadius: 10,
    marginBottom: 10
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>Registro Completo</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map(num => (
            <div
              key={num}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: pasoActual >= num ? gold : '#333',
                color: pasoActual >= num ? '#000' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {renderPaso()}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {pasoActual > 1 && (
              <button type="button" onClick={pasoAnterior} disabled={loading} style={{ flex: 1, padding: 12, background: '#333', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                ← Anterior
              </button>
            )}
            {pasoActual < 5 ? (
              <button type="button" onClick={siguientePaso} disabled={loading} style={{ flex: 1, padding: 12, background: `linear-gradient(135deg, ${gold}, #ff8c00)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Siguiente →
              </button>
            ) : (
              <button type="button" onClick={completarRegistro} disabled={loading} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Creando cuenta...' : '✓ Completar'}
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#999' }}>
          Paso {pasoActual} de 5 • Autoguardado activo
        </div>
      </div>
    </div>
  );
}

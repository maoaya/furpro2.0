import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function CrearEquipo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'masculina',
    ubicacion: '',
    pais: '',
    maxJugadores: 11,
    nivelRequerido: 'principiante'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = [
    { number: 1, title: 'Información Básica', desc: 'Nombre y categoría del equipo' },
    { number: 2, title: 'Detalles', desc: 'Ubicación y configuración' },
    { number: 3, title: 'Escudo del Equipo', desc: 'Diseña o sube tu escudo' },
    { number: 4, title: 'Confirmación', desc: 'Revisa y crea tu equipo' }
  ];

  const getFieldsForStep = (step) => {
    switch(step) {
      case 1: return ['nombre', 'categoria'];
      case 2: return ['ubicacion', 'maxJugadores', 'nivelRequerido'];
      case 3: return []; // Logo es opcional
      case 4: return ['descripcion'];
      default: return [];
    }
  };

  const validateStep = (step) => {
    const fields = getFieldsForStep(step);
    return fields.every(field => {
      if (field === 'descripcion') return true; // opcional
      return form[field] && form[field].toString().trim() !== '';
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    } else {
      setError('Por favor completa todos los campos requeridos de este paso');
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no debe superar 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${user?.email}-${Date.now()}.${fileExt}`;
      const filePath = `team-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error subiendo logo:', err);
      throw err;
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  // Geolocalización automática para ubicación del equipo (lat,long) + Fallback por IP
  useEffect(() => {
    const fallbackIpGeo = async () => {
      try {
        // 1) ipapi.co (HTTPS)
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(t);
          if (res.ok) {
            const data = await res.json();
            const city = data?.city || '';
            const country = data?.country_name || '';
            if (city || country) {
              setForm(prev => ({
                ...prev,
                ubicacion: prev.ubicacion || [city, country].filter(Boolean).join(', '),
                pais: prev.pais || country
              }));
              return;
            }
          }
        } catch (_) {}

        // 2) ipwho.is (fallback)
        const controller2 = new AbortController();
        const t2 = setTimeout(() => controller2.abort(), 8000);
        try {
          const res2 = await fetch('https://ipwho.is/?fields=city,country', { signal: controller2.signal });
          clearTimeout(t2);
          if (res2.ok) {
            const data2 = await res2.json();
            const city2 = data2?.city || '';
            const country2 = data2?.country || '';
            if (city2 || country2) {
              setForm(prev => ({
                ...prev,
                ubicacion: prev.ubicacion || [city2, country2].filter(Boolean).join(', '),
                pais: prev.pais || country2
              }));
              return;
            }
          }
        } catch (_) {}
      } catch (_) {}
    };

    if (!form.ubicacion && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords || {};
          if (latitude && longitude) {
            setForm(prev => ({ ...prev, ubicacion: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
          } else {
            fallbackIpGeo();
          }
        },
        () => { fallbackIpGeo(); },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else if (!form.ubicacion) {
      // Si no hay geolocalización disponible
      fallbackIpGeo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user || !user.id) {
      setError('Debes iniciar sesión para crear un equipo.');
      setLoading(false);
      return;
    }

    if (!form.nombre || !form.ubicacion) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    let equipoCreado = false;
    try {
      // 1. Subir logo si existe
      let logoUrl = null;
      if (logoFile) {
        setSuccess('⬆️ Subiendo escudo...');
        logoUrl = await uploadLogo();
      }

      // 2. Crear equipo
      setSuccess('🏗️ Creando equipo...');
      const { data: teamData, error: supabaseError } = await supabase
        .from('teams')
        .insert([{
          name: form.nombre,
          description: form.descripcion,
          format: form.categoria,
          country: form.pais || 'Colombia',
          city: form.ubicacion,
          max_members: parseInt(form.maxJugadores),
          level: form.nivelRequerido,
          captain_id: user?.id,
          logo_url: logoUrl,
          is_recruiting: true
        }])
        .select();

      if (supabaseError) {
        console.error('Error creando equipo:', supabaseError);
        setError(supabaseError.message || 'Error al crear equipo');
        setSuccess('');
        return;
      }

      equipoCreado = true;
      setSuccess('Equipo creado, finalizando...');
      // 3. Crear la card del equipo en carfutpro
      if (teamData && teamData[0]) {
        try {
          const { error: cardError } = await supabase
            .from('carfutpro')
            .insert([{
              user_id: user?.id,
              nombre: form.nombre,
              apellido: '',
              equipo: form.nombre,
              categoria: form.categoria,
              ciudad: form.ubicacion,
              pais: form.pais || 'Colombia',
              posicion_favorita: 'Equipo',
              photo_url: logoUrl,
              avatar_url: logoUrl,
              es_equipo: true,
              team_id: teamData[0].id
            }]);
          if (cardError) {
            console.warn('Error creando card:', cardError);
          }
        } catch (cardErr) {
          console.warn('Error creando card del equipo:', cardErr);
        }
      }
    } catch (err) {
      console.error('Error creando equipo:', err);
      setError('Error al crear el equipo. Intenta nuevamente.');
      setSuccess('');
    } finally {
      setLoading(false);
      if (equipoCreado) {
        setSuccess('✅ ¡Equipo creado exitosamente!');
        setTimeout(() => {
          navigate('/equipos');
        }, 1500);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            ➕ Crear Equipo
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px' }}>
            Sigue los pasos para crear tu equipo profesional
          </p>
        </div>

        {/* Tutorial Inicial */}
        {showTutorial && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
            border: '2px solid #FFD700',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ color: '#FFD700', marginBottom: '12px', fontSize: '20px' }}>
                  💡 Guía Rápida: ¿Cómo crear un equipo?
                </h3>
                <ul style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li><strong style={{ color: '#FFD700' }}>Paso 1:</strong> Elige un nombre único y memorable para tu equipo</li>
                  <li><strong style={{ color: '#FFD700' }}>Paso 2:</strong> Selecciona la categoría (masculina, femenina, mixta, infantil)</li>
                  <li><strong style={{ color: '#FFD700' }}>Paso 3:</strong> Define la ubicación y el nivel de juego</li>
                  <li><strong style={{ color: '#FFD700' }}>Paso 4:</strong> Establece el número máximo de jugadores (recomendado: 11-22)</li>
                  <li><strong style={{ color: '#FFD700' }}>Paso 5:</strong> Añade una descripción para atraer jugadores</li>
                </ul>
                <p style={{ color: '#FFD700', marginTop: '12px', fontSize: '14px' }}>
                  ⚡ Una vez creado, podrás invitar jugadores y competir en torneos
                </p>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFD700',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 8px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '32px',
          position: 'relative'
        }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            right: '10%',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              borderRadius: '2px',
              width: `${((currentStep - 1) / 2) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= step.number
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                  : '#333',
                color: currentStep >= step.number ? '#000' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                margin: '0 auto 8px',
                border: currentStep === step.number ? '3px solid #FFD700' : 'none',
                boxShadow: currentStep >= step.number ? '0 0 20px rgba(255,215,0,0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: currentStep >= step.number ? '#FFD700' : '#666',
                marginBottom: '4px'
              }}>
                {step.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666'
              }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#181818',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '32px'
        }}>
          {/* PASO 1: Información Básica */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '24px' }}>
                📝 Paso 1: Información Básica
              </h2>
              
              {/* Nombre del Equipo */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  ⚽ Nombre del Equipo *
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>Consejo:</strong> Elige un nombre único que represente la identidad de tu equipo. Evita usar números o caracteres especiales. Ejemplos: "Los Invencibles", "Águilas FC", "Warriors United"
                  </p>
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ejemplo: FutPro Stars FC"
                  maxLength={50}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0a0a0a',
                    border: form.nombre ? '2px solid #FFD700' : '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    transition: 'border 0.3s'
                  }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: form.nombre.length > 40 ? '#ff3366' : '#666',
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {form.nombre.length}/50 caracteres
                </div>
              </div>

              {/* Categoría */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  🏷️ Categoría del Equipo *
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>¿Qué es esto?</strong> Define si tu equipo es masculino, femenino, mixto o infantil. Esto ayuda a encontrar competiciones adecuadas.
                  </p>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {[
                    { value: 'masculina', label: '👨 Masculina', desc: 'Equipo varonil' },
                    { value: 'femenina', label: '👩 Femenina', desc: 'Equipo femenil' },
                    { value: 'mixta', label: '👥 Mixta', desc: 'Hombres y mujeres' },
                    { value: 'infantil_masculina', label: '🧒 Infantil ♂', desc: 'Niños' },
                    { value: 'infantil_femenina', label: '👧 Infantil ♀', desc: 'Niñas' }
                  ].slice(0, 4).map((cat) => (
                    <div
                      key={cat.value}
                      onClick={() => handleChange({ target: { name: 'categoria', value: cat.value } })}
                      style={{
                        background: form.categoria === cat.value ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#0a0a0a',
                        color: form.categoria === cat.value ? '#000' : '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: form.categoria === cat.value ? 'none' : '1px solid #333',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s',
                        boxShadow: form.categoria === cat.value ? '0 4px 20px rgba(255,215,0,0.4)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (form.categoria !== cat.value) {
                          e.currentTarget.style.borderColor = '#FFD700';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (form.categoria !== cat.value) {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>
                        {cat.desc}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px' }}>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="masculina">👨 Masculina</option>
                    <option value="femenina">👩 Femenina</option>
                    <option value="mixta">👥 Mixta</option>
                    <option value="infantil_masculina">🧒 Infantil Masculina</option>
                    <option value="infantil_femenina">👧 Infantil Femenina</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Detalles y Configuración */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '24px' }}>
                ⚙️ Paso 2: Configuración del Equipo
              </h2>

              {/* Ubicación */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  📍 Ubicación *
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>¿Por qué es importante?</strong> Especifica ciudad y país para que otros jugadores de tu zona puedan encontrarte fácilmente. Ejemplo: "Barcelona, España" o "Ciudad de México, México"
                  </p>
                </div>
                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Ejemplo: Madrid, España"
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0a0a0a',
                    border: form.ubicacion ? '2px solid #FFD700' : '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Max Jugadores */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  👥 Máximo de Jugadores *
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>Recomendación:</strong> Para fútbol 11: 18-22 jugadores. Para fútbol 7: 12-15 jugadores. Para fútbol 5: 8-10 jugadores. Incluye titulares y suplentes.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  {[7, 11, 15, 18, 20, 22, 25, 30, 35, 40, 45, 50, 55, 60].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'maxJugadores', value: num } })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: form.maxJugadores === num ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#0a0a0a',
                        color: form.maxJugadores === num ? '#000' : '#fff',
                        border: form.maxJugadores === num ? 'none' : '1px solid #333',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: 'all 0.3s'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  name="maxJugadores"
                  value={form.maxJugadores}
                  onChange={handleChange}
                  min="5"
                  max="30"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                />
              </div>

              {/* Nivel Requerido */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  ⭐ Nivel Requerido *
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>Guía de niveles:</strong><br/>
                    • <strong>Principiante:</strong> Juego recreativo, para divertirse<br/>
                    • <strong>Intermedio:</strong> Competitivo local, partidos regulares<br/>
                    • <strong>Avanzado:</strong> Competiciones serias, entrenamientos<br/>
                    • <strong>Profesional:</strong> Nivel semipro/profesional
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { value: 'principiante', label: '🌱 Principiante', color: '#00ff88' },
                    { value: 'intermedio', label: '⚡ Intermedio', color: '#00ccff' },
                    { value: 'avanzado', label: '🔥 Avanzado', color: '#ff9500' },
                    { value: 'profesional', label: '👑 Profesional', color: '#ff3366' }
                  ].map((nivel) => (
                    <div
                      key={nivel.value}
                      onClick={() => handleChange({ target: { name: 'nivelRequerido', value: nivel.value } })}
                      style={{
                        background: form.nivelRequerido === nivel.value ? nivel.color : '#0a0a0a',
                        color: form.nivelRequerido === nivel.value ? '#000' : '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: form.nivelRequerido === nivel.value ? 'none' : '1px solid #333',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        transition: 'all 0.3s',
                        boxShadow: form.nivelRequerido === nivel.value ? `0 4px 20px ${nivel.color}66` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (form.nivelRequerido !== nivel.value) {
                          e.currentTarget.style.borderColor = nivel.color;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (form.nivelRequerido !== nivel.value) {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {nivel.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Descripción y Confirmación (contenido integrado en Escudo) */}

          {/* PASO 3: Escudo del Equipo */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '24px' }}>
                🛡️ Paso 3: Escudo del Equipo
              </h2>

              {/* Información */}
              <div style={{
                background: 'rgba(255,215,0,0.05)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(255,215,0,0.2)'
              }}>
                <p style={{ color: '#aaa', fontSize: '14px', margin: 0, marginBottom: '8px' }}>
                  💡 <strong style={{ color: '#FFD700' }}>El escudo es la identidad visual de tu equipo</strong>
                </p>
                <ul style={{ color: '#aaa', fontSize: '13px', marginLeft: '20px' }}>
                  <li>Sube una imagen (PNG, JPG, SVG) de máximo 5MB</li>
                  <li>Se recomienda formato cuadrado (500x500px mínimo)</li>
                  <li>Será visible en tu Team Card y perfil del equipo</li>
                </ul>
              </div>

              {/* Upload Zone */}
              <div style={{
                border: logoPreview ? '3px solid #FFD700' : '2px dashed #FFD700',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                background: logoPreview ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.03)',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => document.getElementById('logoInput').click()}
              >
                {logoPreview ? (
                  <div>
                    <div style={{
                      width: '200px',
                      height: '200px',
                      margin: '0 auto 16px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '4px solid #FFD700',
                      boxShadow: '0 0 30px rgba(255,215,0,0.5)'
                    }}>
                      <img 
                        src={logoPreview} 
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <p style={{ color: '#FFD700', fontSize: '16px', fontWeight: 'bold' }}>
                      ✅ Escudo cargado
                    </p>
                    <p style={{ color: '#aaa', fontSize: '13px' }}>
                      {logoFile?.name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        background: '#E74C3C',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '80px', marginBottom: '16px' }}>
                      🛡️
                    </div>
                    <p style={{ color: '#FFD700', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Click para subir escudo
                    </p>
                    <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
                      o arrastra tu imagen aquí
                    </p>
                    <p style={{ color: '#666', fontSize: '12px' }}>
                      PNG, JPG o SVG • Máximo 5MB
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* PASO 4: Descripción y Confirmación */}
          {currentStep === 4 && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '24px' }}>
                ✅ Paso 4: Descripción y Confirmación
              </h2>

              {/* Descripción */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  📝 Descripción del Equipo (Opcional)
                </label>
                <div style={{
                  background: 'rgba(255,215,0,0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255,215,0,0.2)'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    💡 <strong style={{ color: '#FFD700' }}>Atrae jugadores:</strong> Describe tu equipo, filosofía de juego, horarios de entrenamiento, objetivos y lo que buscas en nuevos jugadores. Una buena descripción aumenta las solicitudes.
                  </p>
                </div>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Ejemplo: Somos un equipo competitivo que busca jugadores comprometidos. Entrenamos martes y jueves 19:00h. Participamos en la liga local y torneos regionales. Buscamos jugadores con actitud positiva y ganas de mejorar."
                  rows={6}
                  maxLength={500}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '15px',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: form.descripcion.length > 450 ? '#ff3366' : '#666',
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {form.descripcion.length}/500 caracteres
                </div>
              </div>

              {/* Resumen Final - CARD ESTILO FIFA */}
              <div style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                border: '3px solid #FFD700',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
              }}>
                {/* Header Card */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 style={{ 
                    color: '#FFD700', 
                    fontSize: '24px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}>
                    {form.nombre || 'TU EQUIPO'}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                    {/* Puntaje */}
                    <div style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>⭐</span>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', lineHeight: '1' }}>0</div>
                        <div style={{ fontSize: '10px', color: '#000', opacity: 0.8 }}>PUNTOS</div>
                      </div>
                    </div>
                    
                    {/* Fans */}
                    <div style={{
                      background: 'linear-gradient(135deg, #ff3366 0%, #ff6b9d 100%)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '20px' }}>❤️</span>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>0</div>
                        <div style={{ fontSize: '10px', color: '#fff', opacity: 0.9 }}>FANS</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Escudo Preview */}
                {logoPreview && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      margin: '0 auto',
                      borderRadius: '50%',
                      background: '#000',
                      border: '4px solid #FFD700',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.5)'
                    }}>
                      <img src={logoPreview} alt="Escudo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>📌 Categoría:</span>
                    <span style={{ color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase' }}>{form.categoria}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>📍 Ubicación:</span>
                    <span style={{ color: '#00ccff', fontWeight: 'bold' }}>{form.ubicacion || '(Sin ubicación)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>👥 Máx. Jugadores:</span>
                    <span style={{ color: '#ff9500', fontWeight: 'bold' }}>{form.maxJugadores}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>🎯 Nivel:</span>
                    <span style={{ color: '#ff3366', fontWeight: 'bold', textTransform: 'capitalize' }}>{form.nivelRequerido}</span>
                  </div>
                  
                  {/* Estadísticas iniciales */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '8px',
                    marginTop: '12px',
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#FFD700', fontSize: '20px', fontWeight: 'bold' }}>0</div>
                      <div style={{ color: '#666', fontSize: '11px' }}>PARTIDOS</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: 'bold' }}>0</div>
                      <div style={{ color: '#666', fontSize: '11px' }}>VICTORIAS</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#00ccff', fontSize: '20px', fontWeight: 'bold' }}>0</div>
                      <div style={{ color: '#666', fontSize: '11px' }}>GOLES</div>
                    </div>
                  </div>
                </div>

                {/* Info adicional */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(255, 215, 0, 0.05)',
                  borderRadius: '8px',
                  border: '1px dashed #FFD700',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#FFD700', fontSize: '13px', margin: 0 }}>
                    ⚡ Tu equipo empezará con 0 puntos. Gana partidos y consigue fans para subir en el ranking
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div style={{
              background: '#ff3366',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#00ff88',
              color: '#000',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {success}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'space-between',
            marginTop: '32px'
          }}>
            {/* Botones izquierda */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/equipos')}
                style={{
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#333';
                }}
              >
                ✕ Cancelar
              </button>
              
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    background: 'transparent',
                    color: '#FFD700',
                    border: '2px solid #FFD700',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,215,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  ← Anterior
                </button>
              )}
            </div>

            {/* Botones derecha */}
            <div>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  style={{
                    background: validateStep(currentStep) 
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                      : '#666',
                    color: validateStep(currentStep) ? '#000' : '#999',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: validateStep(currentStep) ? 'pointer' : 'not-allowed',
                    boxShadow: validateStep(currentStep) ? '0 4px 20px rgba(255,215,0,0.3)' : 'none',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (validateStep(currentStep)) {
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !validateStep(1) || !validateStep(2)}
                  style={{
                    background: (loading || !validateStep(1) || !validateStep(2))
                      ? '#666' 
                      : 'linear-gradient(135deg, #00ff88, #00ccff)',
                    color: '#000',
                    border: 'none',
                    padding: '14px 40px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: (loading || !validateStep(1) || !validateStep(2)) ? 'not-allowed' : 'pointer',
                    boxShadow: (loading || !validateStep(1) || !validateStep(2)) 
                      ? 'none' 
                      : '0 4px 20px rgba(0,255,136,0.4)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && validateStep(1) && validateStep(2)) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 6px 24px rgba(0,255,136,0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 20px rgba(0,255,136,0.4)';
                  }}
                >
                  {loading ? '⏳ Creando Equipo...' : '✓ Crear Equipo'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

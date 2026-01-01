import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import { calculateTierFromPoints, CARD_TIERS } from '../services/CardService';

const PerfilCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  useEffect(() => {
    // ...código original del useEffect aquí...
  }, [user?.id]);

  const cargarCard = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      console.log('📍 Cargando card para user_id:', user.id);
      
      let { data: card, error } = await supabase
            .from('carfutpro')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error SELECT en PerfilCard:');
        console.error('Full error object:', error);
        console.error('Error breakdown:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          status: error.status
        });
        console.error('⚠️ Tabla carfutpro no existe o RLS bloqueando. Ejecutar cards_system.sql');
        throw error;
      }

      if (!card) {
        console.warn('⚠️ Card no encontrada. Intentando crear...');
        await crearCardFallback();
        return;
      }

      // Usar datos directamente de la card - NO hacer fallback a localStorage/Google
      console.log('✅ Card cargada desde DB:', card);
      const puntosNormalizados = computePuntos(card);
      const normalizedCard = { ...card, puntos_totales: puntosNormalizados };
      setCardData(normalizedCard);
      setProgreso(calcularProgreso(puntosNormalizados));
    } catch (err) {
      console.error('❌ Error cargando card:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const crearCardFallback = async () => {
    console.log('🔧 Fallback: Creando card...');
    
    // Intentar obtener datos pendientes del registro
    const pendingDataStr = localStorage.getItem('pendingProfileData');
    const draftStr = localStorage.getItem('draft_carfutpro');
    let formData = {};

    try {
      if (pendingDataStr) {
        formData = { ...formData, ...(JSON.parse(pendingDataStr) || {}) };
        console.log('📄 pendingProfileData:', formData);
      }
    } catch (e) {
      console.error('Error parsing pendingProfileData:', e);
    }

    try {
      if (draftStr) {
        formData = { ...formData, ...(JSON.parse(draftStr) || {}) };
        console.log('📄 draft_carfutpro:', formData);
      }
    } catch (e) {
      console.error('Error parsing draft_carfutpro:', e);
    }

    // Construir card con datos mínimos requeridos por schema
    const cardData = {
      user_id: user.id,
      nombre: formData.nombre || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
      avatar_url: formData.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      ciudad: formData.ciudad || null,
      pais: formData.pais || null,
      posicion: formData.posicion || formData.posicion_favorita || null,
      edad: formData.edad ? Number(formData.edad) : null,
      pie: formData.pie || null,
      estatura: formData.estatura ? Number(formData.estatura) : null,
      equipo: formData.equipo || null,
      nivel_habilidad: formData.nivel_habilidad || null,
      categoria: formData.categoria || null,
      puntos_totales: 35,
      card_tier: 'futpro',
      partidos_ganados: 0,
      entrenamientos: 0,
      amistosos: 0,
      puntos_comportamiento: 0
    };

    console.log('📋 Insertando cardData:', cardData);

    const { data: insertedCard, error: insertError } = await supabase
        .from('carfutpro')
      .insert([cardData])
      .select();

    if (insertError) {
      console.error('❌ Error INSERT en PerfilCard fallback:');
      console.error('Full error object:', insertError);
      console.error('Error breakdown:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        status: insertError.status
      });
      console.error('⚠️ SOLUCIÓN: Ejecutar cards_system.sql en Supabase (ver EJECUTAR_SQL_AHORA.md)');
      setLoading(false);
      return;
    }

    console.log('✅ Card creada en fallback:', insertedCard);
    const normalized = insertedCard[0];
    const puntosNormalizados = computePuntos(normalized);
    const normalizedCard = { ...normalized, puntos_totales: puntosNormalizados };
    setCardData(normalizedCard);
    setProgreso(calcularProgreso(puntosNormalizados));
    setLoading(false);
    localStorage.removeItem('pendingProfileData');
  };

  const getTierColor = (tier) => {
    const colors = {
      futpro: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      bronce: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
      plata: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
      oro: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      diamante: 'linear-gradient(135deg, #B9F2FF 0%, #00CED1 100%)',
      leyenda: 'linear-gradient(135deg, #FF1493 0%, #8B008B 100%)'
    };
    return colors[tier] || colors.futpro;
  };

  const getTierLabel = (tier) => {
    const labels = {
      futpro: 'FUTPRO',
      bronce: 'BRONCE',
      plata: 'PLATA',
      oro: 'ORO',
      diamante: 'DIAMANTE',
      leyenda: 'LEYENDA'
    };
    return labels[tier] || 'FUTPRO';
  };

  const computePuntos = (card) => {
    // Base inicial 15 puntos para tier futpro, pasa a bronce al llegar a 35
    const base = card?.card_tier === 'futpro' ? 15 : 35;
    const partidosGanados = Number(card?.partidos_ganados) || 0;
    const empates = Number(card?.empates) || 0;
    const conducta = Number(card?.puntos_comportamiento) || 0;
    const campeon = Number(card?.campeonatos_ganados) || 0;
    const calculado = base + partidosGanados * 1 + empates * 0.5 + conducta * 1 + campeon * 3;
    const stored = Number(card?.puntos_totales);
    return Number.isFinite(stored) ? Math.max(stored, calculado) : calculado;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ color: '#FFD700', fontSize: '1.5rem' }}>⚽ Cargando tu card...</div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '20px' }}>
        <div style={{ color: '#FF4444', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
          ⚠️ Card no encontrada
        </div>
        <div style={{ color: '#FFD700', fontSize: '1rem', marginBottom: '30px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
          El sistema no logró crear tu card durante el registro. Abre la consola (F12) y copia los errores en rojo para que podamos diagnosticar.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(255,215,0,0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  const tier = cardData.card_tier || 'bronce';
  const puntos = cardData.puntos_totales ?? 15;

  // Mapeo de categorías
  const categoriaLabels = {
    masculino: 'Masculina',
    femenino: 'Femenina',
    infantil_masculino: 'Infantil Masculina',
    infantil_femenino: 'Infantil Femenina',
    mixto: 'Mixto',
    infantil: 'Infantil'
  };

  // Mostrar datos directamente de la card (NO fallback a Google)
  const displayAvatar = cardData.avatar_url || 'https://i.pravatar.cc/300?u=' + (user?.id || 'futpro');
  const displayCiudad = cardData.ciudad || '—';
  const displayPais = cardData.pais || '—';
  // Mostrar ubicación si existe
  const displayUbicacion = (cardData.ubicacion || displayCiudad) + (displayPais !== '—' ? `, ${displayPais}` : '');
  const displayCategoria = categoriaLabels[cardData.categoria] || (cardData.categoria ? cardData.categoria : '—');
  const displayPosicion = cardData.posicion || '—';
  const displayPie = cardData.pie || '—';
  const displayEstatura = cardData.estatura ? `${cardData.estatura} m` : '—';
  const displayEdad = (cardData.edad ?? '') !== '' ? cardData.edad : '—';
  const displayPeso = (cardData.peso ?? '') !== '' && cardData.peso != null ? `${cardData.peso} kg` : '—';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: '#FFD700',
        fontSize: '2.5rem',
        marginBottom: '10px',
        textShadow: '0 0 20px #FFD700'
      }}>
        CARD FUTPRO
      </h1>
      
      <p style={{ color: '#fff', marginBottom: '30px', fontSize: '1.1rem' }}>
        Tier actual: <strong style={{ color: progreso?.config?.color }}>{getTierLabel(tier)}</strong>
      </p>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: getTierColor(tier),
        borderRadius: '20px',
        padding: '25px',
        boxShadow: `0 15px 50px ${progreso?.config?.color}99`,
        position: 'relative',
        border: `4px solid ${progreso?.config?.color}`,
        marginBottom: '30px',
        overflow: 'hidden'
      }}>
        {/* Header con TIER */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            letterSpacing: '3px'
          }}>
            {getTierLabel(tier)}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#fff',
            fontWeight: 'bold',
            marginTop: '5px',
            letterSpacing: '1px'
          }}>
            {puntos} PUNTOS
          </div>
        </div>

        {/* Foto + Calificación al lado (FIFA style) */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          {/* Foto circular */}
          <div style={{
            width: '140px',
            height: '140px',
            minWidth: '140px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '5px solid #fff',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
            backgroundImage: `url(${displayAvatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <img 
              src={displayAvatar} 
              alt={cardData.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Datos + Calificación (lado derecho) */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Nombre y Ubicación */}
            <div>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                textTransform: 'uppercase',
                lineHeight: '1.2'
              }}>
                {cardData.nombre}
              </div>
              <div style={{ 
                color: '#f0f0f0', 
                marginTop: '5px', 
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {displayUbicacion}
              </div>
              <div style={{ 
                color: '#FFD700', 
                marginTop: '3px', 
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                {displayCategoria}
              </div>
            </div>

            {/* Calificación GRANDE (FIFA style) */}
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center',
              marginTop: '10px',
              border: '2px solid #FFD700'
            }}>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: '#FFD700',
                lineHeight: '1'
              }}>
                {Math.floor(puntos / 10) || 75}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#fff',
                marginTop: '3px',
                letterSpacing: '1px'
              }}>
                RATING
              </div>
            </div>
          </div>
        </div>

        {/* Posición y Datos Físicos */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{displayPosicion}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>POSICIÓN</div>
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{displayPie}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>PIE</div>
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{displayEstatura}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ALTURA</div>
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{displayEdad}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>EDAD</div>
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{displayPeso}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>PESO</div>
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>
              <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{cardData.nivel_habilidad || '—'}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>NIVEL</div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>⚽ PARTIDOS</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>{cardData.partidos_ganados || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>🏋️ ENTRENOS</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>{cardData.entrenamientos || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>🤝 AMISTOSOS</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>{cardData.amistosos || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>⭐ CONDUCTA</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>{cardData.puntos_comportamiento || 0}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.9rem',
          opacity: 0.85,
          letterSpacing: '2px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          ⚽ CARD FUTPRO • {getTierLabel(tier)}
        </div>
      </div>

      {progreso && progreso.tierSiguiente && (
        <div style={{
          width: '350px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ color: '#fff', marginBottom: '10px', textAlign: 'center' }}>
            Progreso hacia <strong style={{ color: getTierConfig()[progreso.tierSiguiente]?.color }}>
              {getTierLabel(progreso.tierSiguiente)}
            </strong>
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${progreso.porcentaje}%`,
              height: '100%',
              background: getTierConfig()[progreso.tierSiguiente]?.color,
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ color: '#FFD700', textAlign: 'center', fontSize: '0.9rem' }}>
            {progreso.puntosParaSiguiente} puntos restantes ({progreso.porcentaje}%)
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(255,215,0,0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🏠 Continuar
        </button>

        <button
          onClick={() => navigate('/perfil/me')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '2px solid #FFD700',
            borderRadius: '25px',
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,215,0,0.2)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          👤 Ver Perfil Completo
        </button>
      </div>

      <div style={{
        marginTop: '40px',
        background: 'rgba(255,215,0,0.1)',
        borderRadius: '15px',
        padding: '20px',
        maxWidth: '500px',
        border: '1px solid rgba(255,215,0,0.3)'
      }}>
        <h3 style={{ color: '#FFD700', marginBottom: '15px', textAlign: 'center' }}>
          💡 ¿Cómo ganar puntos?
        </h3>
        <div style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <div>⚽ <strong>Partido ganado:</strong> +3 puntos</div>
          <div>🏋️ <strong>Entrenamiento:</strong> +1 punto</div>
          <div>🤝 <strong>Amistoso:</strong> +1 punto</div>
          <div>⭐ <strong>Buen comportamiento:</strong> +1 punto</div>
        </div>
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#FFD700'
        }}>
          <div><strong>Bronce:</strong> 0-99 pts</div>
          <div><strong>Plata:</strong> 100-249 pts</div>
          <div><strong>Oro:</strong> 250-499 pts</div>
          <div><strong>Diamante:</strong> 500-999 pts</div>
          <div><strong>Leyenda:</strong> 1,000+ pts 🏆</div>
        </div>
      </div>
    </div>
  );
}

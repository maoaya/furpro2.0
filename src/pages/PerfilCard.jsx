import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import cardManager, { CARD_TIERS } from '../services/CardManager';

const PerfilCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [progreso, setProgreso] = useState(null);
  
  useEffect(() => {
    cargarCard();
  }, [user?.id]);

  const cargarCard = async () => {
    console.log('🔍 Iniciando carga de card...');
    console.log('👤 Usuario actual:', user);
    
    // Primero intentar cargar desde location state o localStorage
    const cardFromState = location.state?.cardData;
    const cardFromLocalStorage = localStorage.getItem('futpro_user_card_data');
    
    console.log('📦 Card desde state:', cardFromState);
    console.log('💾 Card desde localStorage:', cardFromLocalStorage ? 'Disponible' : 'No disponible');
    
    if (cardFromState) {
      console.log('✅ Usando card desde navigation state');
      setCardData(cardFromState);
      setLoading(false);
      return;
    }
    
    if (cardFromLocalStorage) {
      try {
        const parsedCard = JSON.parse(cardFromLocalStorage);
        console.log('✅ Usando card desde localStorage:', parsedCard);
        setCardData(parsedCard);
        setLoading(false);
        return;
      } catch (e) {
        console.error('❌ Error parseando localStorage card:', e);
      }
    }
    
    if (!user && !cardFromState && !cardFromLocalStorage) {
      console.warn('⚠️ No hay usuario ni datos de card, redirigiendo...');
      navigate('/')
      return
    }

    setLoading(true)
    try {
      console.log('📍 Cargando card para user_id:', user.id)
      
      const card = await cardManager.getCard(user.id)

      if (!card) {
        console.warn('⚠️ Card no encontrada. Intentando crear fallback...')
        await crearCardFallback()
        return
      }

      console.log('✅ Card cargada:', card)
      const normalized = {
        ...card,
        puntos_totales: Number(card.puntos_totales) || 0
      }
      setCardData(normalized)
      setProgreso(calcularProgreso(normalized.puntos_totales))
    } catch (err) {
      console.error('❌ Error cargando card:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      })
    } finally {
      setLoading(false)
    }
  };

  const crearCardFallback = async () => {
    console.log('🔧 Fallback: Creando card...')
    
    const pendingDataStr = localStorage.getItem('pendingProfileData')
    const draftStr = localStorage.getItem('draft_carfutpro')
    let formData = {}

    try {
      if (pendingDataStr) {
        formData = { ...formData, ...JSON.parse(pendingDataStr) }
      }
    } catch (e) {
      console.error('Error parsing pendingProfileData:', e)
    }

    try {
      if (draftStr) {
        formData = { ...formData, ...JSON.parse(draftStr) }
      }
    } catch (e) {
      console.error('Error parsing draft_carfutpro:', e)
    }

    try {
      const card = await cardManager.createCard(user.id, formData)
      console.log('✅ Card creada en fallback:', card)
      const normalized = {
        ...card,
        puntos_totales: Number(card.puntos_totales) || 0
      }
      setCardData(normalized)
      setProgreso(calcularProgreso(normalized.puntos_totales))
      localStorage.removeItem('pendingProfileData')
      localStorage.removeItem('draft_carfutpro')
    } catch (insertError) {
      console.error('❌ Error creando card fallback:', insertError)
      setError(`No se pudo crear la card: ${insertError.message}`)
    } finally {
      setLoading(false)
    }
  };

  const getTierColor = (tier) => {
    const tierData = Object.values(CARD_TIERS).find(t => t.tier === tier)
    if (!tierData) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
    
    const colorMap = {
      futpro: `linear-gradient(135deg, ${tierData.color} 0%, #FFA500 100%)`,
      bronce: `linear-gradient(135deg, ${tierData.color} 0%, #8B4513 100%)`,
      plata: `linear-gradient(135deg, ${tierData.color} 0%, #808080 100%)`,
      oro: `linear-gradient(135deg, ${tierData.color} 0%, #FFA500 100%)`,
      diamante: `linear-gradient(135deg, ${tierData.color} 0%, #00CED1 100%)`,
      leyenda: `linear-gradient(135deg, ${tierData.color} 0%, #8B008B 100%)`
    }
    return colorMap[tier] || `linear-gradient(135deg, ${tierData.color} 0%, rgba(${tierData.color}, 0.5) 100%)`
  }

  const getTierLabel = (tier) => {
    const tierData = Object.values(CARD_TIERS).find(t => t.tier === tier)
    return tierData ? tierData.label.split(' ')[1] : 'FUTPRO'
  }

  const calcularProgreso = (puntos) => {
    const progress = cardManager.calculateProgress(puntos)
    return {
      tierActual: progress.current?.tier,
      tierSiguiente: progress.next?.tier,
      puntosParaSiguiente: progress.pointsToNext,
      porcentaje: Math.round(progress.percentage),
      config: progress.current
    }
  }

  const getTierConfig = () => CARD_TIERS

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
  const puntos = cardData.puntos_totales ?? 0;

  // Mapeo de categorías (deben coincidir con valores en BD)
  const categoriaLabels = {
    masculina: 'Masculina',
    femenina: 'Femenina',
    infantil_masculina: 'Infantil Masculina',
    infantil_femenina: 'Infantil Femenina',
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
        boxShadow: `0 15px 50px ${progreso?.config?.color || '#FFD700'}99`,
        position: 'relative',
        border: `4px solid ${progreso?.config?.color || '#FFD700'}`,
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

        {/* Avatar y nombre */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: '#fff',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={displayAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
              {cardData.nombre}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#FFD700',
              marginTop: '3px'
            }}>
              {displayUbicacion}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#fff',
              marginTop: '3px'
            }}>
              {displayCategoria}
            </div>
          </div>
          <div style={{
            background: '#FFD700',
            color: '#000',
            padding: '12px 18px',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {puntos}
            <div style={{ fontSize: '0.7rem', fontWeight: 'normal', marginTop: '2px' }}>RATING</div>
          </div>
        </div>

        {/* Atributos en grid tipo FIFA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '15px',
          background: 'rgba(0,0,0,0.3)',
          padding: '12px',
          borderRadius: '10px'
        }}>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{displayPosicion}</div>
            <div>POSICIÓN</div>
          </div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{displayPie}</div>
            <div>PIE</div>
          </div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{displayEstatura}</div>
            <div>ALTURA</div>
          </div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{displayEdad}</div>
            <div>EDAD</div>
          </div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{displayPeso}</div>
            <div>PESO</div>
          </div>
          <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{cardData.nivel_habilidad || 'N/A'}</div>
            <div>NIVEL</div>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          background: 'rgba(0,0,0,0.3)',
          padding: '12px',
          borderRadius: '10px'
        }}>
          <div style={{
            textAlign: 'center',
            borderRight: '1px solid #FFD700',
            paddingRight: '10px'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FFD700' }}>⚽ {cardData.partidos_ganados || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#fff' }}>PARTIDOS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FFD700' }}>🎖️ {cardData.puntos_comportamiento || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#fff' }}>CONDUCTA</div>
          </div>
        </div>
      </div>

      {/* Progreso hacia siguiente tier */}
      {progreso && progreso.tierSiguiente && (
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
      )}

      {/* Progreso hacia siguiente tier */}
      {progreso && progreso.tierSiguiente && (
        <div style={{
          width: '100%',
          maxWidth: '420px',
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

export default PerfilCard;

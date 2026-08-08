import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function Tarjetas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadCards();
  }, [user]);

  const loadCards = async () => {
    if (!user) return;

    // Datos de ejemplo - puedes conectar con Supabase más tarde
    const cardsData = [
      {
        id: 1,
        rating: 85,
        position: 'ST',
        name: user?.user_metadata?.full_name || 'Mi Card',
        country: '🇦🇷',
        club: 'FutPro FC',
        pace: 88,
        shooting: 86,
        passing: 82,
        dribbling: 87,
        defending: 42,
        physical: 78,
        tipo: 'gold',
        fecha: new Date()
      },
      {
        id: 2,
        rating: 78,
        position: 'CAM',
        name: 'Card Especial',
        country: '🇧🇷',
        club: 'FutPro FC',
        pace: 84,
        shooting: 80,
        passing: 86,
        dribbling: 88,
        defending: 45,
        physical: 72,
        tipo: 'rare',
        fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        rating: 90,
        position: 'CM',
        name: 'Card Legendario',
        country: '🇪🇸',
        club: 'FutPro FC',
        pace: 90,
        shooting: 88,
        passing: 92,
        dribbling: 91,
        defending: 80,
        physical: 85,
        tipo: 'legend',
        fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    setCards(cardsData);
    setLoading(false);
  };

  const getCardGradient = (tipo) => {
    switch (tipo) {
      case 'legend':
        return 'linear-gradient(135deg, #ff00ff, #00ffff)';
      case 'rare':
        return 'linear-gradient(135deg, #ff6b35, #f7931e)';
      case 'gold':
      default:
        return 'linear-gradient(135deg, #FFD700, #FFA500)';
    }
  };

  const FIFACard = ({ card, onClick }) => (
    <div
      onClick={() => onClick(card)}
      style={{
        cursor: 'pointer',
        background: getCardGradient(card.tipo),
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        ':hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      }}
    >
      {/* Rating */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#000',
        textShadow: '2px 2px 4px rgba(255,255,255,0.3)'
      }}>
        {card.rating}
      </div>

      {/* Position */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000'
      }}>
        {card.position}
      </div>

      {/* Country */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '32px'
      }}>
        {card.country}
      </div>

      {/* Player Photo Placeholder */}
      <div style={{
        width: '120px',
        height: '120px',
        margin: '80px auto 20px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '64px'
      }}>
        👤
      </div>

      {/* Name */}
      <div style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000',
        marginBottom: '8px',
        textTransform: 'uppercase'
      }}>
        {card.name}
      </div>

      {/* Club */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#000',
        opacity: 0.8,
        marginBottom: '16px'
      }}>
        {card.club}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        fontSize: '12px',
        color: '#000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.pace}</div>
          <div style={{ opacity: 0.7 }}>PAC</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.shooting}</div>
          <div style={{ opacity: 0.7 }}>SHO</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.passing}</div>
          <div style={{ opacity: 0.7 }}>PAS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.dribbling}</div>
          <div style={{ opacity: 0.7 }}>DRI</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.defending}</div>
          <div style={{ opacity: 0.7 }}>DEF</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{card.physical}</div>
          <div style={{ opacity: 0.7 }}>PHY</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#FFD700' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎴</div>
        <div style={{ fontSize: '18px' }}>Cargando tarjetas...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px'
      }}>
        <h1 style={{
          fontSize: '48px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🆔 Mis Tarjetas
        </h1>
        <button
          onClick={() => navigate('/card-fifa')}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 24px rgba(255,215,0,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(255,215,0,0.3)';
          }}
        >
          ➕ Crear Nueva Tarjeta
        </button>
      </div>

      {/* Info */}
      <div style={{
        background: '#181818',
        border: '2px solid #FFD700',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '16px', color: '#aaa' }}>
          Tienes <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>
            {cards.length}
          </span> tarjetas en tu colección
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {cards.map(card => (
          <FIFACard key={card.id} card={card} onClick={setSelectedCard} />
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <FIFACard card={selectedCard} onClick={() => {}} />
            <div style={{
              marginTop: '24px',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => navigate('/card-fifa')}
                style={{
                  background: '#FFD700',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
              <button
                onClick={() => setSelectedCard(null)}
                style={{
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

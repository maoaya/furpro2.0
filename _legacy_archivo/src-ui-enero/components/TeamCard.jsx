import React from 'react';

/**
 * Team Card - Similar a FIFA Card pero para equipos
 * Muestra OVR calculado, stats, escudo, torneos ganados
 */
export default function TeamCard({ 
  team, 
  size = 'normal', // 'small' | 'normal' | 'large'
  showStats = true,
  onClick 
}) {
  const sizes = {
    small: { width: 140, height: 200 },
    normal: { width: 180, height: 260 },
    large: { width: 240, height: 340 }
  };

  const currentSize = sizes[size];

  // Calcular OVR del equipo (se calculará con servicio)
  const calculateOVR = () => {
    if (!team.stats) return 70;
    
    const avgPlayerOVR = team.stats.avg_player_ovr || 70;
    const tournamentBonus = (team.stats.tournaments_won || 0) * 2;
    const winRateBonus = Math.floor((team.stats.win_rate || 0) * 10);
    
    return Math.min(99, Math.floor(avgPlayerOVR + tournamentBonus + winRateBonus));
  };

  const ovr = calculateOVR();
  
  // Color del OVR según el rating
  const getOVRColor = (rating) => {
    if (rating >= 90) return '#1CE1AC'; // Teal (top)
    if (rating >= 85) return '#FFD700'; // Gold
    if (rating >= 80) return '#C0C0C0'; // Silver
    if (rating >= 75) return '#CD7F32'; // Bronze
    return '#B0B0B0'; // Common
  };

  const ovrColor = getOVRColor(ovr);

  return (
    <div 
      onClick={onClick}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        border: `3px solid ${ovrColor}`,
        borderRadius: '16px',
        padding: '16px',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: `0 4px 12px ${ovrColor}44`,
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 20px ${ovrColor}66`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${ovrColor}44`;
        }
      }}
    >
      {/* Patrón de fondo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header con OVR y Racha */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* OVR */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: size === 'large' ? '48px' : size === 'normal' ? '36px' : '28px',
            fontWeight: 'bold',
            color: ovrColor,
            lineHeight: 1,
            textShadow: `0 2px 8px ${ovrColor}88`
          }}>
            {ovr}
          </div>
          <div style={{
            fontSize: size === 'large' ? '11px' : '9px',
            color: '#aaa',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            OVR
          </div>
        </div>

        {/* Racha/Win Rate */}
        {team.stats?.current_streak && (
          <div style={{
            background: team.stats.current_streak > 0 ? '#2ECC71' : '#E74C3C',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: size === 'large' ? '14px' : '12px',
            fontWeight: 'bold'
          }}>
            {team.stats.current_streak > 0 ? '🔥' : '❄️'} {Math.abs(team.stats.current_streak)}
          </div>
        )}
      </div>

      {/* Escudo del Equipo */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: size === 'large' ? '100px' : size === 'normal' ? '80px' : '60px',
          height: size === 'large' ? '100px' : size === 'normal' ? '80px' : '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${ovrColor}`,
          boxShadow: `0 0 20px ${ovrColor}66`,
          background: '#0a0a0a'
        }}>
          {team.logo_url ? (
            <img 
              src={team.logo_url} 
              alt={team.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size === 'large' ? '40px' : size === 'normal' ? '32px' : '24px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)'
            }}>
              🛡️
            </div>
          )}
        </div>
      </div>

      {/* Nombre del Equipo */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: size === 'large' ? '18px' : size === 'normal' ? '16px' : '14px',
          fontWeight: 'bold',
          color: '#FFD700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '0 8px'
        }}>
          {team.name}
        </div>
        {team.category && (
          <div style={{
            fontSize: size === 'large' ? '11px' : '9px',
            color: '#aaa',
            marginTop: '4px',
            textTransform: 'capitalize'
          }}>
            {team.category}
          </div>
        )}
      </div>

      {/* Stats del Equipo */}
      {showStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '8px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* ATT */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: size === 'large' ? '20px' : size === 'normal' ? '18px' : '16px',
              fontWeight: 'bold',
              color: '#E74C3C'
            }}>
              {team.stats?.attack || 70}
            </div>
            <div style={{
              fontSize: size === 'large' ? '10px' : '8px',
              color: '#aaa',
              fontWeight: 'bold'
            }}>
              ATT
            </div>
          </div>

          {/* MID */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: size === 'large' ? '20px' : size === 'normal' ? '18px' : '16px',
              fontWeight: 'bold',
              color: '#3498DB'
            }}>
              {team.stats?.midfield || 70}
            </div>
            <div style={{
              fontSize: size === 'large' ? '10px' : '8px',
              color: '#aaa',
              fontWeight: 'bold'
            }}>
              MID
            </div>
          </div>

          {/* DEF */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: size === 'large' ? '20px' : size === 'normal' ? '18px' : '16px',
              fontWeight: 'bold',
              color: '#2ECC71'
            }}>
              {team.stats?.defense || 70}
            </div>
            <div style={{
              fontSize: size === 'large' ? '10px' : '8px',
              color: '#aaa',
              fontWeight: 'bold'
            }}>
              DEF
            </div>
          </div>
        </div>
      )}

      {/* Footer: Torneos Ganados */}
      {team.stats?.tournaments_won > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(255,215,0,0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255,215,0,0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{ fontSize: size === 'large' ? '18px' : '16px' }}>🏆</span>
          <span style={{
            fontSize: size === 'large' ? '14px' : '12px',
            color: '#FFD700',
            fontWeight: 'bold'
          }}>
            {team.stats.tournaments_won}
          </span>
        </div>
      )}

      {/* Badge de categoría en esquina */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: ovrColor,
        color: '#000',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: size === 'large' ? '10px' : '8px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        zIndex: 2
      }}>
        TEAM
      </div>
    </div>
  );
}

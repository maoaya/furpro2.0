import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import TeamCard from './TeamCard'
import SeleccionarAlineacion from './SeleccionarAlineacion'

export function GoldenPlaceholder({
  title = 'Página',
  subtitle = 'Descripción',
  children,
  showBackButton = true,
  actionLabel = 'Volver',
  onAction = null,
  // Integración opcional: pasar team y tournament para mostrar demo
  team = null,
  tournament = null,
}) {
  const navigate = useNavigate()
  const [showLineup, setShowLineup] = useState(false)

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      navigate('/')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        color: '#f0f0f0',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fondo de puntos decorativos */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(2px 2px at 20px 30px, #FFD700, rgba(255, 215, 0, 0.2))',
          backgroundSize: '200px 200px',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      {/* Contenido principal */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '40px',
            borderBottom: '2px solid #FFD700',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#FFD700',
                margin: '0 0 10px 0',
                textShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#FFA500',
                margin: 0,
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          </div>
          {showBackButton && (
            <button
              onClick={handleAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                transition: '0.15s ease',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.5)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: '1rem' }} />
              {actionLabel}
            </button>
          )}
        </div>

        {/* Contenido */}
        <div
          style={{
            background: 'rgba(10, 10, 10, 0.5)',
            borderRadius: '12px',
            border: '1px solid #FFD700',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {children ? (
            children
          ) : (
            <div>
              {/* Demo de integración: TeamCard + botón de alineación */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <TeamCard
                  team={
                    team || {
                      name: 'FutPro Stars FC',
                      category: 'masculina',
                      logo_url: null,
                      stats: {
                        avg_player_ovr: 76,
                        tournaments_won: 2,
                        win_rate: 62,
                        current_streak: 3,
                        attack: 78,
                        midfield: 75,
                        defense: 72,
                      },
                    }
                  }
                  size="large"
                  showStats
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{ color: '#FFA500', marginBottom: 12 }}>
                  Esta es tu Team Card. Sube el escudo en Crear Equipo y selecciona la alineación al inscribirte.
                </p>
                <button
                  onClick={() => setShowLineup(true)}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 16px rgba(255, 215, 0, 0.35)'
                  }}
                >
                  ⚽ Seleccionar Alineación (demo)
                </button>
              </div>

              {/* Loader minimal para contexto antiguo */}
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '3px solid #FFD700',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de selección de alineación (demo) */}
      {showLineup && (
        <SeleccionarAlineacion
          teamId={team?.id || 'demo-team-id'}
          tournamentId={tournament?.id || 'demo-tournament-id'}
          tournamentFormat={tournament?.format || '11v11'}
          onClose={() => setShowLineup(false)}
          onSave={() => setShowLineup(false)}
        />
      )}
    </div>
  )
}

export default GoldenPlaceholder

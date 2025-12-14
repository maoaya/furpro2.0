import React from 'react'
import { useTournamentInvites } from '../hooks/useTournamentInvites'

export default function TournamentInviteBanner() {
  const { invites, loading, error, accept, decline } = useTournamentInvites()

  if (loading) return null
  if (error) return null
  if (!invites?.length) return null

  return (
    <div style={{ background: '#111', color: '#ffd700', border: '1px solid #333', borderRadius: 8, padding: 12, margin: '12px 0' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Tienes invitaciones a torneos</div>
      {invites.map(inv => (
        <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 0', borderTop: '1px solid #222' }}>
          <div>
            <div style={{ fontSize: 14 }}>
              Invitación: <strong>{inv.tournament?.name || inv.tournament_id}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#ccc' }}>
              Equipo: {inv.team?.name || inv.team_id} · Enviado por: {inv.invited_by || 'organizador'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => accept(inv)} style={{ background: '#1f6f2e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Aceptar</button>
            <button onClick={() => decline(inv)} style={{ background: '#7a1a1a', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Rechazar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

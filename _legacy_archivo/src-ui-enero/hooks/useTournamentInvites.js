import { useEffect, useState, useCallback } from 'react'
import { dbOperations } from '../config/supabase'
import { AuthService } from '../services/AuthService'

export function useTournamentInvites() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [invites, setInvites] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = await AuthService.getCurrentSession()
      const email = session?.user?.email
      if (!email) {
        setInvites([])
      } else {
        const data = await dbOperations.listTournamentInvitationsForEmail(email)
        setInvites(data)
      }
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const accept = useCallback(async (invite) => {
    try {
      const session = await AuthService.getCurrentSession()
      const email = session?.user?.email
      await dbOperations.acceptTournamentInvitation(invite.id, invite.tournament_id, invite.team_id, email)
      await load()
      return { ok: true }
    } catch (e) {
      setError(e)
      return { ok: false, error: e }
    }
  }, [load])

  const decline = useCallback(async (invite) => {
    try {
      await dbOperations.declineTournamentInvitation(invite.id)
      await load()
      return { ok: true }
    } catch (e) {
      setError(e)
      return { ok: false, error: e }
    }
  }, [load])

  return { invites, loading, error, reload: load, accept, decline }
}

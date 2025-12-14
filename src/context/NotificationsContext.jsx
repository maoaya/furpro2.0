import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../config/supabase'
import { NotificationManager } from '../services/NotificationManager'
import { useAuth } from './AuthContext'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [nm] = useState(() => new NotificationManager({
    saveNotification: async (n) => {
      try {
        await supabase.from('notifications').insert([{
          type: n.type,
          title: n.title,
          body: n.body,
          icon: n.icon,
          user_id: user?.id || null,
          data: n.data,
          created_at: n.timestamp
        }])
      } catch {}
    }
  }, { showToast: (msg, level) => console.log(`[toast:${level}]`, msg) }))

  useEffect(() => {
    if (!user) return

    // Aviso si el permiso de notificaciones está denegado
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
        nm.ui?.showToast?.('Notificaciones del navegador denegadas. Habilítalas en ajustes.', 'info')
      }
    } catch {}

    const channelFriends = supabase
      .channel('friends:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friends' }, (payload) => {
        const f = payload.new
        if (f.friend_email === user.email) {
          const notif = nm.createNotification('FOLLOW', { userId: user.id, followerEmail: f.user_email })
          setItems(prev => [notif, ...prev])
          setUnread(u => u + 1)
        }
        if (f.user_email === user.email) {
          // following increased
        }
      })
      .subscribe()

    const channelLikes = supabase
      .channel('likes:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, (payload) => {
        const notif = nm.createNotification('LIKE', { userId: user.id, postId: payload.new.post_id })
        setItems(prev => [notif, ...prev])
        setUnread(u => u + 1)
      })
      .subscribe()

    const channelComments = supabase
      .channel('comments:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        const notif = nm.createNotification('COMMENT', { userId: user.id, postId: payload.new.post_id, content: payload.new.content })
        setItems(prev => [notif, ...prev])
        setUnread(u => u + 1)
      })
      .subscribe()

    const channelInvites = supabase
      .channel('tournament_invitations:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournament_invitations' }, (payload) => {
        const inv = payload.new
        if (!inv) return
        if (inv.invited_email === user.email && inv.status === 'pending') {
          const notif = nm.createNotification('TEAM_INVITE', { userId: user.id, tournamentId: inv.tournament_id, teamId: inv.team_id })
          setItems(prev => [notif, ...prev])
          setUnread(u => u + 1)
        }
        if (payload.eventType === 'UPDATE' && inv.invited_email === user.email && inv.status === 'accepted') {
          const notif = nm.createNotification('TOURNAMENT', { userId: user.id, tournamentId: inv.tournament_id })
          setItems(prev => [notif, ...prev])
          setUnread(u => u + 1)
        }
      })
      .subscribe()

    const channelTournaments = supabase
      .channel('tournaments:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tournaments' }, (payload) => {
        const t = payload.new
        const notif = nm.createNotification('TOURNAMENT', { userId: user.id, tournamentId: t.id, name: t.name })
        setItems(prev => [notif, ...prev])
        setUnread(u => u + 1)
      })
      .subscribe()

    const channelMatches = supabase
      .channel('matches:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, (payload) => {
        const m = payload.new
        const notif = nm.createNotification('MATCH', { userId: user.id, matchId: m.id, location: m.location, when: m.scheduled_at || m.created_at })
        setItems(prev => [notif, ...prev])
        setUnread(u => u + 1)
      })
      .subscribe()

    return () => {
      channelFriends.unsubscribe()
      channelLikes.unsubscribe()
      channelComments.unsubscribe()
      channelInvites.unsubscribe()
      channelTournaments.unsubscribe()
      channelMatches.unsubscribe()
    }
  }, [user, nm])

  const markAllRead = () => setUnread(0)
  const value = useMemo(() => ({ items, unread, markAllRead }), [items, unread])

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}

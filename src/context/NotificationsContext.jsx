import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { cleanupRealtimeChannels } from '../utils/realtimeCleanup'
import {
  disableOnSchemaError,
  isTableDisabled,
  withTableProbe,
} from '../utils/schemaCompatibilityGate.js'

const NotificationsContext = createContext(null)

const TYPE_META = {
  LIKE: { title: 'Nuevo like', body: 'A alguien le gustó tu publicación', icon: '⚽' },
  COMMENT: { title: 'Nuevo comentario', body: 'Comentaron tu publicación', icon: '💬' },
  FOLLOW: { title: 'Nuevo seguidor', body: 'Alguien te empezó a seguir', icon: '👤' },
  TEAM_INVITE: { title: 'Invitación', body: 'Te invitaron a un equipo/torneo', icon: '📨' },
  TOURNAMENT: { title: 'Torneo', body: 'Novedad de torneo', icon: '🏆' },
  MATCH: { title: 'Partido', body: 'Nuevo partido programado', icon: '📅' },
  MESSAGE: { title: 'Mensaje', body: 'Tienes un mensaje nuevo', icon: '💬' },
  SYSTEM: { title: 'FutPro', body: 'Nueva notificación', icon: '🔔' },
}

function buildLocalNotification(type, data = {}) {
  const meta = TYPE_META[type] || TYPE_META.SYSTEM
  const title = data.title || meta.title
  let body = data.body || meta.body
  if (type === 'FOLLOW' && data.followerEmail) body = `${data.followerEmail} te sigue`
  if (type === 'COMMENT' && data.content) body = String(data.content).slice(0, 120)
  if (type === 'TOURNAMENT' && data.name) body = data.name
  if (type === 'MATCH' && data.location) body = `Partido en ${data.location}`
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    body,
    icon: meta.icon,
    timestamp: new Date().toISOString(),
    read: false,
    data,
  }
}

function normalizeRow(row) {
  if (!row) return null
  return {
    id: row.id || `db-${row.created_at || Date.now()}`,
    type: (row.type || 'SYSTEM').toString().toUpperCase(),
    title: row.title || row.titulo || TYPE_META.SYSTEM.title,
    body: row.body || row.mensaje || row.content || '',
    icon: row.icon || '🔔',
    timestamp: row.created_at || row.timestamp || new Date().toISOString(),
    read: Boolean(row.read || row.leido || row.read_at),
    data: row.data || {},
  }
}

async function persistNotification(userId, notif) {
  if (!userId || !notif) return
  const payload = {
    type: notif.type,
    title: notif.title,
    body: notif.body,
    icon: notif.icon,
    user_id: userId,
    data: notif.data || {},
    created_at: notif.timestamp,
  }
  // Prefer English table; fallback Spanish (schema drift)
  for (const table of ['notifications', 'notificaciones']) {
    if (isTableDisabled(table)) continue
    try {
      const { error } = await supabase.from(table).insert([payload])
      if (error) {
        disableOnSchemaError(error, { table })
        continue
      }
      return
    } catch (e) {
      disableOnSchemaError(e, { table })
    }
  }
}

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [status, setStatus] = useState('idle') // idle|ready|error
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const pushItem = useCallback((notif) => {
    if (!notif || !mounted.current) return
    setItems((prev) => {
      if (prev.some((p) => p.id === notif.id)) return prev
      return [notif, ...prev].slice(0, 80)
    })
    if (!notif.read) setUnread((u) => u + 1)
  }, [])

  const loadInitial = useCallback(async (userId) => {
    if (!userId) return
    const tables = ['notifications', 'notificaciones']
    for (const table of tables) {
      if (isTableDisabled(table)) continue
      const result = await withTableProbe(table, async () => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(40)
        if (error) disableOnSchemaError(error, { table })
        return { data, error }
      })
      if (result?.skipped || result?.error) continue
      const rows = (result?.data || []).map(normalizeRow).filter(Boolean)
      if (!mounted.current) return
      setItems(rows)
      setUnread(rows.filter((r) => !r.read).length)
      setStatus('ready')
      return
    }
    setStatus('ready')
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setItems([])
      setUnread(0)
      setStatus('idle')
      return undefined
    }

    loadInitial(user.id)

    const channels = []
    const subscribe = (name, table, handler, filter) => {
      if (isTableDisabled(table)) return null
      let ch = supabase.channel(name)
      const cfg = { event: '*', schema: 'public', table }
      if (filter) cfg.filter = filter
      ch = ch.on('postgres_changes', cfg, (payload) => {
        try { handler(payload) } catch (e) { console.warn('[notif]', e?.message || e) }
      })
      ch.subscribe((s) => {
        if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') {
          console.warn(`[notif] channel ${name}: ${s}`)
          setStatus('error')
        } else if (s === 'SUBSCRIBED') {
          setStatus('ready')
        }
      })
      channels.push(ch)
      return ch
    }

    // 1) Tabla canónica de notificaciones (ambos nombres por drift)
    const onNotifRow = (payload) => {
      const row = payload.new
      if (!row) return
      if (row.user_id && row.user_id !== user.id) return
      pushItem(normalizeRow(row))
    }
    subscribe(`notif:notifications:${user.id}`, 'notifications', onNotifRow, `user_id=eq.${user.id}`)
    subscribe(`notif:notificaciones:${user.id}`, 'notificaciones', onNotifRow, `user_id=eq.${user.id}`)

    // 2) Eventos sociales → notificación in-app (tablas alineadas a Home + legacy)
    subscribe(`notif:friends:${user.id}`, 'friends', (payload) => {
      if (payload.eventType !== 'INSERT') return
      const f = payload.new
      if (!f) return
      if (f.friend_email === user.email || f.friend_id === user.id) {
        const notif = buildLocalNotification('FOLLOW', {
          followerEmail: f.user_email || f.follower_email,
          userId: user.id,
        })
        pushItem(notif)
        persistNotification(user.id, notif)
      }
    })

    const onLike = (payload) => {
      if (payload.eventType !== 'INSERT') return
      const row = payload.new
      if (!row) return
      // Solo si el like es sobre contenido del usuario (cuando hay owner)
      if (row.owner_id && row.owner_id !== user.id) return
      if (row.user_id === user.id) return // no auto-notificar
      const notif = buildLocalNotification('LIKE', { userId: user.id, postId: row.post_id })
      pushItem(notif)
      persistNotification(user.id, notif)
    }
    subscribe(`notif:likes:${user.id}`, 'likes', onLike)
    subscribe(`notif:post_likes:${user.id}`, 'post_likes', onLike)

    const onComment = (payload) => {
      if (payload.eventType !== 'INSERT') return
      const row = payload.new
      if (!row) return
      if (row.user_id === user.id) return
      if (row.owner_id && row.owner_id !== user.id) return
      const notif = buildLocalNotification('COMMENT', {
        userId: user.id,
        postId: row.post_id,
        content: row.content || row.texto,
      })
      pushItem(notif)
      persistNotification(user.id, notif)
    }
    subscribe(`notif:comments:${user.id}`, 'comments', onComment)
    subscribe(`notif:post_comments:${user.id}`, 'post_comments', onComment)

    subscribe(`notif:invites:${user.id}`, 'tournament_invitations', (payload) => {
      const inv = payload.new
      if (!inv) return
      if (inv.invited_email !== user.email && inv.recipient_id !== user.id) return
      if (inv.status === 'pending' || payload.eventType === 'INSERT') {
        const notif = buildLocalNotification('TEAM_INVITE', {
          userId: user.id,
          tournamentId: inv.tournament_id,
          teamId: inv.team_id,
        })
        pushItem(notif)
        persistNotification(user.id, notif)
      }
    })

    return cleanupRealtimeChannels(supabase, ...channels)
  }, [user?.id, user?.email, loadInitial, pushItem])

  const markAllRead = useCallback(() => {
    setUnread(0)
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const value = useMemo(
    () => ({ items, unread, markAllRead, status, pushItem }),
    [items, unread, markAllRead, status, pushItem]
  )

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}

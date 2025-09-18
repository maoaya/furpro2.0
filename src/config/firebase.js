// 🔥 Configuración de Firebase para FutPro
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { getDatabase, ref, set, get, push, onValue, off } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'TU_FIREBASE_API_KEY',
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID || 'TU_FIREBASE_PROJECT_ID',
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

// Proveedores de autenticación
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account'
})

facebookProvider.setCustomParameters({
  display: 'popup'
})

// 💬 Servicios de Chat en Tiempo Real
export const chatService = {
  // Enviar mensaje
  async sendMessage(chatId, message) {
    const messagesRef = ref(database, `chats/${chatId}/messages`)
    const newMessageRef = push(messagesRef)
    
    await set(newMessageRef, {
      ...message,
      timestamp: Date.now(),
      id: newMessageRef.key
    })
    
    // Actualizar último mensaje del chat
    await set(ref(database, `chats/${chatId}/lastMessage`), {
      text: message.text,
      timestamp: Date.now(),
      senderId: message.senderId
    })
    
    return newMessageRef.key
  },

  // Escuchar mensajes
  subscribeToMessages(chatId, callback) {
    const messagesRef = ref(database, `chats/${chatId}/messages`)
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      const messages = data ? Object.values(data).sort((a, b) => a.timestamp - b.timestamp) : []
      callback(messages)
    })
    
    return () => off(messagesRef)
  },

  // Crear chat de equipo
  async createTeamChat(teamId, teamName) {
    const chatRef = ref(database, `chats/team_${teamId}`)
    await set(chatRef, {
      id: `team_${teamId}`,
      type: 'team',
      name: `Chat ${teamName}`,
      teamId: teamId,
      createdAt: Date.now(),
      members: {},
      lastMessage: null
    })
    
    return `team_${teamId}`
  },

  // Crear chat de torneo
  async createTournamentChat(tournamentId, tournamentName) {
    const chatRef = ref(database, `chats/tournament_${tournamentId}`)
    await set(chatRef, {
      id: `tournament_${tournamentId}`,
      type: 'tournament',
      name: `Chat ${tournamentName}`,
      tournamentId: tournamentId,
      createdAt: Date.now(),
      members: {},
      lastMessage: null
    })
    
    return `tournament_${tournamentId}`
  },

  // Unirse a chat
  async joinChat(chatId, userId, userInfo) {
    const memberRef = ref(database, `chats/${chatId}/members/${userId}`)
    await set(memberRef, {
      ...userInfo,
      joinedAt: Date.now()
    })
  },

  // Salir de chat
  async leaveChat(chatId, userId) {
    const memberRef = ref(database, `chats/${chatId}/members/${userId}`)
    await set(memberRef, null)
  },

  // Obtener chats del usuario
  async getUserChats(userId, callback) {
    const chatsRef = ref(database, 'chats')
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        callback([])
        return
      }
      
      const userChats = Object.values(data).filter(chat => 
        chat.members && chat.members[userId]
      )
      
      callback(userChats)
    })
  }
}

// 📺 Servicios de Transmisión en Vivo
export const streamingService = {
  // Crear transmisión
  async createStream(streamData) {
    const streamRef = ref(database, `streams/${streamData.id}`)
    await set(streamRef, {
      ...streamData,
      createdAt: Date.now(),
      status: 'live',
      viewers: {},
      viewerCount: 0
    })
    
    return streamData.id
  },

  // Unirse a transmisión como espectador
  async joinStream(streamId, viewerId, viewerInfo) {
    const viewerRef = ref(database, `streams/${streamId}/viewers/${viewerId}`)
    await set(viewerRef, {
      ...viewerInfo,
      joinedAt: Date.now()
    })
    
    // Actualizar contador
  const snapshot = await get(ref(database, `streams/${streamId}`))
    const stream = snapshot.val()
    
    if (stream) {
      const viewerCount = Object.keys(stream.viewers || {}).length
      await set(ref(database, `streams/${streamId}/viewerCount`), viewerCount)
    }
  },

  // Salir de transmisión
  async leaveStream(streamId, viewerId) {
    const viewerRef = ref(database, `streams/${streamId}/viewers/${viewerId}`)
    await set(viewerRef, null)
    
    // Actualizar contador
  const snapshot = await get(ref(database, `streams/${streamId}`))
    const stream = snapshot.val()
    
    if (stream) {
      const viewerCount = Math.max(0, Object.keys(stream.viewers || {}).length)
      await set(ref(database, `streams/${streamId}/viewerCount`), viewerCount)
    }
  },

  // Finalizar transmisión
  async endStream(streamId) {
  await set(ref(database, `streams/${streamId}/status`), 'ended')
  await set(ref(database, `streams/${streamId}/endedAt`), Date.now())
  },

  // Escuchar transmisiones activas
  subscribeToActiveStreams(callback) {
    const streamsRef = ref(database, 'streams')
    onValue(streamsRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        callback([])
        return
      }
      
      const activeStreams = Object.values(data).filter(stream => 
        stream.status === 'live'
      )
      
      callback(activeStreams)
    })
  },

  // Enviar señal WebRTC
  async sendSignal(streamId, signal, targetId = null) {
    const signalRef = targetId 
      ? ref(database, `signals/${streamId}/${targetId}`)
      : ref(database, `signals/${streamId}/broadcast`)
    
    const newSignalRef = push(signalRef)
    await set(newSignalRef, {
      ...signal,
      timestamp: Date.now()
    })
  },

  // Escuchar señales WebRTC
  subscribeToSignals(streamId, userId, callback) {
    const signalsRef = ref(database, `signals/${streamId}/${userId}`)
    onValue(signalsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const signals = Object.values(data)
        callback(signals)
        // Limpiar señales procesadas
        set(signalsRef, null)
      }
    })
  }
}

// 📱 Servicios de Historias
export const storiesService = {
  // Crear historia
  async createStory(storyData) {
    const storyRef = ref(database, `stories/${storyData.userId}/${storyData.id}`)
    await set(storyRef, {
      ...storyData,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      views: {}
    })
    
    return storyData.id
  },

  // Ver historia
  async viewStory(storyId, userId, viewerId, viewerInfo) {
    const viewRef = ref(database, `stories/${userId}/${storyId}/views/${viewerId}`)
    await set(viewRef, {
      ...viewerInfo,
      viewedAt: Date.now()
    })
  },

  // Obtener historias activas
  async getActiveStories(userIds, callback) {
    const now = Date.now()
    const allStories = []
    
    for (const userId of userIds) {
      const userStoriesRef = ref(database, `stories/${userId}`)
      onValue(userStoriesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const activeStories = Object.values(data).filter(story => 
            story.expiresAt > now
          )
          
          if (activeStories.length > 0) {
            allStories.push({
              userId,
              stories: activeStories.sort((a, b) => a.createdAt - b.createdAt)
            })
          }
        }
      })
    }
    
    callback(allStories)
  },

  // Limpiar historias expiradas
  async cleanExpiredStories() {
    const now = Date.now()
    const storiesRef = ref(database, 'stories')
    const snapshot = await get(storiesRef)
    const data = snapshot.val()
    
    if (data) {
      for (const [userId, userStories] of Object.entries(data)) {
        for (const [storyId, story] of Object.entries(userStories)) {
          if (story.expiresAt < now) {
            await set(ref(database, `stories/${userId}/${storyId}`), null)
          }
        }
      }
    }
  }
}

// 🎮 Servicios de Juego de Penaltis
export const penaltyGameService = {
  // Registrar intento de penalty
  async recordPenaltyAttempt(userId, attempt) {
    const attemptRef = ref(database, `penaltyGame/${userId}/attempts`)
    const newAttemptRef = push(attemptRef)
    
    await set(newAttemptRef, {
      ...attempt,
      timestamp: Date.now()
    })
    
    // Actualizar estadísticas del usuario
    const statsRef = ref(database, `penaltyGame/${userId}/stats`)
    const snapshot = await get(statsRef)
    const currentStats = snapshot.val() || {
      totalAttempts: 0,
      successful: 0,
      streak: 0,
      bestStreak: 0,
      lastAttempt: 0
    }
    
    const newStats = {
      ...currentStats,
      totalAttempts: currentStats.totalAttempts + 1,
      successful: attempt.successful ? currentStats.successful + 1 : currentStats.successful,
      streak: attempt.successful ? currentStats.streak + 1 : 0,
      bestStreak: attempt.successful ? 
        Math.max(currentStats.bestStreak, currentStats.streak + 1) : 
        currentStats.bestStreak,
      lastAttempt: Date.now()
    }
    
    await set(statsRef, newStats)
    
    return newStats
  },

  // Verificar si puede jugar (cooldown)
  async canPlay(userId) {
    const statsRef = ref(database, `penaltyGame/${userId}/stats`)
    const snapshot = await get(statsRef)
    const stats = snapshot.val()
    
    if (!stats) return true
    
    const cooldownHours = 8
    const cooldownMs = cooldownHours * 60 * 60 * 1000
    const timeSinceLastAttempt = Date.now() - stats.lastAttempt
    
    return timeSinceLastAttempt >= cooldownMs
  },

  // Obtener ranking de penaltis
  async getPenaltyRanking() {
    const gameRef = ref(database, 'penaltyGame')
    const snapshot = await get(gameRef)
    const data = snapshot.val()
    
    if (!data) return []
    
    const ranking = Object.entries(data)
      .map(([userId, userData]) => ({
        userId,
        stats: userData.stats
      }))
      .filter(user => user.stats && user.stats.totalAttempts > 0)
      .sort((a, b) => {
        // Ordenar por porcentaje de éxito, luego por mejor racha
        const aPercentage = a.stats.successful / a.stats.totalAttempts
        const bPercentage = b.stats.successful / b.stats.totalAttempts
        
        if (aPercentage !== bPercentage) {
          return bPercentage - aPercentage
        }
        
        return b.stats.bestStreak - a.stats.bestStreak
      })
    
    return ranking.slice(0, 50) // Top 50
  }
}

// 🔔 Servicios de Notificaciones Push
export const notificationService = {
  // Registrar token de dispositivo
  async registerDevice(userId, token, deviceInfo) {
    const deviceRef = ref(database, `devices/${userId}/${token}`)
    await set(deviceRef, {
      ...deviceInfo,
      token,
      registeredAt: Date.now(),
      lastSeen: Date.now()
    })
  },

  // Enviar notificación
  async sendNotification(userId, notification) {
    const notificationRef = ref(database, `notifications/${userId}`)
    const newNotificationRef = push(notificationRef)
    
    await set(newNotificationRef, {
      ...notification,
      timestamp: Date.now(),
      read: false
    })
  },

  // Marcar como leída
  async markAsRead(userId, notificationId) {
  await set(ref(database, `notifications/${userId}/${notificationId}/read`), true)
  },

  // Escuchar notificaciones
  subscribeToNotifications(userId, callback) {
    const notificationsRef = ref(database, `notifications/${userId}`)
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val()
      const notifications = data ? 
        Object.entries(data).map(([id, notif]) => ({ id, ...notif })) : []
      
      callback(notifications.sort((a, b) => b.timestamp - a.timestamp))
    })
  }
}

// 🏟️ Servicios de Partidos en Vivo
export const liveMatchService = {
  // Iniciar partido en vivo
  async startLiveMatch(matchId, matchData) {
    const matchRef = ref(database, `liveMatches/${matchId}`)
    await set(matchRef, {
      ...matchData,
      status: 'live',
      startTime: Date.now(),
      events: {},
      score: { team1: 0, team2: 0 },
      timer: 0
    })
  },

  // Actualizar marcador
  async updateScore(matchId, team1Score, team2Score) {
    const scoreRef = ref(database, `liveMatches/${matchId}/score`)
    await set(scoreRef, { team1: team1Score, team2: team2Score })
  },

  // Agregar evento
  async addEvent(matchId, event) {
    const eventsRef = ref(database, `liveMatches/${matchId}/events`)
    const newEventRef = push(eventsRef)
    
    await set(newEventRef, {
      ...event,
      timestamp: Date.now()
    })
  },

  // Escuchar partido en vivo
  subscribeToLiveMatch(matchId, callback) {
    const matchRef = ref(database, `liveMatches/${matchId}`)
    onValue(matchRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const events = data.events ? Object.values(data.events) : []
        callback({
          ...data,
          events: events.sort((a, b) => a.timestamp - b.timestamp)
        })
      }
    })
  }
}

export default app

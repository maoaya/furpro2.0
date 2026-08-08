self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Claim clients to start controlling pages ASAP
  event.waitUntil(self.clients.claim())
})

// Placeholder push handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'FutPro', body: 'Notificación' }
  event.waitUntil(
    self.registration.showNotification(data.title || 'FutPro', {
      body: data.body,
      icon: data.icon || '/icons/icon-192.png',
      tag: data.tag || 'futpro',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})

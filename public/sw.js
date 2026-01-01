// Service Worker minimalista sin caché para evitar servir HTML obsoleto
// Versión aumentada para forzar limpieza de caches antiguos
const CACHE_NAME = 'futpro-no-cache-v1.0.3';

// Instalar y activar de inmediato
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // Borrar caches heredados en instalación
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Asegurar limpieza total y tomar control
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Todas las peticiones van directo a red sin cachear
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de FutPro',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver ahora',
        icon: '/assets/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/assets/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('FutPro', options)
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Abrir la app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Solo cerrar notificación
    return;
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sincronizar datos pendientes cuando hay conexión
    const pendingData = await getStoredPendingData();
    
    for (const item of pendingData) {
      syncDataItem(item);
    }
    
    await clearPendingData();
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
}

// Funciones auxiliares para IndexedDB
function getStoredPendingData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FutProDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

function syncDataItem(item) {
  // Implementar sincronización específica según el tipo de dato
  switch (item.type) {
    case 'post':
      return syncPost(item.data);
    case 'comment':
      return syncComment(item.data);
    case 'like':
      return syncLike(item.data);
    default:
      console.warn('Tipo de sincronización desconocido:', item.type);
  }
}

async function syncPost(postData) {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getStoredToken()}`
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      throw new Error('Error al sincronizar post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sincronizando post:', error);
    throw error;
  }
}

async function syncComment(commentData) {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getStoredToken()}`
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      throw new Error('Error al sincronizar comentario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sincronizando comentario:', error);
    throw error;
  }
}

async function syncLike(likeData) {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getStoredToken()}`
      },
      body: JSON.stringify(likeData)
    });
    
    if (!response.ok) {
      throw new Error('Error al sincronizar like');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sincronizando like:', error);
    throw error;
  }
}

function clearPendingData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FutProDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      store.clear();
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function getStoredToken() {
  return new Promise((resolve) => {
    // Obtener token almacenado localmente
    const token = localStorage.getItem('futpro_token') || 
                  sessionStorage.getItem('futpro_token');
    resolve(token);
  });
}

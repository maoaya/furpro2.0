// Gestor de notificaciones
import { io } from 'socket.io-client';
export class NotificationManager {
    constructor(database, uiManager) {
        this.database = database;
        this.ui = uiManager;
        this.socket = null;
        this.notificationQueue = [];
        this.isPermissionGranted = false;
        this.serviceWorkerRegistration = null;
        this.vapidPublicKey = 'TU_VAPID_PUBLIC_KEY'; // Reemplazar con clave real
        
        this.notificationTypes = {
            LIKE: 'like',
            COMMENT: 'comment',
            FOLLOW: 'follow',
            MENTION: 'mention',
            MESSAGE: 'message',
            TOURNAMENT: 'tournament',
            TEAM_INVITE: 'team_invite',
            STREAM: 'stream',
            MATCH: 'match',
            ACHIEVEMENT: 'achievement'
        };

        this.init();
    }

    // Inicializar gestor de notificaciones
    async init() {
        try {
            // Verificar soporte del navegador
            if (!('Notification' in window)) {
                console.warn('Este navegador no soporta notificaciones');
                return;
            }

            // Verificar service worker
            if ('serviceWorker' in navigator) {
                this.serviceWorkerRegistration = await navigator.serviceWorker.ready;
            }

            // Solicitar permisos
            await this.requestPermission();

            // Configurar socket para notificaciones en tiempo real
            this.initializeSocket();

            // Cargar notificaciones pendientes
            await this.loadPendingNotifications();

            // Configurar suscripción push
            if (this.isPermissionGranted) {
                await this.setupPushSubscription();
            }

        } catch (error) {
            console.error('Error inicializando NotificationManager:', error);
        }
    }

    // Configurar socket para notificaciones
    initializeSocket() {
        this.socket = io('/notifications');
        
        this.socket.on('connect', () => {
            console.log('Conectado al servidor de notificaciones');
        });

        this.socket.on('notification', (notification) => {
            this.handleRealtimeNotification(notification);
        });

        this.socket.on('notification-read', (notificationId) => {
            this.markNotificationAsRead(notificationId, false);
        });

        this.socket.on('bulk-notifications', (notifications) => {
            notifications.forEach(notification => {
                this.handleRealtimeNotification(notification);
            });
        });
    }

    // Solicitar permisos de notificación
    async requestPermission() {
        try {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                this.isPermissionGranted = permission === 'granted';
            } else {
                this.isPermissionGranted = Notification.permission === 'granted';
            }

            if (!this.isPermissionGranted) {
                this.ui.showToast('Las notificaciones están deshabilitadas. Puedes habilitarlas en la configuración del navegador.', 'info');
            }

            return this.isPermissionGranted;
        } catch (error) {
            console.error('Error solicitando permisos:', error);
            return false;
        }
    }

    // Configurar suscripción push
    async setupPushSubscription() {
        try {
            if (!this.serviceWorkerRegistration) {
                console.warn('Service Worker no disponible para push notifications');
                return;
            }

            // Verificar suscripción existente
            let subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
            
            if (!subscription) {
                // Crear nueva suscripción
                subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
                });
            }

            // Enviar suscripción al servidor
            await this.sendSubscriptionToServer(subscription);

            console.log('Push subscription configurada correctamente');
        } catch (error) {
            console.error('Error configurando push subscription:', error);
        }
    }

    // Convertir VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Enviar suscripción al servidor
    async sendSubscriptionToServer(subscription) {
        try {
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('futpro_token')}`
                },
                body: JSON.stringify({
                    subscription: subscription.toJSON()
                })
            });
        } catch (error) {
            console.error('Error enviando suscripción al servidor:', error);
        }
    }

    // Crear notificación local
    async createNotification(type, data) {
        // Validaciones extra
        if (!type || !data) {
            this.ui.showToast('Tipo o datos de notificación faltantes', 'error');
            if (window.futProApp?.showModal) {
                window.futProApp.showModal({
                    title: 'Error de notificación',
                    content: 'Tipo o datos de notificación faltantes',
                    icon: '⚠️',
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
            if (window.futProApp?.onNotification) {
                window.futProApp.onNotification(null, { type: 'error', message: 'Tipo o datos de notificación faltantes' });
            }
            return null;
        }
        if (!this.notificationTypes[type]) {
            this.ui.showToast('Tipo de notificación no soportado', 'error');
            if (window.futProApp?.showModal) {
                window.futProApp.showModal({
                    title: 'Error de notificación',
                    content: 'Tipo de notificación no soportado',
                    icon: '⚠️',
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
            if (window.futProApp?.onNotification) {
                window.futProApp.onNotification(null, { type: 'error', message: 'Tipo de notificación no soportado' });
            }
            return null;
        }
        try {
            const notification = {
                id: Date.now(),
                type,
                title: this.getNotificationTitle(type, data),
                body: this.getNotificationBody(type, data),
                icon: this.getNotificationIcon(type, data),
                timestamp: new Date().toISOString(),
                read: false,
                data: data,
                userId: data.userId || data.targetUserId
            };

            // Guardar en base de datos
            await this.database.saveNotification(notification);

            // Mostrar notificación
            this.showNotification(notification);
            this.ui.showToast('¡Nueva notificación recibida!', 'success');
            if (window.futProApp?.showModal && notification.type === 'error') {
                window.futProApp.showModal({
                    title: 'Error de notificación',
                    content: notification.body,
                    icon: notification.icon || '⚠️',
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
            if (window.futProApp?.onNotification) {
                window.futProApp.onNotification(notification.userId, notification);
            }

            // Agregar a la cola
            this.notificationQueue.unshift(notification);

            // Actualizar contador
            this.updateNotificationCounter();

            return notification;
        } catch (error) {
            this.ui.showToast('Error creando notificación: ' + error.message, 'error');
            if (window.futProApp?.showModal) {
                window.futProApp.showModal({
                    title: 'Error creando notificación',
                    content: error.message,
                    icon: '⚠️',
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
            if (window.futProApp?.onNotification) {
                window.futProApp.onNotification(null, { type: 'error', message: error.message });
            }
            console.error('Error creando notificación:', error);
            return null;
        }
    }

    // Mostrar notificación
    showNotification(notification) {
        if (!this.isPermissionGranted) {
            // Mostrar notificación in-app si no hay permisos del navegador
            this.showInAppNotification(notification);
            // Feedback visual global
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: notification.type === 'error' ? 'error' : 'info',
                    title: notification.title,
                    message: notification.body,
                    icon: notification.icon,
                    duration: 5000
                });
            }
            if (window.futProApp?.showModal && notification.type === 'error') {
                window.futProApp.showModal({
                    title: 'Error de notificación',
                    content: notification.body,
                    icon: notification.icon || '⚠️',
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
            if (window.futProApp?.onNotification) {
                window.futProApp.onNotification(notification.userId, notification);
            }
            return;
        }

        // Notificación del navegador
        const browserNotification = new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            badge: '/assets/badge.png',
            tag: notification.type,
            timestamp: Date.now(),
            requireInteraction: notification.type === this.notificationTypes.MESSAGE,
            actions: this.getNotificationActions(notification.type)
        });

        // Manejar clic en notificación
        browserNotification.onclick = () => {
            this.handleNotificationClick(notification);
            browserNotification.close();
        };

        // Auto-cerrar después de 5 segundos (excepto mensajes)
        if (notification.type !== this.notificationTypes.MESSAGE) {
            setTimeout(() => {
                browserNotification.close();
            }, 5000);
        }
    }

    // Mostrar notificación in-app
    showInAppNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'in-app-notification';
        notificationElement.innerHTML = `
            <div class="notification-content">
                <img src="${notification.icon}" alt="Icon" class="notification-icon">
                <div class="notification-text">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-body">${notification.body}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(notificationElement);

        // Click handler
        notificationElement.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close')) {
                this.handleNotificationClick(notification);
                notificationElement.remove();
            }
        });

        // Auto-remover
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.remove();
            }
        }, 5000);
    }

    // Manejar notificación en tiempo real
    handleRealtimeNotification(notification) {
        // Validación extra
        if (!notification || !notification.type) {
            this.ui.showToast('Notificación recibida sin tipo', 'error');
            return;
        }
        // Mostrar notificación en tiempo real
        this.showNotification(notification);
        this.ui.showToast('Notificación en tiempo real recibida', 'info');
        // Agregar a la cola
        this.notificationQueue.unshift(notification);
        // Actualizar UI
        this.updateNotificationCounter();
        this.updateNotificationList();
        // Reproducir sonido
        this.playNotificationSound(notification.type);
    }

    // Manejar clic en notificación
    handleNotificationClick(notification) {
        // Marcar como leída
        this.markNotificationAsRead(notification.id);

        // Navegar según el tipo
        switch (notification.type) {
            case this.notificationTypes.LIKE:
            case this.notificationTypes.COMMENT:
                // Ir al post
                window.location.hash = `#post/${notification.data.postId}`;
                break;
                
            case this.notificationTypes.FOLLOW:
                // Ir al perfil del seguidor
                window.location.hash = `#profile/${notification.data.followerId}`;
                break;
                
            case this.notificationTypes.MESSAGE:
                // Abrir chat
                window.location.hash = `#chat/${notification.data.chatId}`;
                break;
                
            case this.notificationTypes.TOURNAMENT:
                // Ir al torneo
                window.location.hash = `#tournament/${notification.data.tournamentId}`;
                break;
                
            case this.notificationTypes.TEAM_INVITE:
                // Mostrar invitación
                this.showTeamInviteModal(notification.data);
                break;
                
            case this.notificationTypes.STREAM:
                // Ir al stream
                window.location.hash = `#stream/${notification.data.streamId}`;
                break;
                
            case this.notificationTypes.MATCH:
                // Ir al partido
                window.location.hash = `#match/${notification.data.matchId}`;
                break;
        }

        // Enfocar ventana si está minimizada
        if (document.hidden) {
            window.focus();
        }
    }

    // Obtener título de notificación
    getNotificationTitle(type, data) {
        switch (type) {
            case this.notificationTypes.LIKE:
                return `A ${data.userName} le gustó tu publicación`;
            case this.notificationTypes.COMMENT:
                return `${data.userName} comentó tu publicación`;
            case this.notificationTypes.FOLLOW:
                return `${data.userName} te está siguiendo`;
            case this.notificationTypes.MENTION:
                return `${data.userName} te mencionó`;
            case this.notificationTypes.MESSAGE:
                return `Mensaje de ${data.senderName}`;
            case this.notificationTypes.TOURNAMENT:
                return `Nuevo torneo: ${data.tournamentName}`;
            case this.notificationTypes.TEAM_INVITE:
                return `Invitación al equipo ${data.teamName}`;
            case this.notificationTypes.STREAM:
                return `${data.streamerName} está transmitiendo`;
            case this.notificationTypes.MATCH:
                return `Partido: ${data.teamA} vs ${data.teamB}`;
            case this.notificationTypes.ACHIEVEMENT:
                return `¡Logro desbloqueado!`;
            default:
                return 'Nueva notificación';
        }
    }

    // Obtener cuerpo de notificación
    getNotificationBody(type, data) {
        switch (type) {
            case this.notificationTypes.LIKE:
                return 'Haz clic para ver la publicación';
            case this.notificationTypes.COMMENT:
                return data.commentPreview || 'Haz clic para ver el comentario';
            case this.notificationTypes.FOLLOW:
                return 'Haz clic para ver su perfil';
            case this.notificationTypes.MENTION:
                return data.postPreview || 'Haz clic para ver la mención';
            case this.notificationTypes.MESSAGE:
                return data.messagePreview || 'Nuevo mensaje';
            case this.notificationTypes.TOURNAMENT:
                return `${data.format} - Inicia ${data.startDate}`;
            case this.notificationTypes.TEAM_INVITE:
                return `${data.inviterName} te invitó a unirte`;
            case this.notificationTypes.STREAM:
                return data.streamTitle || 'Transmisión en vivo';
            case this.notificationTypes.MATCH:
                return `${data.date} - ${data.location}`;
            case this.notificationTypes.ACHIEVEMENT:
                return data.achievementName;
            default:
                return '';
        }
    }

    // Obtener icono de notificación
    getNotificationIcon(type, data) {
        const baseIcons = {
            [this.notificationTypes.LIKE]: '/assets/icons/heart.png',
            [this.notificationTypes.COMMENT]: '/assets/icons/comment.png',
            [this.notificationTypes.FOLLOW]: '/assets/icons/user-plus.png',
            [this.notificationTypes.MENTION]: '/assets/icons/at-sign.png',
            [this.notificationTypes.MESSAGE]: '/assets/icons/message.png',
            [this.notificationTypes.TOURNAMENT]: '/assets/icons/trophy.png',
            [this.notificationTypes.TEAM_INVITE]: '/assets/icons/team.png',
            [this.notificationTypes.STREAM]: '/assets/icons/video.png',
            [this.notificationTypes.MATCH]: '/assets/icons/football.png',
            [this.notificationTypes.ACHIEVEMENT]: '/assets/icons/achievement.png'
        };

        // Usar avatar del usuario si está disponible
        if (data.userAvatar) {
            return data.userAvatar;
        }

        return baseIcons[type] || '/assets/icon-192.png';
    }

    // Obtener acciones de notificación
    getNotificationActions(type) {
        const commonActions = [
            { action: 'view', title: 'Ver', icon: '/assets/icons/eye.png' }
        ];

        switch (type) {
            case this.notificationTypes.MESSAGE:
                return [
                    { action: 'reply', title: 'Responder', icon: '/assets/icons/reply.png' },
                    ...commonActions
                ];
                
            case this.notificationTypes.TEAM_INVITE:
                return [
                    { action: 'accept', title: 'Aceptar', icon: '/assets/icons/check.png' },
                    { action: 'decline', title: 'Rechazar', icon: '/assets/icons/x.png' }
                ];
                
            default:
                return commonActions;
        }
    }

    // Cargar notificaciones pendientes
    async loadPendingNotifications() {
        try {
            const notifications = await this.database.getUserNotifications();
            this.notificationQueue = notifications;
            this.updateNotificationCounter();
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        }
    }

    // Marcar notificación como leída
    async markNotificationAsRead(notificationId, updateDatabase = true) {
        try {
            // Actualizar en memoria
            const notification = this.notificationQueue.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }

            // Actualizar base de datos
            if (updateDatabase) {
                await this.database.markNotificationAsRead(notificationId);
                
                // Notificar al servidor via socket
                if (this.socket) {
                    this.socket.emit('notification-read', notificationId);
                }
            }

            // Actualizar UI
            this.updateNotificationCounter();
            this.updateNotificationList();
        } catch (error) {
            console.error('Error marcando notificación como leída:', error);
        }
    }

    // Marcar todas como leídas
    async markAllAsRead() {
        try {
            const unreadNotifications = this.notificationQueue.filter(n => !n.read);
            
            for (const notification of unreadNotifications) {
                notification.read = true;
                await this.database.markNotificationAsRead(notification.id);
            }

            this.updateNotificationCounter();
            this.updateNotificationList();
            
            this.ui.showToast('Todas las notificaciones marcadas como leídas', 'success');
        } catch (error) {
            console.error('Error marcando todas como leídas:', error);
        }
    }

    // Actualizar contador de notificaciones
    updateNotificationCounter() {
        const unreadCount = this.notificationQueue.filter(n => !n.read).length;
        
        // Actualizar badges en la UI
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline' : 'none';
        });

        // Actualizar título del documento
        if (unreadCount > 0) {
            document.title = `(${unreadCount}) FutPro`;
        } else {
            document.title = 'FutPro';
        }
    }

    // Actualizar lista de notificaciones
    updateNotificationList() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        notificationsList.innerHTML = this.notificationQueue.map(notification => 
            this.renderNotificationItem(notification)
        ).join('');
    }

    // Renderizar item de notificación
    renderNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.timestamp);
        
        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 data-notification-id="${notification.id}"
                 onclick="notificationManager.handleNotificationClick(${JSON.stringify(notification).replace(/"/g, '&quot;')})">
                <div class="notification-avatar">
                    <img src="${notification.icon}" alt="Notification">
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-body">${notification.body}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
            </div>
        `;
    }

    // Obtener tiempo transcurrido
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) {
            return 'hace un momento';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `hace ${days} día${days !== 1 ? 's' : ''}`;
        }
    }

    // Reproducir sonido de notificación
    playNotificationSound(type) {
        const sounds = {
            [this.notificationTypes.MESSAGE]: '/assets/sounds/message.mp3',
            [this.notificationTypes.LIKE]: '/assets/sounds/like.mp3',
            [this.notificationTypes.COMMENT]: '/assets/sounds/comment.mp3',
            default: '/assets/sounds/notification.mp3'
        };

        const soundFile = sounds[type] || sounds.default;
        const audio = new Audio(soundFile);
        audio.volume = 0.5;
        audio.play().catch(console.error);
    }

    // Mostrar modal de invitación a equipo
    showTeamInviteModal(data) {
        this.ui.showModal('team-invite', {
            title: 'Invitación a Equipo',
            content: `
                <div class="team-invite-modal">
                    <div class="team-info">
                        <img src="${data.teamLogo}" alt="${data.teamName}" class="team-logo">
                        <h3>${data.teamName}</h3>
                        <p>${data.teamDescription}</p>
                    </div>
                    
                    <div class="inviter-info">
                        <p><strong>${data.inviterName}</strong> te ha invitado a unirte a su equipo</p>
                    </div>
                    
                    <div class="invite-actions">
                        <button onclick="notificationManager.acceptTeamInvite('${data.inviteId}')" 
                                class="btn btn-primary">
                            Aceptar
                        </button>
                        <button onclick="notificationManager.declineTeamInvite('${data.inviteId}')" 
                                class="btn btn-secondary">
                            Rechazar
                        </button>
                    </div>
                </div>
            `
        });
    }

    // Aceptar invitación a equipo
    async acceptTeamInvite(inviteId) {
        try {
            await this.database.acceptTeamInvite(inviteId);
            this.ui.closeModal();
            this.ui.showToast('¡Te has unido al equipo!', 'success');
        } catch (error) {
            console.error('Error aceptando invitación:', error);
            this.ui.showToast('Error al aceptar invitación', 'error');
        }
    }

    // Rechazar invitación a equipo
    async declineTeamInvite(inviteId) {
        try {
            await this.database.declineTeamInvite(inviteId);
            this.ui.closeModal();
            this.ui.showToast('Invitación rechazada', 'info');
        } catch (error) {
            console.error('Error rechazando invitación:', error);
            this.ui.showToast('Error al rechazar invitación', 'error');
        }
    }

    // Limpiar notificaciones antiguas
    async cleanupOldNotifications() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            this.notificationQueue = this.notificationQueue.filter(
                notification => new Date(notification.timestamp) > thirtyDaysAgo
            );
            
            await this.database.deleteOldNotifications(thirtyDaysAgo.toISOString());
        } catch (error) {
            console.error('Error limpiando notificaciones:', error);
        }
    }

    // Destruir instancia
    destroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
        
        this.notificationQueue = [];
        
        // Limpiar service worker
        if (this.serviceWorkerRegistration) {
            this.serviceWorkerRegistration.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                });
        }
    }
}

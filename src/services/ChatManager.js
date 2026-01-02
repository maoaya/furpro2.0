// Gestor de Chat en tiempo real
import { io } from 'socket.io-client';
export class ChatManager {
    constructor(firebaseService, database, uiManager) {
        this.firebase = firebaseService;
        this.database = database;
        this.ui = uiManager;
        this.socket = null;
        this.currentChatId = null;
        this.currentUserId = null;
        this.messageListeners = new Map();
        this.typingUsers = new Map();
        this.onlineUsers = new Set();
        
        this.initializeSocket();
        this.bindEvents();
    }

    // Inicializar conexión Socket.io
    initializeSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Conectado al servidor de chat');
            if (this.currentUserId) {
                this.socket.emit('user-online', this.currentUserId);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor de chat');
        });

        this.socket.on('new-message', (message) => {
            this.handleNewMessage(message);
        });

        this.socket.on('user-typing', (data) => {
            this.handleUserTyping(data);
        });

        this.socket.on('user-stopped-typing', (data) => {
            this.handleUserStoppedTyping(data);
        });

        this.socket.on('user-online', (userId) => {
            this.onlineUsers.add(userId);
            this.updateUserOnlineStatus(userId, true);
        });

        this.socket.on('user-offline', (userId) => {
            this.onlineUsers.delete(userId);
            this.updateUserOnlineStatus(userId, false);
        });
    }

    // Vincular eventos de UI
    bindEvents() {
        // Enviar mensaje
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('chat-form')) {
                e.preventDefault();
                this.sendMessage(e.target);
            }
        });

        // Detectar escritura
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('message-input')) {
                this.handleTyping(e.target);
            }
        });

        // Enviar con Enter
        document.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('message-input') && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.target.closest('.chat-form');
                if (form) this.sendMessage(form);
            }
        });
    }

    // Inicializar chat
    async initializeChat(userId) {
        try {
            this.currentUserId = userId;
            
            // Conectar a Socket.io si no está conectado
            if (!this.socket.connected) {
                this.socket.connect();
            }

            // Unirse a sala de usuario
            this.socket.emit('join-user-room', userId);

            // Cargar chats recientes
            await this.loadRecentChats();

            return true;
        } catch (error) {
            console.error('Error inicializando chat:', error);
            this.ui.showToast('Error al inicializar chat', 'error');
            return false;
        }
    }

    // Cargar chats recientes
    async loadRecentChats() {
        try {
            const chats = await this.database.getRecentChats(this.currentUserId);
            this.renderChatList(chats);
            return chats;
        } catch (error) {
            console.error('Error cargando chats:', error);
            return [];
        }
    }

    // Abrir chat específico
    async openChat(chatId, chatType = 'private') {
        try {
            this.currentChatId = chatId;

            // Salir del chat anterior
            if (this.currentChatId && this.currentChatId !== chatId) {
                this.socket.emit('leave-chat', this.currentChatId);
            }

            // Unirse al nuevo chat
            this.socket.emit('join-chat', { chatId, userId: this.currentUserId });

            // Cargar mensajes
            const messages = await this.loadChatMessages(chatId);
            
            // Renderizar interfaz de chat
            this.renderChatInterface(chatId, chatType);
            this.renderMessages(messages);

            // Marcar mensajes como leídos
            await this.markMessagesAsRead(chatId);

            return true;
        } catch (error) {
            console.error('Error abriendo chat:', error);
            this.ui.showToast('Error al abrir chat', 'error');
            return false;
        }
    }

    // Cargar mensajes del chat
    async loadChatMessages(chatId, limit = 50, offset = 0) {
        try {
            const messages = await this.database.getChatMessages(chatId, limit, offset);
            return messages;
        } catch (error) {
            console.error('Error cargando mensajes:', error);
            return [];
        }
    }

    // Enviar mensaje
    async sendMessage(form) {
        let messageData;
        try {
            const formData = new FormData(form);
            const messageText = formData.get('message')?.trim();
            const attachments = formData.getAll('attachments');

            if (!messageText && attachments.length === 0) {
                return;
            }

            messageData = {
                chatId: this.currentChatId,
                senderId: this.currentUserId,
                text: messageText,
                type: 'text',
                timestamp: new Date().toISOString(),
                tempId: Date.now() // ID temporal para mostrar inmediatamente
            };

            // Mostrar mensaje inmediatamente (optimistic update)
            this.addMessageToUI(messageData, true);

            // Limpiar formulario
            form.reset();

            // Subir archivos si existen
            if (attachments.length > 0) {
                const uploadedFiles = await this.uploadAttachments(attachments);
                messageData.attachments = uploadedFiles;
                messageData.type = 'media';
            }

            // Enviar al servidor
            const savedMessage = await this.database.saveMessage(messageData);
            
            // Emitir por Socket.io
            this.socket.emit('send-message', savedMessage);

            // Actualizar UI con mensaje guardado
            this.updateMessageInUI(messageData.tempId, savedMessage);

            return savedMessage;
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.ui.showToast('Error al enviar mensaje', 'error');
            // Remover mensaje temporal en caso de error
            if (messageData?.tempId) {
                this.removeMessageFromUI(messageData.tempId);
            }
        }
    }

    // Subir archivos adjuntos
    async uploadAttachments(files) {
        try {
            const uploadPromises = Array.from(files).map(file => 
                this.database.uploadFile(file, 'chat-attachments')
            );
            
            const uploadedFiles = await Promise.all(uploadPromises);
            return uploadedFiles;
        } catch (error) {
            console.error('Error subiendo archivos:', error);
            throw error;
        }
    }

    // Manejar nuevo mensaje recibido
    handleNewMessage(message) {
        if (message.chatId === this.currentChatId) {
            this.addMessageToUI(message);
            
            // Marcar como leído si el chat está abierto
            if (document.hasFocus()) {
                this.markMessageAsRead(message.id);
            }
        } else {
            // Mostrar notificación para otros chats
            this.showMessageNotification(message);
        }

        // Actualizar lista de chats
        this.updateChatInList(message);
    }

    // Manejar indicador de escritura
    handleUserTyping(data) {
        if (data.chatId === this.currentChatId && data.userId !== this.currentUserId) {
            this.typingUsers.set(data.userId, data.userName);
            this.updateTypingIndicator();
        }
    }

    // Manejar cuando usuario deja de escribir
    handleUserStoppedTyping(data) {
        if (data.chatId === this.currentChatId) {
            this.typingUsers.delete(data.userId);
            this.updateTypingIndicator();
        }
    }

    // Manejar escritura del usuario actual
    handleTyping() {
        if (!this.currentChatId) return;

        clearTimeout(this.typingTimeout);
        
        if (!this.isTyping) {
            this.isTyping = true;
            this.socket.emit('typing', {
                chatId: this.currentChatId,
                userId: this.currentUserId
            });
        }

        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            this.socket.emit('stop-typing', {
                chatId: this.currentChatId,
                userId: this.currentUserId
            });
        }, 1000);
    }

    // Renderizar lista de chats
    renderChatList(chats) {
        const chatList = document.getElementById('chat-list');
        if (!chatList) return;

        chatList.innerHTML = chats.map(chat => `
            <div class="chat-item ${chat.unreadCount > 0 ? 'unread' : ''}" 
                 data-chat-id="${chat.id}" onclick="chatManager.openChat('${chat.id}')">
                <div class="chat-avatar">
                    <img src="${chat.avatar || 'https://ui-avatars.com/api/?name=User'}" 
                         alt="${chat.name}">
                    ${this.onlineUsers.has(chat.userId) ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="chat-info">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-last-message">${chat.lastMessage || 'Sin mensajes'}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${this.formatTime(chat.lastMessageTime)}</div>
                    ${chat.unreadCount > 0 ? `<div class="unread-badge">${chat.unreadCount}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Renderizar interfaz de chat
    renderChatInterface() {
        const chatContainer = document.getElementById('chat-container');
        if (!chatContainer) return;

        chatContainer.innerHTML = `
            <div class="chat-header">
                <button class="back-button" onclick="chatManager.closeChatInterface()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="chat-participant-info">
                    <div class="participant-avatar">
                        <img src="https://ui-avatars.com/api/?name=Chat" alt="Chat">
                    </div>
                    <div class="participant-details">
                        <div class="participant-name">Chat</div>
                        <div class="participant-status">En línea</div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="action-button" onclick="chatManager.toggleChatInfo()">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="action-button" onclick="chatManager.makeVideoCall()">
                        <i class="fas fa-video"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <!-- Mensajes se cargarán aquí -->
            </div>
            
            <div class="typing-indicator" id="typing-indicator" style="display: none;">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text"></span>
            </div>
            
            <form class="chat-form">
                <div class="message-input-container">
                    <button type="button" class="attachment-button" onclick="chatManager.openAttachmentMenu()">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <input type="text" name="message" class="message-input" 
                           placeholder="Escribe un mensaje..." autocomplete="off">
                    <input type="file" name="attachments" class="file-input" 
                           multiple accept="image/*,video/*,audio/*,application/pdf" style="display: none;">
                    <button type="button" class="emoji-button" onclick="chatManager.openEmojiPicker()">
                        <i class="fas fa-smile"></i>
                    </button>
                    <button type="submit" class="send-button">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        `;
    }

    // Renderizar mensajes
    renderMessages(messages) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = messages.map(message => 
            this.createMessageElement(message)
        ).join('');

        // Scroll al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Crear elemento de mensaje
    createMessageElement(message) {
        const isOwn = message.senderId === this.currentUserId;
        const time = this.formatTime(message.timestamp);
        
        return `
            <div class="message ${isOwn ? 'own' : 'other'}" data-message-id="${message.id}">
                ${!isOwn ? `
                    <div class="message-avatar">
                        <img src="${message.senderAvatar || 'https://ui-avatars.com/api/?name=Sender'}" 
                             alt="${message.senderName}">
                    </div>
                ` : ''}
                <div class="message-content">
                    ${!isOwn ? `<div class="message-sender">${message.senderName}</div>` : ''}
                    
                    ${message.type === 'media' && message.attachments ? 
                        this.renderAttachments(message.attachments) : ''}
                    
                    ${message.text ? `<div class="message-text">${this.formatMessageText(message.text)}</div>` : ''}
                    
                    <div class="message-meta">
                        <span class="message-time">${time}</span>
                        ${isOwn ? `
                            <span class="message-status">
                                <i class="fas fa-check${message.read ? '-double' : ''} ${message.read ? 'read' : ''}"></i>
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Renderizar archivos adjuntos
    renderAttachments(attachments) {
        return attachments.map(file => {
            const fileType = file.type.split('/')[0];
            
            switch (fileType) {
                case 'image':
                    return `
                        <div class="attachment image-attachment">
                            <img src="${file.url}" alt="Imagen" onclick="chatManager.openImageViewer('${file.url}')">
                        </div>
                    `;
                case 'video':
                    return `
                        <div class="attachment video-attachment">
                            <video controls>
                                <source src="${file.url}" type="${file.type}">
                            </video>
                        </div>
                    `;
                case 'audio':
                    return `
                        <div class="attachment audio-attachment">
                            <audio controls>
                                <source src="${file.url}" type="${file.type}">
                            </audio>
                        </div>
                    `;
                default:
                    return `
                        <div class="attachment file-attachment">
                            <i class="fas fa-file"></i>
                            <span class="file-name">${file.name}</span>
                            <a href="${file.url}" download class="download-button">
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    `;
            }
        }).join('');
    }

    // Agregar mensaje a la UI
    addMessageToUI(message, isTemporary = false) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.innerHTML = this.createMessageElement(message);
        
        if (isTemporary) {
            messageElement.classList.add('temporary');
        }

        messagesContainer.appendChild(messageElement.firstElementChild);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Actualizar mensaje en la UI
    updateMessageInUI(tempId, newMessage) {
        const tempElement = document.querySelector(`[data-temp-id="${tempId}"]`);
        if (tempElement) {
            tempElement.outerHTML = this.createMessageElement(newMessage);
        }
    }

    // Remover mensaje de la UI
    removeMessageFromUI(tempId) {
        const tempElement = document.querySelector(`[data-temp-id="${tempId}"]`);
        if (tempElement) {
            tempElement.remove();
        }
    }

    // Actualizar indicador de escritura
    updateTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (!indicator) return;

        if (this.typingUsers.size > 0) {
            const users = Array.from(this.typingUsers.values());
            const text = users.length === 1 
                ? `${users[0]} está escribiendo...`
                : `${users.join(', ')} están escribiendo...`;
            
            indicator.querySelector('.typing-text').textContent = text;
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    }

    // Actualizar estado en línea de usuario
    updateUserOnlineStatus(userId, isOnline) {
        const userElements = document.querySelectorAll(`[data-user-id="${userId}"]`);
        userElements.forEach(element => {
            const indicator = element.querySelector('.online-indicator');
            if (indicator) {
                indicator.style.display = isOnline ? 'block' : 'none';
            }
        });
    }

    // Formatear texto del mensaje (emojis, links, etc.)
    formatMessageText(text) {
        // Convertir URLs a enlaces
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convertir saltos de línea
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    // Formatear tiempo
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    // Marcar mensajes como leídos
    async markMessagesAsRead(chatId) {
        try {
            await this.database.markMessagesAsRead(chatId, this.currentUserId);
            this.socket.emit('messages-read', { chatId, userId: this.currentUserId });
        } catch (error) {
            console.error('Error marcando mensajes como leídos:', error);
        }
    }

    // Marcar mensaje específico como leído
    async markMessageAsRead(messageId) {
        try {
            await this.database.markMessageAsRead(messageId, this.currentUserId);
        } catch (error) {
            console.error('Error marcando mensaje como leído:', error);
        }
    }

    // Mostrar notificación de mensaje
    showMessageNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification(`Nuevo mensaje de ${message.senderName}`, {
                body: message.text || 'Archivo adjunto',
                icon: message.senderAvatar || '/assets/default-avatar.png'
            });
        }
    }

    // Cerrar interfaz de chat
    closeChatInterface() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = '';
        }
        
        if (this.currentChatId) {
            this.socket.emit('leave-chat', this.currentChatId);
            this.currentChatId = null;
        }
    }

    // Destruir instancia
    destroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
        
        clearTimeout(this.typingTimeout);
        this.messageListeners.clear();
        this.typingUsers.clear();
        this.onlineUsers.clear();
    }
}

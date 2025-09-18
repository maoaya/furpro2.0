// Gestor de transmisiones en vivo
import { io } from 'socket.io-client';
export class StreamManager {
    constructor(firebaseService, database, uiManager) {
        this.firebase = firebaseService;
        this.database = database;
        this.ui = uiManager;
        this.socket = null;
        this.localStream = null;
        this.peerConnections = new Map();
        this.viewers = new Set();
        this.isStreaming = false;
        this.isWatching = false;
        this.streamId = null;
        this.constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };

        this.initializeSocket();
        this.bindEvents();
    }

    // Inicializar conexión Socket.io para streaming
    initializeSocket() {
        this.socket = io('/streaming');
        
        this.socket.on('connect', () => {
            console.log('Conectado al servidor de streaming');
        });

        this.socket.on('viewer-joined', (viewerId) => {
            this.viewers.add(viewerId);
            this.updateViewerCount();
            this.createPeerConnection(viewerId);
        });

        this.socket.on('viewer-left', (viewerId) => {
            this.viewers.delete(viewerId);
            this.updateViewerCount();
            this.removePeerConnection(viewerId);
        });

        this.socket.on('offer', async (data) => {
            await this.handleOffer(data);
        });

        this.socket.on('answer', async (data) => {
            await this.handleAnswer(data);
        });

        this.socket.on('ice-candidate', async (data) => {
            await this.handleIceCandidate(data);
        });

        this.socket.on('stream-ended', () => {
            this.handleStreamEnded();
        });

        this.socket.on('stream-stats', (stats) => {
            this.updateStreamStats(stats);
        });
    }

    // Vincular eventos de UI
    bindEvents() {
        // Botón iniciar transmisión
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="start-stream"]')) {
                this.showStreamSetup();
            }
            
            if (e.target.matches('[data-action="stop-stream"]')) {
                this.stopStream();
            }

            if (e.target.matches('[data-action="toggle-camera"]')) {
                this.toggleCamera();
            }

            if (e.target.matches('[data-action="toggle-microphone"]')) {
                this.toggleMicrophone();
            }

            if (e.target.matches('[data-action="share-screen"]')) {
                this.shareScreen();
            }

            if (e.target.matches('[data-action="watch-stream"]')) {
                const streamId = e.target.dataset.streamId;
                this.watchStream(streamId);
            }
        });
    }

    // Mostrar configuración de transmisión
    showStreamSetup() {
        this.ui.showModal('stream-setup', {
            title: 'Configurar Transmisión',
            content: `
                <div class="stream-setup">
                    <div class="setup-section">
                        <h3>Información de la transmisión</h3>
                        <input type="text" id="stream-title" placeholder="Título de la transmisión" required>
                        <textarea id="stream-description" placeholder="Descripción (opcional)"></textarea>
                        <select id="stream-category">
                            <option value="match">Partido</option>
                            <option value="training">Entrenamiento</option>
                            <option value="tips">Consejos</option>
                            <option value="analysis">Análisis</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>

                    <div class="setup-section">
                        <h3>Vista previa</h3>
                        <video id="stream-preview" autoplay muted style="width: 100%; max-height: 300px; border-radius: 10px;"></video>
                    </div>

                    <div class="setup-section">
                        <h3>Configuración de cámara</h3>
                        <select id="camera-select">
                            <option value="">Seleccionar cámara...</option>
                        </select>
                        <select id="microphone-select">
                            <option value="">Seleccionar micrófono...</option>
                        </select>
                        <select id="quality-select">
                            <option value="720p">HD (720p)</option>
                            <option value="480p">SD (480p)</option>
                            <option value="360p">Baja (360p)</option>
                        </select>
                    </div>

                    <div class="setup-actions">
                        <button type="button" onclick="streamManager.testDevices()" class="btn btn-secondary">
                            Probar Dispositivos
                        </button>
                        <button type="button" onclick="streamManager.startStreamFromSetup()" class="btn btn-primary">
                            Iniciar Transmisión
                        </button>
                    </div>
                </div>
            `
        });

        // Cargar dispositivos disponibles
        this.loadAvailableDevices();
        
        // Mostrar vista previa
        this.showPreview();
    }

    // Cargar dispositivos disponibles
    async loadAvailableDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            const cameraSelect = document.getElementById('camera-select');
            const microphoneSelect = document.getElementById('microphone-select');

            // Limpiar opciones anteriores
            cameraSelect.innerHTML = '<option value="">Seleccionar cámara...</option>';
            microphoneSelect.innerHTML = '<option value="">Seleccionar micrófono...</option>';

            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`;

                if (device.kind === 'videoinput') {
                    cameraSelect.appendChild(option);
                } else if (device.kind === 'audioinput') {
                    microphoneSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error cargando dispositivos:', error);
        }
    }

    // Mostrar vista previa
    async showPreview() {
        try {
            const preview = document.getElementById('stream-preview');
            if (!preview) return;

            const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            preview.srcObject = stream;

            // Guardar stream para limpieza posterior
            this.previewStream = stream;
        } catch (error) {
            console.error('Error obteniendo vista previa:', error);
            this.ui.showToast('Error accediendo a cámara/micrófono', 'error');
        }
    }

    // Probar dispositivos
    async testDevices() {
        try {
            const cameraId = document.getElementById('camera-select').value;
            const microphoneId = document.getElementById('microphone-select').value;

            if (!cameraId && !microphoneId) {
                this.ui.showToast('Selecciona al menos un dispositivo', 'warning');
                return;
            }

            const constraints = {
                video: cameraId ? { deviceId: { exact: cameraId } } : false,
                audio: microphoneId ? { deviceId: { exact: microphoneId } } : false
            };

            // Detener stream anterior
            if (this.previewStream) {
                this.previewStream.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const preview = document.getElementById('stream-preview');
            if (preview) {
                preview.srcObject = stream;
            }

            this.previewStream = stream;
            this.ui.showToast('Dispositivos funcionando correctamente', 'success');
        } catch (error) {
            console.error('Error probando dispositivos:', error);
            this.ui.showToast('Error con los dispositivos seleccionados', 'error');
        }
    }

    // Iniciar transmisión desde configuración
    async startStreamFromSetup() {
        try {
            const title = document.getElementById('stream-title').value.trim();
            const description = document.getElementById('stream-description').value.trim();
            const category = document.getElementById('stream-category').value;
            const cameraId = document.getElementById('camera-select').value;
            const microphoneId = document.getElementById('microphone-select').value;
            const quality = document.getElementById('quality-select').value;

            if (!title) {
                this.ui.showToast('El título es obligatorio', 'warning');
                return;
            }

            // Configurar calidad según selección
            this.setStreamQuality(quality);

            // Configurar dispositivos específicos
            const constraints = {
                video: cameraId ? { deviceId: { exact: cameraId }, ...this.constraints.video } : this.constraints.video,
                audio: microphoneId ? { deviceId: { exact: microphoneId }, ...this.constraints.audio } : this.constraints.audio
            };

            const streamData = {
                title,
                description,
                category,
                quality,
                constraints
            };

            // Cerrar modal
            this.ui.closeModal();

            // Iniciar transmisión
            await this.startStream(streamData);
        } catch (error) {
            console.error('Error iniciando transmisión:', error);
            this.ui.showToast('Error al iniciar transmisión', 'error');
        }
    }

    // Configurar calidad de stream
    setStreamQuality(quality) {
        switch (quality) {
            case '720p':
                this.constraints.video.width = { ideal: 1280 };
                this.constraints.video.height = { ideal: 720 };
                break;
            case '480p':
                this.constraints.video.width = { ideal: 854 };
                this.constraints.video.height = { ideal: 480 };
                break;
            case '360p':
                this.constraints.video.width = { ideal: 640 };
                this.constraints.video.height = { ideal: 360 };
                break;
        }
    }

    // Iniciar transmisión
    async startStream(streamData) {
        try {
            this.ui.showLoading('Iniciando transmisión...');

            // Obtener stream de medios
            this.localStream = await navigator.mediaDevices.getUserMedia(streamData.constraints);

            // Crear registro de transmisión en base de datos
            const streamRecord = await this.database.createStream({
                title: streamData.title,
                description: streamData.description,
                category: streamData.category,
                quality: streamData.quality,
                startTime: new Date().toISOString()
            });

            this.streamId = streamRecord.id;
            this.isStreaming = true;

            // Unirse a sala de streaming
            this.socket.emit('start-stream', {
                streamId: this.streamId,
                streamData: streamRecord
            });

            // Mostrar interfaz de streaming
            this.showStreamingInterface();

            // Limpiar vista previa anterior
            if (this.previewStream) {
                this.previewStream.getTracks().forEach(track => track.stop());
                this.previewStream = null;
            }

            this.ui.hideLoading();
            this.ui.showToast('Transmisión iniciada correctamente', 'success');

            // Iniciar estadísticas
            this.startStreamStats();

        } catch (error) {
            console.error('Error iniciando transmisión:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al iniciar transmisión', 'error');
            this.cleanup();
        }
    }

    // Mostrar interfaz de streaming
    showStreamingInterface() {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="streaming-interface">
                <div class="streaming-header">
                    <div class="stream-info">
                        <span class="live-indicator">● EN VIVO</span>
                        <span class="viewer-count">0 espectadores</span>
                    </div>
                    <div class="stream-controls">
                        <button data-action="toggle-camera" class="control-btn active">
                            <i class="fas fa-video"></i>
                        </button>
                        <button data-action="toggle-microphone" class="control-btn active">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button data-action="share-screen" class="control-btn">
                            <i class="fas fa-desktop"></i>
                        </button>
                        <button data-action="stop-stream" class="control-btn stop-btn">
                            <i class="fas fa-stop"></i>
                        </button>
                    </div>
                </div>

                <div class="streaming-main">
                    <div class="stream-video-container">
                        <video id="local-video" autoplay muted></video>
                        <div class="stream-overlay">
                            <div class="stream-stats">
                                <div class="stat">
                                    <span class="stat-label">Duración:</span>
                                    <span id="stream-duration">00:00</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Calidad:</span>
                                    <span id="stream-quality">HD</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Bitrate:</span>
                                    <span id="stream-bitrate">0 kbps</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stream-chat">
                        <div class="chat-header">
                            <h3>Chat en vivo</h3>
                        </div>
                        <div class="chat-messages" id="stream-chat-messages">
                            <!-- Mensajes del chat en vivo -->
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Envía un mensaje..." id="stream-chat-input">
                            <button onclick="streamManager.sendChatMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Configurar video local
        const localVideo = document.getElementById('local-video');
        if (localVideo && this.localStream) {
            localVideo.srcObject = this.localStream;
        }

        // Iniciar contador de duración
        this.startDurationTimer();
    }

    // Ver transmisión
    async watchStream(streamId) {
        try {
            this.ui.showLoading('Conectando a transmisión...');

            // Verificar que la transmisión existe y está activa
            const streamData = await this.database.getStream(streamId);
            if (!streamData || !streamData.isActive) {
                throw new Error('La transmisión no está disponible');
            }

            this.streamId = streamId;
            this.isWatching = true;

            // Unirse como espectador
            this.socket.emit('join-stream', { streamId, viewerId: this.currentUserId });

            // Mostrar interfaz de visualización
            this.showWatchingInterface(streamData);

            this.ui.hideLoading();
        } catch (error) {
            console.error('Error viendo transmisión:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al conectar con la transmisión', 'error');
        }
    }

    // Mostrar interfaz de visualización
    showWatchingInterface(streamData) {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="watching-interface">
                <div class="watching-header">
                    <button class="back-btn" onclick="streamManager.leaveStream()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="stream-info">
                        <h2>${streamData.title}</h2>
                        <p>${streamData.description}</p>
                        <div class="stream-meta">
                            <span class="live-indicator">● EN VIVO</span>
                            <span class="viewer-count">0 espectadores</span>
                            <span class="streamer-name">Por ${streamData.streamerName}</span>
                        </div>
                    </div>
                </div>

                <div class="watching-main">
                    <div class="watch-video-container">
                        <video id="remote-video" autoplay></video>
                        <div class="video-controls">
                            <button onclick="streamManager.toggleFullscreen()">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button onclick="streamManager.toggleVolume()">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>

                    <div class="watch-chat">
                        <div class="chat-header">
                            <h3>Chat en vivo</h3>
                        </div>
                        <div class="chat-messages" id="watch-chat-messages">
                            <!-- Mensajes del chat en vivo -->
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Envía un mensaje..." id="watch-chat-input">
                            <button onclick="streamManager.sendChatMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Crear conexión peer
    async createPeerConnection(viewerId) {
        try {
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });

            // Agregar tracks locales
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, this.localStream);
                });
            }

            // Manejar ice candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('ice-candidate', {
                        target: viewerId,
                        candidate: event.candidate
                    });
                }
            };

            // Crear offer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            this.socket.emit('offer', {
                target: viewerId,
                offer: offer
            });

            this.peerConnections.set(viewerId, peerConnection);
        } catch (error) {
            console.error('Error creando conexión peer:', error);
        }
    }

    // Manejar offer recibido
    async handleOffer(data) {
        try {
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });

            // Manejar stream remoto
            peerConnection.ontrack = (event) => {
                const remoteVideo = document.getElementById('remote-video');
                if (remoteVideo) {
                    remoteVideo.srcObject = event.streams[0];
                }
            };

            // Manejar ice candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('ice-candidate', {
                        target: data.sender,
                        candidate: event.candidate
                    });
                }
            };

            await peerConnection.setRemoteDescription(data.offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            this.socket.emit('answer', {
                target: data.sender,
                answer: answer
            });

            this.peerConnections.set(data.sender, peerConnection);
        } catch (error) {
            console.error('Error manejando offer:', error);
        }
    }

    // Manejar answer recibido
    async handleAnswer(data) {
        try {
            const peerConnection = this.peerConnections.get(data.sender);
            if (peerConnection) {
                await peerConnection.setRemoteDescription(data.answer);
            }
        } catch (error) {
            console.error('Error manejando answer:', error);
        }
    }

    // Manejar ice candidate
    async handleIceCandidate(data) {
        try {
            const peerConnection = this.peerConnections.get(data.sender);
            if (peerConnection) {
                await peerConnection.addIceCandidate(data.candidate);
            }
        } catch (error) {
            console.error('Error agregando ice candidate:', error);
        }
    }

    // Toggle cámara
    toggleCamera() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                const button = document.querySelector('[data-action="toggle-camera"]');
                if (button) {
                    button.classList.toggle('active', videoTrack.enabled);
                    button.innerHTML = videoTrack.enabled ? 
                        '<i class="fas fa-video"></i>' : 
                        '<i class="fas fa-video-slash"></i>';
                }
            }
        }
    }

    // Toggle micrófono
    toggleMicrophone() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                const button = document.querySelector('[data-action="toggle-microphone"]');
                if (button) {
                    button.classList.toggle('active', audioTrack.enabled);
                    button.innerHTML = audioTrack.enabled ? 
                        '<i class="fas fa-microphone"></i>' : 
                        '<i class="fas fa-microphone-slash"></i>';
                }
            }
        }
    }

    // Compartir pantalla
    async shareScreen() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            // Reemplazar track de video
            const videoTrack = screenStream.getVideoTracks()[0];
            const sender = this.peerConnections.values().next().value?.getSenders()
                .find(s => s.track && s.track.kind === 'video');

            if (sender) {
                await sender.replaceTrack(videoTrack);
            }

            // Actualizar video local
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = screenStream;
            }

            // Manejar fin de compartir pantalla
            videoTrack.onended = () => {
                this.stopScreenShare();
            };

            this.ui.showToast('Compartiendo pantalla', 'success');
        } catch (error) {
            console.error('Error compartiendo pantalla:', error);
            this.ui.showToast('Error al compartir pantalla', 'error');
        }
    }

    // Detener transmisión
    async stopStream() {
        try {
            this.ui.showLoading('Finalizando transmisión...');

            // Notificar fin de transmisión
            this.socket.emit('end-stream', { streamId: this.streamId });

            // Actualizar base de datos
            await this.database.endStream(this.streamId);

            // Limpiar recursos
            this.cleanup();

            this.ui.hideLoading();
            this.ui.showToast('Transmisión finalizada', 'success');

            // Volver a la página principal
            window.location.hash = '#home';
        } catch (error) {
            console.error('Error deteniendo transmisión:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al finalizar transmisión', 'error');
        }
    }

    // Limpiar recursos
    cleanup() {
        // Detener tracks locales
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        // Cerrar conexiones peer
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();

        // Limpiar estados
        this.isStreaming = false;
        this.isWatching = false;
        this.streamId = null;
        this.viewers.clear();

        // Limpiar timers
        if (this.durationTimer) {
            clearInterval(this.durationTimer);
            this.durationTimer = null;
        }

        if (this.statsTimer) {
            clearInterval(this.statsTimer);
            this.statsTimer = null;
        }
    }

    // Iniciar timer de duración
    startDurationTimer() {
        this.streamStartTime = Date.now();
        this.durationTimer = setInterval(() => {
            const duration = Math.floor((Date.now() - this.streamStartTime) / 1000);
            const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
            const seconds = (duration % 60).toString().padStart(2, '0');
            
            const durationElement = document.getElementById('stream-duration');
            if (durationElement) {
                durationElement.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    // Actualizar contador de espectadores
    updateViewerCount() {
        const elements = document.querySelectorAll('.viewer-count');
        elements.forEach(element => {
            element.textContent = `${this.viewers.size} espectador${this.viewers.size !== 1 ? 'es' : ''}`;
        });
    }

    // Destruir instancia
    destroy() {
        this.cleanup();
        
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}




// Funciones externas para iniciar stream y registrar viewer
export function iniciarStream() {
    // Lógica para iniciar streaming
}

export function registrarViewer() {
    // Lógica para registrar viewers
}

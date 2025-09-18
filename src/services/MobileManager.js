// 📱 MobileManager.js - Gestión de funcionalidades móviles para FutPro
// Optimización específica para dispositivos iOS y Android

import { supabase } from '../config/supabase.js';

export class MobileManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isIOS = this.detectIOS();
        this.isAndroid = this.detectAndroid();
        this.isPWA = this.detectPWA();
        this.device = this.getDeviceInfo();
        
        // Configuración específica para iOS
        this.iosConfig = {
            callbackUrl: 'https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback',
            universalLinks: 'futpro://auth/callback',
            customScheme: 'futpro',
            bundleId: 'com.futpro.app'
        };

        console.log('📱 MobileManager inicializado:', {
            isMobile: this.isMobile,
            isIOS: this.isIOS,
            device: this.device
        });

        this.initializeMobileOptimizations();
    }

    /**
     * Detección de dispositivos
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    detectAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    detectPWA() {
        return window.navigator.standalone === true || 
               window.matchMedia('(display-mode: standalone)').matches;
    }

    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        
        if (this.isIOS) {
            if (/iPad/.test(userAgent)) return { type: 'tablet', os: 'iOS', device: 'iPad' };
            if (/iPhone/.test(userAgent)) return { type: 'phone', os: 'iOS', device: 'iPhone' };
            if (/iPod/.test(userAgent)) return { type: 'phone', os: 'iOS', device: 'iPod' };
        }
        
        if (this.isAndroid) {
            if (/Mobile/.test(userAgent)) return { type: 'phone', os: 'Android', device: 'Android Phone' };
            return { type: 'tablet', os: 'Android', device: 'Android Tablet' };
        }
        
        return { type: 'desktop', os: 'Other', device: 'Desktop' };
    }

    /**
     * Inicialización de optimizaciones móviles
     */
    initializeMobileOptimizations() {
        if (!this.isMobile) return;

        this.setupViewport();
        this.setupTouchOptimizations();
        this.setupIOSSpecificFeatures();
        this.setupPWAFeatures();
        this.setupMobileAuth();
    }

    setupViewport() {
        // Configurar viewport para móviles
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

        // Meta tags específicos para iOS
        if (this.isIOS) {
            this.addMetaTag('apple-mobile-web-app-capable', 'yes');
            this.addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
            this.addMetaTag('apple-mobile-web-app-title', 'FutPro');
            this.addMetaTag('format-detection', 'telephone=no');
        }
    }

    addMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    setupTouchOptimizations() {
        // Prevenir zoom en inputs
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Optimizar scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Mejorar tap targets
        const style = document.createElement('style');
        style.textContent = `
            button, .btn, .touch-target {
                min-height: 44px;
                min-width: 44px;
                touch-action: manipulation;
            }
            
            input, textarea {
                font-size: 16px; /* Prevenir zoom en iOS */
            }
            
            .mobile-optimized {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    setupIOSSpecificFeatures() {
        if (!this.isIOS) return;

        // Configurar Safe Area para iPhone X+
        const safeAreaStyle = document.createElement('style');
        safeAreaStyle.textContent = `
            :root {
                --safe-area-inset-top: env(safe-area-inset-top);
                --safe-area-inset-right: env(safe-area-inset-right);
                --safe-area-inset-bottom: env(safe-area-inset-bottom);
                --safe-area-inset-left: env(safe-area-inset-left);
            }
            
            .ios-safe-area {
                padding-top: var(--safe-area-inset-top);
                padding-right: var(--safe-area-inset-right);
                padding-bottom: var(--safe-area-inset-bottom);
                padding-left: var(--safe-area-inset-left);
            }
            
            .ios-top-safe {
                padding-top: calc(var(--safe-area-inset-top) + 20px);
            }
            
            .ios-bottom-safe {
                padding-bottom: calc(var(--safe-area-inset-bottom) + 20px);
            }
        `;
        document.head.appendChild(safeAreaStyle);

        // Configurar gestos específicos de iOS
        this.setupIOSGestures();
    }

    setupIOSGestures() {
        // Prevenir bounce scroll
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.scrollable')) return;
            e.preventDefault();
        }, { passive: false });

        // Gesture para cerrar modales
        let startY = 0;
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const deltaY = endY - startY;
            
            if (deltaY > 100) {
                // Swipe down - cerrar modal si existe
                const modal = document.querySelector('.modal.active, .popup.active');
                if (modal && window.futProApp?.uiManager) {
                    window.futProApp.uiManager.closeModal();
                }
            }
        });
    }

    setupPWAFeatures() {
        // Configurar PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallButton();
        });

        // Detectar cuando se instala la PWA
        window.addEventListener('appinstalled', () => {
            console.log('📱 PWA instalada correctamente');
            this.trackPWAInstall();
        });
    }

    showInstallButton() {
        // Mostrar botón de instalación personalizado
        const installBtn = document.createElement('button');
        installBtn.className = 'pwa-install-btn';
        installBtn.innerHTML = '📱 Instalar FutPro';
        installBtn.onclick = () => this.installPWA();
        
        // Agregar a la UI si no existe
        if (!document.querySelector('.pwa-install-btn')) {
            const header = document.querySelector('header, .header, .top-bar');
            if (header) {
                header.appendChild(installBtn);
            }
        }
    }

    async installPWA() {
        if (!this.installPrompt) return;

        try {
            const result = await this.installPrompt.prompt();
            console.log('PWA install result:', result.outcome);
            
            if (result.outcome === 'accepted') {
                this.trackPWAInstall();
            }
        } catch (error) {
            console.error('Error instalando PWA:', error);
        }

        this.installPrompt = null;
    }

    trackPWAInstall() {
        // Analytics de instalación PWA
        if (window.futProApp?.analyticsManager) {
            window.futProApp.analyticsManager.trackEvent('PWA_Installed', {
                device: this.device,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Configuración de autenticación móvil
     */
    setupMobileAuth() {
        // Configurar deep links para OAuth
        this.setupDeepLinks();
        
        // Optimizar flujo de auth para móviles
        this.optimizeAuthFlow();
    }

    setupDeepLinks() {
        // Registrar custom URL scheme para iOS
        if (this.isIOS) {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.href = `${this.iosConfig.customScheme}://`;
            document.head.appendChild(link);
        }

        // Escuchar deep links
        window.addEventListener('hashchange', () => {
            this.handleDeepLink(window.location.hash);
        });

        // Verificar si llegamos via deep link
        if (window.location.hash) {
            this.handleDeepLink(window.location.hash);
        }
    }

    handleDeepLink(hash) {
        if (hash.includes('#auth/callback')) {
            console.log('📱 Deep link de auth recibido');
            this.handleAuthCallback();
        }
    }

    optimizeAuthFlow() {
        // Override de métodos de auth para móviles
        if (window.futProApp?.authService) {
            window.futProApp.authService.signInWithGoogle = async () => {
                return this.mobileSignInWithGoogle();
            };
        }
    }

    async mobileSignInWithGoogle() {
        try {
            const config = {
                provider: 'google',
                options: {
                    redirectTo: this.iosConfig.callbackUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            };

            // Configuración específica para iOS
            if (this.isIOS) {
                config.options.queryParams.mobile = 'ios';
                config.options.queryParams.device = this.device.device;
            }

            const { error } = await supabase.auth.signInWithOAuth(config);

            if (error) throw error;

            return {
                success: true,
                message: 'Redirigiendo a Google...',
                mobile: true
            };

        } catch (error) {
            console.error('Error en login móvil con Google:', error);
            throw error;
        }
    }

    async handleAuthCallback() {
        try {
            // Procesar callback de autenticación
            const { data, error } = await supabase.auth.getSession();
            
            if (error) throw error;

            if (data.session) {
                console.log('📱 Sesión móvil establecida correctamente');
                
                // Notificar a la app principal
                if (window.futProApp?.authService) {
                    window.futProApp.authService.currentUser = data.session.user;
                    window.futProApp.authService.isAuthenticated = true;
                }

                // Redirect a la app
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Error procesando callback móvil:', error);
            this.showAuthError('Error en autenticación móvil');
        }
    }

    showAuthError(message) {
        // Mostrar error de forma móvil-friendly
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mobile-auth-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Utilidades móviles
     */
    vibrate(pattern = [200]) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    getNetworkInfo() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    enableKioskMode() {
        // Modo kiosco para tablets
        if (this.device.type === 'tablet') {
            document.documentElement.requestFullscreen?.();
            screen.orientation?.lock?.('landscape');
        }
    }

    shareContent(data) {
        // API de compartir nativa
        if (navigator.share) {
            return navigator.share(data);
        } else {
            // Fallback para navegadores sin soporte
            this.fallbackShare(data);
        }
    }

    fallbackShare(data) {
        const shareUrl = `whatsapp://send?text=${encodeURIComponent(data.text + ' ' + data.url)}`;
        window.open(shareUrl, '_blank');
    }

    /**
     * Optimizaciones de rendimiento móvil
     */
    optimizeImages() {
        // Lazy loading de imágenes
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupOfflineMode() {
        // Service Worker para funcionalidad offline
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('📱 Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.error('Error registrando Service Worker:', error);
                });
        }
    }

    /**
     * Eventos de ciclo de vida móvil
     */
    handleAppStateChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 App pausada');
                this.onAppPause();
            } else {
                console.log('📱 App resumida');
                this.onAppResume();
            }
        });
    }

    onAppPause() {
        // Pausar streams, timers, etc.
        if (window.futProApp?.streamManager) {
            window.futProApp.streamManager.pauseAll();
        }
    }

    onAppResume() {
        // Resumir funcionalidades
        if (window.futProApp?.streamManager) {
            window.futProApp.streamManager.resumeAll();
        }
        
        // Verificar sesión
        if (window.futProApp?.authService) {
            window.futProApp.authService.checkSession();
        }
    }
}

// Exportar instancia singleton
export const mobileManager = new MobileManager();

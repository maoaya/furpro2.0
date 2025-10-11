// 🔧 SCRIPT DE NAVEGACION GLOBAL - ULTRA ROBUSTO
// Se ejecuta inmediatamente al cargar cualquier página

(function() {
    'use strict';
    
    console.log('🔥 Script de navegación global cargado');
    
    // Función de navegación ultra-robusta
    window.navegarUltraRobusto = function(url, descripcion = 'navegación') {
        console.log(`🚀 Iniciando ${descripcion} ultra-robusta a: ${url}`);
        
        const metodos = [
            () => {
                if (window.navigate && typeof window.navigate === 'function') {
                    window.navigate(url);
                    return 'React Router navigate()';
                } else {
                    throw new Error('React Router no disponible');
                }
            },
            () => {
                window.location.href = url;
                return 'window.location.href';
            },
            () => {
                window.location.assign(url);
                return 'window.location.assign()';
            },
            () => {
                window.location.replace(url);
                return 'window.location.replace()';
            },
            () => {
                window.open(url, '_self');
                return 'window.open(_self)';
            },
            () => {
                // Método de último recurso
                const form = document.createElement('form');
                form.method = 'GET';
                form.action = url;
                document.body.appendChild(form);
                form.submit();
                return 'form.submit()';
            }
        ];
        
        let exito = false;
        for (let i = 0; i < metodos.length && !exito; i++) {
            try {
                const metodo = metodos[i]();
                console.log(`✅ Método ${i + 1} exitoso: ${metodo}`);
                exito = true;
            } catch (error) {
                console.warn(`⚠️ Método ${i + 1} falló:`, error.message);
                
                // Si es el último método, agregamos un retraso
                if (i === metodos.length - 1) {
                    setTimeout(() => {
                        try {
                            metodos[i]();
                            console.log(`✅ Método ${i + 1} exitoso tras retraso`);
                        } catch (finalError) {
                            console.error(`❌ Todos los métodos fallaron. Último error:`, finalError);
                            
                            // Mostrar mensaje al usuario
                            const mensaje = `No se pudo navegar automáticamente a ${url}. Por favor, ve manualmente a esa dirección.`;
                            alert(mensaje);
                        }
                    }, 1000);
                }
            }
        }
    };
    
    // Función específica para ir a registro
    window.irARegistro = function() {
        console.log('👤 Ejecutando navegación específica a registro...');
        window.navegarUltraRobusto('/registro-nuevo', 'navegación a registro');
    };
    
    // Función específica para ir al home
    window.irAHome = function() {
        console.log('🏠 Ejecutando navegación específica al home...');
        window.navegarUltraRobusto('/home', 'navegación al home');
    };
    
    // Auto-adjuntar eventos cuando el DOM esté listo
    function adjuntarEventos() {
        // Buscar todos los botones que contengan "Crear Usuario"
        const botones = document.querySelectorAll('button');
        botones.forEach(boton => {
            const texto = boton.textContent || boton.innerText || '';
            if (texto.toLowerCase().includes('crear usuario')) {
                console.log(`🔗 Adjuntando evento de backup a botón: "${texto}"`);
                
                // Agregar evento de backup
                boton.addEventListener('click', function(e) {
                    // Esperar un momento para que el handler original se ejecute
                    setTimeout(() => {
                        // Verificar si la navegación fue exitosa
                        const urlActual = window.location.pathname;
                        if (urlActual === '/' || urlActual === '/login') {
                            console.log('⚠️ Navegación original no funcionó, ejecutando backup...');
                            window.irARegistro();
                        }
                    }, 500);
                }, true); // Usar capturing phase
            }
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', adjuntarEventos);
    } else {
        adjuntarEventos();
    }
    
    // También ejecutar cuando haya cambios en el DOM (para React)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Esperar un momento para que React termine de renderizar
                setTimeout(adjuntarEventos, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Script de navegación global configurado completamente');
    
})();

// Exportar para uso en módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navegarUltraRobusto: window.navegarUltraRobusto,
        irARegistro: window.irARegistro,
        irAHome: window.irAHome
    };
}
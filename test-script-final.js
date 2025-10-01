/* 
 * SCRIPT DE PRUEBA FINAL - FUTPRO REGISTRO
 * 
 * INSTRUCCIONES:
 * 1. Abre https://futpro.vip/registro en tu navegador
 * 2. Abre la consola del navegador (F12 → Console)
 * 3. Copia y pega este código completo
 * 4. Presiona Enter para ejecutar
 * 
 * El script hará todo automáticamente y te dirá si funciona.
 */

(async function testRegistroAutoConfirm() {
    console.log('🧪 INICIANDO PRUEBA DE REGISTRO AUTO-CONFIRM');
    console.log('🌐 URL actual:', window.location.href);
    
    // Esperar a que la página cargue completamente
    console.log('⏳ Esperando carga completa...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que estamos en la página correcta
    if (!window.location.href.includes('futpro.vip') || !window.location.pathname.includes('registro')) {
        console.error('❌ ERROR: No estás en la página de registro de futpro.vip');
        console.log('💡 Navega a: https://futpro.vip/registro');
        return;
    }
    
    console.log('✅ Página de registro confirmada');
    
    // Buscar banner de auto-confirm
    console.log('🔍 Buscando banner de auto-confirm...');
    const bannerSelectors = [
        '[style*="background.*#fff3cd"]',
        '[style*="QA"]',
        'div:contains("auto-confirm")',
        'div:contains("verificación por email")',
        'div:contains("Modo QA")'
    ];
    
    let banner = null;
    for (const selector of bannerSelectors) {
        try {
            if (selector.includes(':contains')) {
                const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                banner = [...document.querySelectorAll('div')].find(el => 
                    el.textContent && el.textContent.includes(text)
                );
            } else {
                banner = document.querySelector(selector);
            }
            if (banner) break;
        } catch (e) {}
    }
    
    if (banner) {
        console.log('✅ Banner de auto-confirm ENCONTRADO:', banner.textContent?.substring(0, 100));
    } else {
        console.warn('⚠️ Banner de auto-confirm NO encontrado');
        console.log('💡 Esto podría significar que auto-confirm no está activo');
    }
    
    // Generar datos de prueba únicos
    const timestamp = Date.now();
    const testData = {
        nombre: `Test Usuario ${timestamp}`,
        email: `test.${timestamp}@futpro.test`,
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
    };
    
    console.log('👤 Datos de prueba generados:', {
        nombre: testData.nombre,
        email: testData.email,
        password: '***'
    });
    
    // Buscar campos del formulario
    console.log('🔍 Buscando campos del formulario...');
    
    const fields = {
        nombre: document.querySelector('input[name="nombre"]') || 
               document.querySelector('input[placeholder*="nombre" i]') ||
               document.querySelector('input[placeholder*="Nombre" i]'),
        
        email: document.querySelector('input[name="email"]') || 
              document.querySelector('input[type="email"]'),
        
        password: document.querySelector('input[name="password"]') || 
                 document.querySelectorAll('input[type="password"]')[0],
        
        confirmPassword: document.querySelector('input[name="confirmPassword"]') ||
                        document.querySelectorAll('input[type="password"]')[1],
        
        submit: document.querySelector('button[type="submit"]') ||
               document.querySelector('button:contains("Crear")') ||
               document.querySelector('button:contains("Registr")') ||
               [...document.querySelectorAll('button')].find(btn => 
                   btn.textContent && (btn.textContent.includes('Crear') || btn.textContent.includes('Registr'))
               )
    };
    
    console.log('📝 Campos encontrados:', {
        nombre: !!fields.nombre,
        email: !!fields.email,
        password: !!fields.password,
        confirmPassword: !!fields.confirmPassword,
        submit: !!fields.submit
    });
    
    // Verificar campos críticos
    if (!fields.email || !fields.password || !fields.submit) {
        console.error('❌ ERROR: Faltan campos críticos del formulario');
        console.log('🔧 Intentando con registro completo...');
        window.location.href = '/registro-completo';
        return;
    }
    
    // Llenar formulario
    console.log('✏️ Llenando formulario...');
    
    if (fields.nombre) {
        fields.nombre.value = testData.nombre;
        fields.nombre.dispatchEvent(new Event('input', { bubbles: true }));
        fields.nombre.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    fields.email.value = testData.email;
    fields.email.dispatchEvent(new Event('input', { bubbles: true }));
    fields.email.dispatchEvent(new Event('change', { bubbles: true }));
    
    fields.password.value = testData.password;
    fields.password.dispatchEvent(new Event('input', { bubbles: true }));
    fields.password.dispatchEvent(new Event('change', { bubbles: true }));
    
    if (fields.confirmPassword) {
        fields.confirmPassword.value = testData.confirmPassword;
        fields.confirmPassword.dispatchEvent(new Event('input', { bubbles: true }));
        fields.confirmPassword.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    console.log('✅ Formulario completado');
    
    // Configurar listener para redirección
    const originalUrl = window.location.href;
    let redirectDetected = false;
    let finalDestination = '';
    
    const redirectListener = () => {
        if (window.location.href !== originalUrl && !redirectDetected) {
            redirectDetected = true;
            finalDestination = window.location.href;
            console.log('🔄 REDIRECCIÓN DETECTADA!');
            console.log('📍 Destino:', finalDestination);
            
            if (window.location.pathname.includes('/home')) {
                console.log('🏠 ✅ ÉXITO! Redirigido a página HOME');
                console.log('🎉 PRUEBA COMPLETADA EXITOSAMENTE');
            } else {
                console.log('📍 Redirigido a:', window.location.pathname);
                console.log('⚠️ No fue a /home, pero hubo redirección');
            }
        }
    };
    
    // Monitor de redirección
    const redirectInterval = setInterval(redirectListener, 200);
    
    // Listener para cambios de URL (SPA)
    window.addEventListener('popstate', redirectListener);
    
    // Observer para cambios en el DOM que indiquen navegación
    const observer = new MutationObserver(() => {
        redirectListener();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Enviar formulario
    console.log('🚀 ENVIANDO FORMULARIO...');
    console.log('⏰ Tiempo de inicio:', new Date().toLocaleTimeString());
    
    try {
        // Intentar click en botón
        fields.submit.click();
        console.log('✅ Click en botón ejecutado');
        
        // Backup: enviar evento de submit al form
        setTimeout(() => {
            const form = fields.submit.closest('form') || document.querySelector('form');
            if (form && !redirectDetected) {
                console.log('🔄 Enviando evento submit al formulario...');
                form.dispatchEvent(new Event('submit', { bubbles: true }));
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error al enviar formulario:', error);
    }
    
    // Timeout para resultados
    setTimeout(() => {
        clearInterval(redirectInterval);
        observer.disconnect();
        
        console.log('\n📊 RESULTADOS FINALES:');
        console.log('=====================================');
        
        if (redirectDetected) {
            console.log('✅ Redirección detectada');
            console.log('📍 Destino final:', finalDestination);
            
            if (finalDestination.includes('/home')) {
                console.log('🏠 ✅ ÉXITO TOTAL: Llegó a HOME pages');
                console.log('🎯 Auto-confirm funcionando correctamente');
            } else {
                console.log('⚠️ Redirección a destino inesperado');
            }
        } else {
            console.log('❌ No se detectó redirección');
            console.log('⏳ Verificando estado actual...');
            
            // Buscar mensajes de error o éxito
            const errorMsg = document.querySelector('[style*="color: #ff4444"]') ||
                           document.querySelector('[style*="color: red"]') ||
                           [...document.querySelectorAll('*')].find(el => 
                               el.textContent && el.textContent.toLowerCase().includes('error')
                           );
            
            const successMsg = document.querySelector('[style*="color: #44ff44"]') ||
                             document.querySelector('[style*="color: green"]') ||
                             [...document.querySelectorAll('*')].find(el => 
                                 el.textContent && (
                                     el.textContent.toLowerCase().includes('exitoso') ||
                                     el.textContent.toLowerCase().includes('creado') ||
                                     el.textContent.toLowerCase().includes('registrado')
                                 )
                             );
            
            if (errorMsg) {
                console.log('❌ Error encontrado:', errorMsg.textContent?.substring(0, 200));
            } else if (successMsg) {
                console.log('✅ Mensaje de éxito:', successMsg.textContent?.substring(0, 200));
                console.log('⚠️ Pero faltó la redirección automática');
            } else {
                console.log('🤔 No se encontraron mensajes claros');
                console.log('💡 El formulario podría seguir procesando...');
            }
        }
        
        console.log('\n🔧 DIAGNÓSTICO:');
        console.log('- Banner auto-confirm:', banner ? 'ENCONTRADO' : 'NO ENCONTRADO');
        console.log('- Formulario completado:', '✅');
        console.log('- Submit ejecutado:', '✅');
        console.log('- Redirección:', redirectDetected ? '✅' : '❌');
        console.log('- Destino correcto:', finalDestination.includes('/home') ? '✅' : '❌');
        
        console.log('\n=====================================');
        console.log('🧪 PRUEBA FINALIZADA');
        
    }, 15000); // 15 segundos de timeout
    
})();

console.log('');
console.log('🧪 SCRIPT DE PRUEBA CARGADO');
console.log('📋 Ejecutándose automáticamente...');
console.log('⏰ Tiempo estimado: 15-20 segundos');
console.log('');
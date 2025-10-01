// Script de prueba para verificar el flujo de registro y redirección
// Usar en la consola del navegador en https://futpro.vip

async function testRegistrationFlow() {
  console.log('🧪 Iniciando prueba de flujo de registro...');
  
  // Datos de prueba
  const testUser = {
    nombre: `Usuario Test ${Date.now()}`,
    email: `test.${Date.now()}@futpro.test`,
    password: 'password123',
    confirmPassword: 'password123'
  };
  
  console.log('👤 Datos de prueba:', testUser);
  
  try {
    // Verificar que estamos en la página correcta
    if (!window.location.href.includes('futpro.vip')) {
      console.error('❌ No estás en futpro.vip');
      return;
    }
    
    // Navegar al registro si no estamos ahí
    if (!window.location.pathname.includes('registro')) {
      console.log('📍 Navegando a /registro...');
      window.location.href = '/registro';
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Buscar formulario
    await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar carga
    
    const nombreInput = document.querySelector('input[name="nombre"]') || 
                       document.querySelector('input[placeholder*="nombre"]') ||
                       document.querySelector('input[placeholder*="Nombre"]');
    
    const emailInput = document.querySelector('input[name="email"]') || 
                      document.querySelector('input[type="email"]');
    
    const passwordInput = document.querySelector('input[name="password"]') || 
                         document.querySelector('input[type="password"]');
    
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') ||
                                document.querySelectorAll('input[type="password"]')[1];
    
    const submitButton = document.querySelector('button[type="submit"]') ||
                        document.querySelector('button:contains("Crear")') ||
                        document.querySelector('button:contains("Registr")');
    
    console.log('🔍 Elementos encontrados:', {
      nombre: !!nombreInput,
      email: !!emailInput,
      password: !!passwordInput,
      confirmPassword: !!confirmPasswordInput,
      submit: !!submitButton
    });
    
    if (!nombreInput || !emailInput || !passwordInput) {
      console.error('❌ No se encontraron todos los campos del formulario');
      console.log('💡 Intentando con registro simple...');
      window.location.href = '/registro-simple';
      return;
    }
    
    // Llenar formulario
    console.log('✏️ Llenando formulario...');
    nombreInput.value = testUser.nombre;
    nombreInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    emailInput.value = testUser.email;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    passwordInput.value = testUser.password;
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    if (confirmPasswordInput) {
      confirmPasswordInput.value = testUser.confirmPassword;
      confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    console.log('📝 Formulario completado');
    
    // Verificar si hay banner de auto-confirm
    const banner = document.querySelector('[style*="Modo QA"]') ||
                  document.querySelector(':contains("auto-confirm")') ||
                  document.querySelector(':contains("verificación por email está desactivada")');
    
    if (banner) {
      console.log('✅ Banner de auto-confirm detectado - modo QA activo');
    } else {
      console.log('⚠️ No se detectó banner de auto-confirm');
    }
    
    // Escuchar cambios de URL para detectar redirección
    const originalUrl = window.location.href;
    let redirectDetected = false;
    
    const checkRedirect = () => {
      if (window.location.href !== originalUrl) {
        redirectDetected = true;
        console.log('🔄 Redirección detectada:', window.location.href);
        
        if (window.location.pathname.includes('/home')) {
          console.log('🏠 ¡Éxito! Redirigido a home pages');
          console.log('✅ Prueba completada exitosamente');
        } else {
          console.log('📍 Redirigido a:', window.location.pathname);
        }
      }
    };
    
    const redirectInterval = setInterval(checkRedirect, 500);
    
    // Enviar formulario
    console.log('🚀 Enviando formulario...');
    if (submitButton) {
      submitButton.click();
    } else {
      // Intentar submit del form
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
    
    // Esperar resultado
    setTimeout(() => {
      clearInterval(redirectInterval);
      if (!redirectDetected) {
        console.log('⏰ No se detectó redirección en 30 segundos');
        console.log('🔍 Verificando mensajes de error o éxito...');
        
        const errorMsg = document.querySelector('[style*="color: #ff4444"]') ||
                        document.querySelector('[style*="color: red"]') ||
                        document.querySelector(':contains("Error")');
        
        const successMsg = document.querySelector('[style*="color: #44ff44"]') ||
                          document.querySelector('[style*="color: green"]') ||
                          document.querySelector(':contains("exitoso")');
        
        if (errorMsg) {
          console.log('❌ Error detectado:', errorMsg.textContent);
        } else if (successMsg) {
          console.log('✅ Mensaje de éxito:', successMsg.textContent);
        } else {
          console.log('🤔 No se detectaron mensajes claros');
        }
      }
    }, 30000);
    
  } catch (error) {
    console.error('💥 Error en la prueba:', error);
  }
}

// Función auxiliar para elementos que contienen texto
function querySelector(selector) {
  if (selector.includes(':contains(')) {
    const text = selector.match(/:contains\("([^"]+)"\)/)[1];
    return [...document.querySelectorAll('*')].find(el => 
      el.textContent && el.textContent.includes(text)
    );
  }
  return document.querySelector(selector);
}

console.log('🧪 Script de prueba cargado');
console.log('📝 Para ejecutar: testRegistrationFlow()');
console.log('🌐 Asegúrate de estar en https://futpro.vip');

// Auto-ejecutar si estamos en futpro.vip
if (typeof window !== 'undefined' && window.location.href.includes('futpro.vip')) {
  console.log('🎯 Ejecutando prueba automáticamente en 3 segundos...');
  setTimeout(testRegistrationFlow, 3000);
}
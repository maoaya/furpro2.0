// 🧪 DIAGNÓSTICO COMPLETO DEL PROBLEMA DE REGISTRO
// Script para identificar y solucionar el problema de registro de usuarios

console.log('🚀 INICIANDO DIAGNÓSTICO DE REGISTRO - FutPro 2.0');
console.log('📅 Fecha:', new Date().toLocaleString());

// Función principal de diagnóstico
async function diagnosticarRegistro() {
  console.log('\n🔍 === DIAGNÓSTICO COMPLETO ===');
  
  // 1. Verificar configuración de entorno
  console.log('\n1️⃣ VERIFICANDO CONFIGURACIÓN DE ENTORNO...');
  
  const config = {
    supabaseUrl: import.meta?.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL,
    supabaseKey: import.meta?.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY,
    nodeEnv: import.meta?.env?.NODE_ENV || process.env?.NODE_ENV,
    isProduction: window?.location?.hostname === 'futpro.vip',
    isDevelopment: window?.location?.hostname === 'localhost'
  };
  
  console.log('📊 Configuración detectada:', {
    hasSupabaseUrl: !!config.supabaseUrl,
    hasSupabaseKey: !!config.supabaseKey,
    supabaseUrlFormat: config.supabaseUrl?.includes('supabase.co') ? '✅ Válida' : '❌ Inválida',
    environment: config.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'
  });
  
  // 2. Test de conexión Supabase
  console.log('\n2️⃣ PROBANDO CONEXIÓN SUPABASE...');
  
  try {
    // Importar dinámicamente supabase para evitar errores de módulo
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);
    
    // Test de conexión básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Error de conexión Supabase:', connectionError.message);
      return { success: false, error: 'No hay conexión con Supabase' };
    }
    
    console.log('✅ Conexión Supabase: OK');
    
    // 3. Test de signup básico
    console.log('\n3️⃣ PROBANDO SIGNUP BÁSICO...');
    
    const testEmail = `test_${Date.now()}@futpro.test`;
    const testPassword = 'TestPassword123!';
    
    console.log(`📧 Email de prueba: ${testEmail}`);
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true
      }
    });
    
    if (signupError) {
      console.warn('⚠️ Error en signup básico:', signupError.message);
      
      // Intentar con función de bypass
      console.log('\n4️⃣ PROBANDO FUNCIÓN DE BYPASS...');
      try {
        const bypassResponse = await fetch('/.netlify/functions/signup-bypass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: testPassword,
            nombre: 'Usuario Test'
          })
        });
        
        const bypassResult = await bypassResponse.json();
        
        if (bypassResponse.ok && bypassResult.success) {
          console.log('✅ Función de bypass: OK');
          console.log('📊 Usuario creado vía bypass:', bypassResult.user);
        } else {
          console.error('❌ Error en función de bypass:', bypassResult.error);
        }
      } catch (bypassError) {
        console.error('❌ Error llamando función de bypass:', bypassError.message);
      }
    } else {
      console.log('✅ Signup básico: OK');
      console.log('📊 Usuario creado:', signupData.user?.email);
    }
    
    // 4. Test de creación de perfil
    console.log('\n5️⃣ PROBANDO CREACIÓN DE PERFIL...');
    
    const testUserId = signupData?.user?.id || 'test-user-id';
    const profileData = {
      id: testUserId,
      email: testEmail,
      nombre: 'Usuario Test',
      apellido: 'Test',
      rol: 'usuario',
      tipo_usuario: 'jugador',
      created_at: new Date().toISOString()
    };
    
    const { data: profileResult, error: profileError } = await supabase
      .from('usuarios')
      .insert([profileData])
      .select();
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError.message);
      
      // Verificar si es problema de permisos
      if (profileError.message.includes('permission') || profileError.message.includes('policy')) {
        console.log('🔒 Problema de permisos RLS detectado');
        console.log('💡 Solución: Verificar políticas de Row Level Security en Supabase');
      }
    } else {
      console.log('✅ Creación de perfil: OK');
      console.log('📊 Perfil creado:', profileResult[0]);
    }
    
  } catch (importError) {
    console.error('❌ Error importando Supabase:', importError.message);
    return { success: false, error: 'Error de configuración de módulos' };
  }
  
  // 5. Verificar navegación
  console.log('\n6️⃣ VERIFICANDO NAVEGACIÓN...');
  
  const currentUrl = window.location.href;
  const hasReactRouter = !!document.querySelector('[data-testid="router"], #root');
  
  console.log('📍 URL actual:', currentUrl);
  console.log('⚛️ React Router detectado:', hasReactRouter ? 'SÍ' : 'NO');
  
  // 6. Recomendaciones finales
  console.log('\n🎯 === RECOMENDACIONES ===');
  
  const recomendaciones = [];
  
  if (!config.supabaseUrl || !config.supabaseKey) {
    recomendaciones.push('📝 Configurar variables de entorno de Supabase');
  }
  
  if (config.isDevelopment) {
    recomendaciones.push('🔧 Asegurar que el backend esté ejecutándose en puerto 3000');
    recomendaciones.push('🌐 Verificar que Vite esté ejecutándose en puerto 5173');
  }
  
  recomendaciones.push('📊 Verificar políticas RLS en tabla usuarios');
  recomendaciones.push('🔐 Confirmar configuración OAuth en Supabase dashboard');
  recomendaciones.push('📧 Verificar configuración de email en Supabase Auth');
  
  recomendaciones.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  console.log('\n✅ DIAGNÓSTICO COMPLETADO');
  console.log('📋 Revisa los logs anteriores para identificar problemas específicos');
  
  return { success: true, message: 'Diagnóstico completado' };
}

// Exportar función para uso en consola
if (typeof window !== 'undefined') {
  window.diagnosticarRegistro = diagnosticarRegistro;
  console.log('\n💡 Para ejecutar: window.diagnosticarRegistro()');
}

// Auto-ejecutar si estamos en un entorno de desarrollo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('\n🚀 Auto-ejecutando diagnóstico en 2 segundos...');
  setTimeout(diagnosticarRegistro, 2000);
}

export default diagnosticarRegistro;
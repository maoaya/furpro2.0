// 🧪 TEST SIMPLE DE REGISTRO - Diagnóstico directo
// ⚠️ DEPRECADO: Este script crea instancias temporales de Supabase
// Para testing normal, usar src/supabaseClient.js
// Este archivo se mantiene solo para diagnóstico de emergencia

async function testRegistroSimple() {
  console.log('🚀 INICIANDO TEST SIMPLE DE REGISTRO');
  console.warn('⚠️ Este test crea una instancia temporal de Supabase');
  
  // Generar email único
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@futpro.test`;
  const testPassword = 'Test123456!';
  
  console.log('📧 Email de prueba:', testEmail);
  console.log('🔑 Password:', testPassword);
  
  try {
    // Importar Supabase
    const { createClient } = await import('@supabase/supabase-js');
    
    // Configuración Supabase (valores de emergencia, preferir .env)
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qqrxetxcglwrejtblwut.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8';
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      db: { schema: 'api' }
    });
    
    console.log('✅ Cliente Supabase temporal creado');
    
    // PASO 1: Test de conexión básica
    console.log('\n1️⃣ Probando conexión básica...');
    
    const { data: pingData, error: pingError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (pingError) {
      console.error('❌ Error de conexión:', pingError.message);
      return;
    }
    
    console.log('✅ Conexión OK');
    
    // PASO 2: Intentar signup
    console.log('\n2️⃣ Intentando signup...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
        shouldCreateUser: true
      }
    });
    
    if (authError) {
      console.error('❌ Error en signup:', authError.message);
      
      // PASO 3: Intentar función de bypass
      console.log('\n3️⃣ Intentando función de bypass...');
      
      try {
        const response = await fetch('/.netlify/functions/signup-bypass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: testEmail,
            password: testPassword,
            nombre: 'Test User'
          })
        });
        
        const bypassResult = await response.json();
        
        if (response.ok && bypassResult.success) {
          console.log('✅ Bypass exitoso:', bypassResult);
        } else {
          console.error('❌ Error en bypass:', bypassResult.error);
        }
      } catch (bypassError) {
        console.error('❌ Error llamando bypass:', bypassError.message);
      }
      
      return;
    }
    
    console.log('✅ Signup exitoso:', authData.user);
    
    // PASO 4: Crear perfil en base de datos
    console.log('\n4️⃣ Creando perfil en BD...');
    
    const profileData = {
      id: authData.user.id,
      email: authData.user.email,
      nombre: 'Test User',
      apellido: 'Test',
      rol: 'usuario',
      tipo_usuario: 'jugador',
      estado: 'activo',
      posicion: 'Delantero',
      frecuencia_juego: 1,
      pais: 'España',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: profileResult, error: profileError } = await supabase
      .from('usuarios')
      .insert([profileData])
      .select();
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError.message);
      
      // Intentar diagnóstico de permisos
      if (profileError.message.includes('permission')) {
        console.log('🔒 PROBLEMA: Políticas de Row Level Security');
        console.log('💡 SOLUCIÓN: Ejecutar el script fix_rls_usuarios.sql en Supabase');
      }
      
      return;
    }
    
    console.log('✅ Perfil creado:', profileResult[0]);
    
    // PASO 5: Verificar login
    console.log('\n5️⃣ Probando login...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Error en login:', loginError.message);
      return;
    }
    
    console.log('✅ Login exitoso:', loginData.user.email);
    
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('📊 RESUMEN:');
    console.log('- Conexión Supabase: ✅');
    console.log('- Signup: ✅');
    console.log('- Creación de perfil: ✅');
    console.log('- Login: ✅');
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

// Función para limpiar usuarios de prueba
async function limpiarUsuariosPrueba() {
  console.log('🧹 LIMPIANDO USUARIOS DE PRUEBA...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const SUPABASE_URL = 'https://qqrxetxcglwrejtblwut.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.kXZzpXZQf3rS_LRNnWf0Bz7r4Ik8vqhAoTKxGzgwWFA';
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'api' } });
    
    const { data, error } = await supabase
      .from('usuarios')
      .delete()
      .like('email', 'test%@futpro.test');
    
    if (error) {
      console.error('❌ Error limpiando:', error.message);
    } else {
      console.log('✅ Usuarios de prueba eliminados');
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Hacer funciones globales
if (typeof window !== 'undefined') {
  window.testRegistroSimple = testRegistroSimple;
  window.limpiarUsuariosPrueba = limpiarUsuariosPrueba;
  
  console.log('📝 Funciones disponibles:');
  console.log('- window.testRegistroSimple() - Ejecutar test completo');
  console.log('- window.limpiarUsuariosPrueba() - Limpiar datos de prueba');
}

export { testRegistroSimple, limpiarUsuariosPrueba };
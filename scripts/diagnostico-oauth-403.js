// Diagnóstico específico de OAuth
import supabase from '../src/supabaseClient.js';

const diagnosticarOAuth = async () => {
  console.log('🔍 DIAGNÓSTICO OAUTH - ERROR 403');
  console.log('=' .repeat(50));
  
  try {
    // Verificar conexión básica a Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Error de conexión a Supabase:', error.message);
    } else {
      console.log('✅ Conexión a Supabase OK');
    }
    
    // Mostrar configuración actual
    console.log('\n📊 Configuración actual:');
    console.log('- Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('- Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Faltante');
    console.log('- Entorno:', window.location.hostname);
    console.log('- URL actual:', window.location.href);
    
    // URLs que deben estar configuradas
    console.log('\n🔧 CONFIGURACIÓN REQUERIDA EN SUPABASE:');
    console.log('\n1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/url-configuration');
    console.log('\n2. Site URL debe ser:');
    console.log('   http://localhost:3000');
    console.log('\n3. Redirect URLs debe incluir:');
    console.log('   http://localhost:3000/auth/callback');
    console.log('   http://localhost:3000/auth/callback-premium');
    console.log('   http://localhost:3000/**');
    
    console.log('\n4. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers');
    console.log('\n5. Google OAuth debe estar:');
    console.log('   ✅ Habilitado');
    console.log('   ✅ Client ID configurado');
    console.log('   ✅ Client Secret configurado');
    
    console.log('\n📋 URLs de callback de Supabase:');
    console.log('   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback');
    console.log('   ⬆️ Esta URL debe estar en Google Console');
    
    console.log('\n🚨 CAUSA PROBABLE DEL ERROR 403:');
    console.log('   1. Site URL no configurada en Supabase');
    console.log('   2. Redirect URLs no incluye localhost:3000');
    console.log('   3. Google OAuth no habilitado');
    console.log('   4. Client ID/Secret incorrecto en Google OAuth');
    
    console.log('\n=' .repeat(50));
    
  } catch (error) {
    console.error('💥 Error en diagnóstico:', error);
  }
};

// Auto-ejecutar
if (typeof window !== 'undefined') {
  diagnosticarOAuth();
}

export { diagnosticarOAuth };
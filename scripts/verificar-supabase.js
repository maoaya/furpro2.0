// Script para verificar y mostrar la configuración de Supabase OAuth
import supabase from '../src/supabaseClient.js';

const verificarConfiguracionSupabase = async () => {
  console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN SUPABASE');
  console.log('=' .repeat(60));
  
  try {
    // Verificar conexión
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Error de conexión:', error.message);
    } else {
      console.log('✅ Conexión a Supabase: OK');
    }
    
    // Mostrar configuración actual
    const config = {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada',
      environment: import.meta.env.MODE
    };
    
    console.log('\n📊 Configuración actual:');
    console.log('- URL Supabase:', config.url);
    console.log('- Anon Key:', config.key);
    console.log('- Entorno:', config.environment);
    
    console.log('\n🔧 URLs que DEBEN estar configuradas en Supabase OAuth:');
    console.log('\n📍 Para desarrollo:');
    console.log('  Site URL: http://localhost:3000');
    console.log('  Redirect URLs:');
    console.log('    - http://localhost:3000/auth/callback');
    console.log('    - http://localhost:3000/auth/callback-premium');
    
    console.log('\n🌐 Para producción:');
    console.log('  Site URL: https://futpro.vip');
    console.log('  Redirect URLs:');
    console.log('    - https://futpro.vip/auth/callback');
    console.log('    - https://futpro.vip/auth/callback-premium');
    
    console.log('\n⚙️ Configuración en Supabase Dashboard:');
    console.log('1. Ve a: https://supabase.com/dashboard/project/[TU-PROJECT-ID]/auth/url-configuration');
    console.log('2. En "Site URL" configura la URL principal');
    console.log('3. En "Redirect URLs" agrega todas las URLs de callback');
    
    console.log('\n🔑 Configuración de OAuth Providers:');
    console.log('Google OAuth:');
    console.log('- Ve a: https://supabase.com/dashboard/project/[TU-PROJECT-ID]/auth/providers');
    console.log('- Habilita Google OAuth');
    console.log('- Configura Client ID y Client Secret');
    console.log('- Authorized redirect URIs en Google Console:');
    console.log('  * https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback');
    
    console.log('\nFacebook OAuth:');
    console.log('- Habilita Facebook OAuth en Supabase');
    console.log('- Configura App ID y App Secret');
    console.log('- Valid OAuth Redirect URIs en Facebook:');
    console.log('  * https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback');
    
    console.log('\n=' .repeat(60));
    
  } catch (error) {
    console.error('💥 Error verificando configuración:', error);
  }
};

// Ejecutar verificación
verificarConfiguracionSupabase();
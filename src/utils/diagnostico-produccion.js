// DIAGNÓSTICO DE PRODUCCIÓN - OAUTH FUTPRO.VIP
// Este script verifica por qué los botones OAuth no funcionan en producción

console.log('🚀 INICIANDO DIAGNÓSTICO DE PRODUCCIÓN - OAUTH FUTPRO.VIP');
console.log('==========================================');

// 1. Verificar entorno
const hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = window.location.port;
const fullUrl = window.location.href;

console.log('🌍 INFORMACIÓN DE ENTORNO:');
console.log('- Hostname:', hostname);
console.log('- Protocol:', protocol);
console.log('- Port:', port);
console.log('- URL completa:', fullUrl);
console.log('- Es producción?', hostname === 'futpro.vip' || hostname === 'www.futpro.vip');

// 2. Verificar si conexionEfectiva está disponible
try {
  const { conexionEfectiva } = await import('../services/conexionEfectiva.js');
  console.log('✅ conexionEfectiva.js cargado correctamente');
  
  // 3. Verificar función de detección de entorno
  console.log('🔍 VERIFICANDO DETECCIÓN DE ENTORNO:');
  
  // Llamar a la función de verificación
  const conexionOk = await conexionEfectiva.verificarConexion();
  console.log('- Verificación de conexión:', conexionOk ? '✅ OK' : '❌ FALLO');
  
} catch (error) {
  console.error('❌ ERROR cargando conexionEfectiva:', error);
}

// 4. Verificar variables de entorno de Vite
console.log('🔧 VARIABLES DE ENTORNO VITE:');
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || 'NO DEFINIDA');
console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NO DEFINIDA');
console.log('- VITE_BASE_URL:', import.meta.env.VITE_BASE_URL || 'NO DEFINIDA');
console.log('- VITE_OAUTH_CALLBACK_URL:', import.meta.env.VITE_OAUTH_CALLBACK_URL || 'NO DEFINIDA');

// 5. Verificar cliente Supabase
try {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = 'https://qqrxetxcglwrejtblwut.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Cliente Supabase creado correctamente');
  
  // Test rápido de conexión
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log('⚠️ Error obteniendo sesión (normal si no hay sesión activa):', error.message);
  } else {
    console.log('✅ Conexión a Supabase Auth OK');
  }
  
} catch (error) {
  console.error('❌ ERROR con cliente Supabase:', error);
}

// 6. Verificar si el evento click está siendo capturado
console.log('🖱️ VERIFICANDO EVENTOS DE BOTONES:');

// Buscar botones OAuth
const botones = document.querySelectorAll('button');
let botonesOAuth = [];

botones.forEach((btn, index) => {
  const texto = btn.textContent?.toLowerCase() || '';
  if (texto.includes('google') || texto.includes('facebook')) {
    botonesOAuth.push({
      index,
      texto: btn.textContent,
      disabled: btn.disabled,
      onClick: btn.onclick ? 'TIENE EVENTO' : 'SIN EVENTO',
      listeners: btn.getEventListeners ? Object.keys(btn.getEventListeners()) : 'N/A'
    });
  }
});

if (botonesOAuth.length > 0) {
  console.log('📋 BOTONES OAUTH ENCONTRADOS:', botonesOAuth);
} else {
  console.log('❌ NO SE ENCONTRARON BOTONES OAUTH');
}

// 7. Test directo de funciones OAuth
console.log('🧪 PROBANDO FUNCIONES OAUTH DIRECTAMENTE:');

try {
  const { conexionEfectiva } = await import('../services/conexionEfectiva.js');
  
  console.log('🔵 Probando Google OAuth...');
  const resultadoGoogle = await conexionEfectiva.registrarConGoogle();
  console.log('Resultado Google:', resultadoGoogle);
  
} catch (error) {
  console.error('❌ Error probando Google OAuth:', error);
}

console.log('==========================================');
console.log('🎯 DIAGNÓSTICO COMPLETADO');
console.log('Revisa la consola para identificar el problema específico');
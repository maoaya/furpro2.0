// Test del flujo de registro con OAuth
console.log('🧪 Testing Registro Flow...');

// Simular llenado del formulario
const testForm = {
  nombre: 'Usuario Test',
  edad: 25,
  peso: 70,
  ciudad: 'Madrid',
  pais: 'España',
  posicion: 'Delantero',
  frecuencia_juego: 'Semanal',
  rol: 'usuario',
  tipo_usuario: 'jugador'
};

console.log('📝 Datos de prueba:', testForm);

// Verificar que Supabase esté configurado
if (typeof window !== 'undefined') {
  console.log('🌍 Entorno:', window.location.hostname);
  console.log('🔧 Local storage disponible:', typeof localStorage !== 'undefined');
  
  // Verificar configuración de Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔑 Supabase URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
  console.log('🔑 Supabase Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada');
}

export { testForm };
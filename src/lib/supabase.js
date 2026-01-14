// 🔄 Consolidación de cliente Supabase
// ⚠️ DEPRECATED: Esta ruta existe solo por compatibilidad hacia atrás.
// NUEVA FUENTE ÚNICA: src/supabaseClient.js
// Re-exportar la instancia única para evitar múltiples clientes

export { default as supabase } from '../supabaseClient.js';
export { default } from '../supabaseClient.js';

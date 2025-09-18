// Stub básico para supabaseClient en el backend
// Puedes reemplazar esto por la configuración real de Supabase si la necesitas

module.exports = {
  supabase: {
    from: () => ({ select: () => ({}) }),
    auth: { user: () => null }
  }
};

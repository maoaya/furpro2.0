
// Mock actualizado para supabaseClient compatible con todos los tests
const signInWithPassword = jest.fn(async () => ({ data: { user: { id: 1, email: 'test@futpro.com' } }, error: null }));
const signOut = jest.fn(async () => ({ error: null }));
const signIn = jest.fn(async () => ({ user: {}, error: null }));
// Archivo eliminado para evitar duplicados de mocks. Usar solo el de src/__mocks__.
const getUser = jest.fn(async () => ({ data: { user: { id: 1, email: 'test@futpro.com' } }, error: null }));
const onAuthStateChange = jest.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } }));
const signUp = jest.fn(async () => ({ data: { user: { id: 2, email: 'new@futpro.com' } }, error: null }));


const supabase = {
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null })
  }),
  auth: {
    signInWithPassword,
    signIn,
    signUp,
    signOut,
    getUser,
    onAuthStateChange
  },
  rpc: () => ({ data: [], error: null })
};

module.exports = {
  __esModule: true,
  default: supabase
};

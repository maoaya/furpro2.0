
// Mock actualizado para supabaseClient compatible con tests frontend y backend
const signInWithPassword = jest.fn(async () => ({ data: { user: { id: 1, email: 'test@futpro.com' } }, error: null }));
const signOut = jest.fn(async () => ({ error: null }));
const signIn = jest.fn(async () => ({ user: {}, error: null }));
const signUp = jest.fn(async () => ({ user: {}, error: null }));
const onAuthStateChange = jest.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } }));

const auth = { signInWithPassword, signIn, signUp, signOut, onAuthStateChange };

const supabase = {
	from: () => ({
		select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
		insert: () => Promise.resolve({ data: [], error: null }),
		update: () => Promise.resolve({ data: [], error: null }),
		delete: () => Promise.resolve({ data: [], error: null })
	}),
	auth
};

module.exports = {
	__esModule: true,
	default: supabase,
	auth,
};

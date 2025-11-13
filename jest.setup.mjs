// Configuración global para Jest en modo watch y mocks automáticos

// Variables de entorno para Jest
process.env.VITE_SUPABASE_URL = 'https://qqrxetxcglwrejtblwut.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8';
process.env.VITE_GOOGLE_CLIENT_ID = '760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com';
process.env.VITE_FACEBOOK_CLIENT_ID = '';

// Los mocks automáticos se deben definir en cada archivo de test ESM.

// Polyfills mínimos de entorno navegador para tests backend (entorno Node)
if (typeof global.localStorage === 'undefined') {
	const store = new Map();
	global.localStorage = {
		getItem: (k) => (store.has(k) ? store.get(k) : null),
		setItem: (k, v) => store.set(k, String(v)),
		removeItem: (k) => store.delete(k),
		clear: () => store.clear(),
		key: (i) => Array.from(store.keys())[i] || null,
		get length() { return store.size; }
	};
}

if (typeof global.window === 'undefined') {
	global.window = {
		addEventListener: () => {},
		removeEventListener: () => {},
		location: { pathname: '/', href: '' }
	};
}

if (typeof global.document === 'undefined') {
	global.document = {
		addEventListener: () => {},
		removeEventListener: () => {},
		referrer: '',
		hidden: false
	};
}

if (typeof global.navigator === 'undefined') {
	global.navigator = { userAgent: 'jest-node', language: 'es-ES', onLine: true };
} else {
	if (typeof global.navigator.onLine === 'undefined') {
		Object.defineProperty(global.navigator, 'onLine', { value: true, configurable: true });
	}
	if (typeof global.navigator.userAgent === 'undefined') {
		Object.defineProperty(global.navigator, 'userAgent', { value: 'jest-node', configurable: true });
	}
}

if (typeof global.performance === 'undefined') {
	global.performance = { now: () => 0 };
}
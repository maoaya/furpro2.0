// Configuración global para Jest en modo watch y mocks automáticos

// Variables de entorno para Jest
process.env.VITE_SUPABASE_URL = 'https://qqrxetxcglwrejtblwut.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MzQwMTQsImV4cCI6MjA0MTQxMDAxNH0.WaJRwm3fGSoOZzYpU5xhMc82rP6FqJKM52kQGYlXJz8';
process.env.VITE_GOOGLE_CLIENT_ID = '760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com';
process.env.VITE_FACEBOOK_CLIENT_ID = '';

// Mock automático para archivos pesados o externos
jest.mock('axios', () => ({
  create: () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() })
}));

// Mock global para Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: { 
      signIn: jest.fn(), 
      signUp: jest.fn(), 
      signOut: jest.fn(), 
      user: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ 
        data: { subscription: { unsubscribe: jest.fn() } } 
      })),
      signInWithOAuth: jest.fn(),
      signInWithPassword: jest.fn()
    },
    from: jest.fn(() => ({ 
      select: jest.fn(() => ({ eq: jest.fn(), single: jest.fn() })), 
      insert: jest.fn(), 
      update: jest.fn(), 
      delete: jest.fn() 
    }))
  })
}));

// Mock global para Firebase
// jest.mock('firebase/app', () => ({
//   initializeApp: jest.fn()
// }));
// jest.mock('firebase/auth', () => ({
//   getAuth: jest.fn(() => ({ signInWithEmailAndPassword: jest.fn(), createUserWithEmailAndPassword: jest.fn(), signOut: jest.fn() }))
// }));
// jest.mock('firebase/firestore', () => ({
//   getFirestore: jest.fn(),
//   collection: jest.fn(),
//   getDocs: jest.fn(),
//   addDoc: jest.fn(),
//   doc: jest.fn(),
//   setDoc: jest.fn(),
//   updateDoc: jest.fn(),
//   deleteDoc: jest.fn()
// }));

// Mock global para Twilio
// jest.mock('twilio', () => () => ({
//   messages: { create: jest.fn() },
//   calls: { create: jest.fn() }
// }));

// Mock global para Stripe
// Mock global para Stripe (solo si el módulo existe)
try {
  jest.mock('stripe', () => function() {
    return {
      charges: { create: jest.fn(), retrieve: jest.fn() },
      customers: { create: jest.fn(), retrieve: jest.fn() },
      paymentIntents: { create: jest.fn(), confirm: jest.fn() }
    };
  });
} catch (e) {
  // Si stripe no está instalado, ignorar
}

// Mock global para AWS SDK (ejemplo S3, solo si el módulo existe)
try {
  jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => ({
      upload: jest.fn(() => ({ promise: jest.fn() })),
      getObject: jest.fn(() => ({ promise: jest.fn() })),
      putObject: jest.fn(() => ({ promise: jest.fn() }))
    }))
  }));
} catch (e) {
  // Si aws-sdk no está instalado, ignorar
}

// Puedes agregar aquí más mocks globales si usas Firebase, Supabase, etc.

// Silenciar logs innecesarios en tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  // Silenciar warnings de React Router v7 Future Flags en tests
  const originalWarn = console.warn;
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = (args && args[0]) ? String(args[0]) : '';
    if (
      msg.includes('React Router Future Flag Warning') ||
      msg.includes('v7_starttransition') ||
      msg.includes('v7_relativesplatpath') ||
      msg.includes('Relative route resolution within Splat routes is changing') ||
      msg.includes('will begin wrapping state updates')
    ) {
      return; // swallow
    }
    originalWarn.apply(console, args);
  });
});
// Polyfill global para setImmediate en entorno de test (Jest)
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
// Mock global para import.meta.env en tests frontend
if (!global.import) {
  Object.defineProperty(global, 'import', {
    value: {},
    writable: true
  });
}
Object.defineProperty(global.import, 'meta', {
  value: { env: { VITE_SUPABASE_URL: 'http://localhost:54321', VITE_SUPABASE_KEY: 'test-key' } },
  writable: true
});
// Setup global fetch for Jest (Node.js)

if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Polyfill global setImmediate para entorno Jest (Node.js)
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

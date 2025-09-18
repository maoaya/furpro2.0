import React, { createContext, useContext, useState, useEffect } from 'react';

// Carga perezosa de SDKs para reducir el bundle inicial
let cachedSupabase = null;
async function getSupabase() {
  if (!cachedSupabase) {
    const mod = await import('./config/supabase');
    cachedSupabase = mod.supabase;
  }
  return cachedSupabase;
}

async function getAuthConfig() {
  const mod = await import('./config/supabase');
  return mod.authConfig;
}

let cachedFirebase;
async function getFirebase() {
  if (!cachedFirebase) {
    const mod = await import('./config/firebase');
    const authMod = await import('firebase/auth');
    cachedFirebase = { ...mod, ...authMod };
  }
  return cachedFirebase;
}

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chequeo de sesión en background para no bloquear la primera pintura
  useEffect(() => {
    let mounted = true;
    let unsubscribe;
    // Permitimos render inmediato
    setLoading(false);
    (async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data?.session?.user) setUser(data.session.user);
        const sub = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          setUser(session?.user || null);
        });
        unsubscribe = sub?.data?.unsubscribe || sub?.unsubscribe;
      } catch (_e) {
        // Silenciamos errores de arranque; se reintenta en flujos de login
      }
    })();
    return () => {
      mounted = false;
      try { unsubscribe?.(); } catch {}
    };
  }, []);



  // Login con Google (Firebase)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { auth, googleProvider, signInWithPopup } = await getFirebase();
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (e) {
      // Fallback a Supabase OAuth
      const supabase = await getSupabase();
      const authConfig = await getAuthConfig();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: authConfig.google?.callbackUrl, scopes: authConfig.google?.scopes }
      });
      return { user: null, redirecting: true };
    } finally {
      setLoading(false);
    }
  };

  // Login con Facebook (Firebase)
  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const { auth, facebookProvider, signInWithPopup } = await getFirebase();
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
      return result;
    } catch (e) {
      // Fallback a Supabase OAuth
      const supabase = await getSupabase();
      const authConfig = await getAuthConfig();
      await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: authConfig.facebook?.callbackUrl, scopes: authConfig.facebook?.scopes, queryParams: { display: 'popup' } }
      });
      return { user: null, redirecting: true };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      try {
        const supabase = await getSupabase();
        await supabase.auth.signOut();
      } catch {}
      try {
        const { auth, signOut } = await getFirebase();
        await signOut(auth);
      } catch {}
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithFacebook, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

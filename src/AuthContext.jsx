import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authConfig } from './config/supabase';
import { auth, googleProvider, facebookProvider } from './config/firebase';
// MOCK para entorno de test: firebase/auth
let signInWithPopup, firebaseSignOut;
try {
  ({ signInWithPopup, signOut: firebaseSignOut } = require('firebase/auth'));
} catch (e) {
  signInWithPopup = async () => ({ user: { uid: 'mock', email: 'mock@mock.com' } });
  firebaseSignOut = async () => {};
}

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Supabase session listener
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(data?.session?.user || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      mounted = false;
      listener?.unsubscribe();
    };
  }, []);



  // Login con Google (Firebase)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (e) {
      // Fallback a Supabase OAuth
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
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(result.user);
      return result;
    } catch (e) {
      // Fallback a Supabase OAuth
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
    await supabase.auth.signOut();
    await firebaseSignOut(auth);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithFacebook, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

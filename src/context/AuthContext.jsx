import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [equipoId, setEquipoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Intentar restaurar sesión desde localStorage primero
    let session = null;
    try {
      const stored = localStorage.getItem('session');
      if (stored) session = { user: JSON.parse(stored) };
    } catch {}
    // Si no hay en localStorage, intentar desde Supabase
    if (!session) session = supabase.auth.getSession();
    if (session && session.user) {
      setUser(session.user);
      setRole(session.user.role || 'player');
      supabase
        .from('usuarios')
        .select('equipoId')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (data && data.equipoId) setEquipoId(data.equipoId);
          else setEquipoId(null);
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else {
      setUser(data.user);
      setRole(data.user.role || 'player');
      // Guardar sesión en localStorage
      localStorage.setItem('session', JSON.stringify(data.user));
      // Obtener equipoId tras login
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('equipoId')
        .eq('id', data.user.id)
        .single();
      if (userData && userData.equipoId) setEquipoId(userData.equipoId);
      else setEquipoId(null);
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  setUser(null);
  setRole('guest');
  setEquipoId(null);
  localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider value={{ user, role, equipoId, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
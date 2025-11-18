import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    // Verificar sesión existente
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Cargar categoría del usuario
          const savedCategoria = localStorage.getItem('futpro_categoria');
          if (savedCategoria) {
            setCategoria(savedCategoria);
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Cargar categoría si existe
          const savedCategoria = localStorage.getItem('futpro_categoria');
          if (savedCategoria) {
            setCategoria(savedCategoria);
          }
        } else {
          setUser(null);
          setCategoria(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('futpro_categoria');
      localStorage.removeItem('futpro_user');
      setUser(null);
      setCategoria(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateCategoria = (newCategoria) => {
    setCategoria(newCategoria);
    localStorage.setItem('futpro_categoria', newCategoria);
  };

  const value = {
    user,
    categoria,
    loading,
    signOut,
    updateCategoria,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
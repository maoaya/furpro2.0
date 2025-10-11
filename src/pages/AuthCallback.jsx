/**
 * 🔐 CALLBACK PARA OAUTH (GOOGLE/FACEBOOK)
 * Maneja la redirección después del login social
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userActivityTracker from '../services/UserActivityTracker';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Procesando callback de OAuth...');
        
        // Esperar un momento para que AuthContext se actualice
        setTimeout(() => {
          if (user) {
            console.log('✅ Usuario autenticado:', user.email);
            
            // 🔥 TRACK SUCCESSFUL OAUTH LOGIN
            userActivityTracker.trackLogin('oauth_callback', true, {
              userId: user.id,
              email: user.email,
              provider: 'oauth_redirect'
            });
            
            // Redireccionar a home
            navigate('/home');
          } else {
            console.log('❌ No se encontró usuario después del callback');
            setError('Error en la autenticación');
            
            // 🔥 TRACK FAILED OAUTH CALLBACK
            userActivityTracker.track('oauth_callback_failed', {
              timestamp: new Date().toISOString(),
              error: 'No user found after callback'
            });
            
            // Redireccionar a login después de un error
            setTimeout(() => navigate('/login'), 3000);
          }
          setLoading(false);
        }, 2000);
        
      } catch (error) {
        console.error('Error en callback:', error);
        setError('Error procesando autenticación');
        
        // 🔥 TRACK OAUTH CALLBACK EXCEPTION
        userActivityTracker.track('oauth_callback_exception', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h2 className="text-2xl font-bold text-white mb-2">Completando ingreso...</h2>
          <p className="text-gray-400">Procesando autenticación</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error de Autenticación</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirigiendo a inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
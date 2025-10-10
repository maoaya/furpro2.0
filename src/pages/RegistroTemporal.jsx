import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RegistroTemporal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">⚽ FutPro</h1>
          <div className="space-y-4">
            <p className="text-white">
              🚧 Estamos mejorando el sistema de registro
            </p>
            
            <button
              onClick={() => navigate('/registro-nuevo')}
              className="w-full bg-yellow-400 text-black px-6 py-3 rounded-md hover:bg-yellow-500 transition-colors font-semibold"
            >
              🚀 Nuevo Registro Completo
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition-colors"
            >
              ← Volver al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroTemporal;
// Hook para manejar puntos de cards
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useCardPoints = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Agregar puntos a un jugador
   * @param {string} userId - ID del usuario
   * @param {string} tipo - Tipo de actividad: 'partido_ganado', 'entrenamiento', 'amistoso', 'buen_comportamiento'
   * @param {number} cantidad - Cantidad de veces (default: 1)
   * @returns {Promise<Object>} Resultado con puntos y tier
   */
  const agregarPuntos = async (userId, tipo, cantidad = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('agregar_puntos_jugador', {
        p_user_id: userId,
        p_tipo: tipo,
        p_cantidad: cantidad
      });

      if (rpcError) throw rpcError;

      return data;
    } catch (err) {
      console.error('Error agregando puntos:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener card del jugador con puntos y tier
   */
  const obtenerCard = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('carfutpro')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (queryError) throw queryError;

      return data;
    } catch (err) {
      console.error('Error obteniendo card:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener configuración de tiers con umbrales
   */
  const getTierConfig = () => ({
    futpro: { min: 0, max: 99, color: '#FFD700', label: 'Futpro' },
    bronce: { min: 100, max: 249, color: '#CD7F32', label: 'Bronce' },
    plata: { min: 250, max: 499, color: '#C0C0C0', label: 'Plata' },
    oro: { min: 500, max: 749, color: '#FFD700', label: 'Oro' },
    diamante: { min: 750, max: 999, color: '#B9F2FF', label: 'Diamante' },
    leyenda: { min: 1000, max: Infinity, color: '#FF1493', label: 'Leyenda' }
  });

  /**
   * Calcular progreso hacia siguiente tier
   */
  const calcularProgreso = (puntos) => {
    const tiers = getTierConfig();
    let tierActual = 'futpro';
    let tierSiguiente = 'bronce';
    let puntosParaSiguiente = 100;
    let porcentaje = 0;

    if (puntos >= 1000) {
      tierActual = 'leyenda';
      tierSiguiente = null;
      puntosParaSiguiente = 0;
      porcentaje = 100;
    } else if (puntos >= 750) {
      tierActual = 'diamante';
      tierSiguiente = 'leyenda';
      puntosParaSiguiente = 1000 - puntos;
      porcentaje = ((puntos - 750) / 250) * 100;
    } else if (puntos >= 500) {
      tierActual = 'oro';
      tierSiguiente = 'diamante';
      puntosParaSiguiente = 750 - puntos;
      porcentaje = ((puntos - 500) / 250) * 100;
    } else if (puntos >= 250) {
      tierActual = 'plata';
      tierSiguiente = 'oro';
      puntosParaSiguiente = 500 - puntos;
      porcentaje = ((puntos - 250) / 250) * 100;
    } else if (puntos >= 100) {
      tierActual = 'bronce';
      tierSiguiente = 'plata';
      puntosParaSiguiente = 250 - puntos;
      porcentaje = ((puntos - 100) / 150) * 100;
    } else if (puntos >= 0) {
      tierActual = 'futpro';
      tierSiguiente = 'bronce';
      puntosParaSiguiente = 100 - puntos;
      porcentaje = (puntos / 100) * 100;
    } else {
      tierActual = 'plata';
      tierSiguiente = 'oro';
      puntosParaSiguiente = 250 - puntos;
      porcentaje = 0;
    }

    return {
      tierActual,
      tierSiguiente,
      puntosParaSiguiente,
      porcentaje: Math.round(porcentaje),
      config: tiers[tierActual]
    };
  };

  return {
    agregarPuntos,
    obtenerCard,
    getTierConfig,
    calcularProgreso,
    loading,
    error
  };
};

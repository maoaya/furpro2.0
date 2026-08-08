/**
 * 🔥 DASHBOARD DE TRACKING PARA ADMINISTRADORES
 * Visualiza todas las actividades de usuarios en tiempo real
 */

import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useActivityTracker } from '../hooks/useActivityTracker';

const AdminDashboard = () => {
  const { user, role } = useAuth();
  const tracker = useActivityTracker();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    if (role !== 'admin') {
      return;
    }
    
    loadActivities();
    loadStats();
    
    // Auto-refresh cada 10 segundos
    const interval = setInterval(() => {
      loadActivities();
      loadStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [role, filter, timeRange]);

  const loadActivities = async () => {
    try {
      let query = supabase
        .from('user_activities')
        .select(`
          *,
          usuarios(nombre, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (filter !== 'all') {
        query = query.eq('action_type', filter);
      }

      // Aplicar rango de tiempo
      const now = new Date();
      let startDate;
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setActivities(data || []);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Obtener estadísticas usando la función SQL
      const { data, error } = await supabase.rpc('get_user_activity_stats');
      
      if (error) throw error;
      
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType) => {
    const icons = {
      'auth_login': '🔐',
      'auth_logout': '🚪',
      'form_input': '📝',
      'form_submission': '✅',
      'photo_upload': '📷',
      'page_view': '👁️',
      'button_click': '🖱️',
      'scroll_depth': '📜',
      'social_login_attempt': '🌐',
      'profile_action': '👤',
      'game_action': '⚽',
      'social_interaction': '🤝'
    };
    return icons[actionType] || '📊';
  };

  const getActionColor = (actionType) => {
    const colors = {
      'auth_login': 'text-green-400',
      'auth_logout': 'text-red-400',
      'form_input': 'text-blue-400',
      'form_submission': 'text-purple-400',
      'photo_upload': 'text-yellow-400',
      'error': 'text-red-500',
      'social_login_attempt': 'text-cyan-400'
    };
    return colors[actionType] || 'text-gray-400';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Acceso denegado. Solo administradores.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔥 Dashboard de Actividades</h1>
          <p className="text-gray-400">Tracking en tiempo real como redes sociales</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📊 Total Acciones</h3>
              <p className="text-3xl font-bold text-blue-400">{stats.total_actions}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📅 Hoy</h3>
              <p className="text-3xl font-bold text-green-400">{stats.today_actions}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">📈 Esta Semana</h3>
              <p className="text-3xl font-bold text-yellow-400">{stats.this_week_actions}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🎯 Engagement</h3>
              <p className="text-3xl font-bold text-purple-400">
                {Math.round((stats.today_actions / Math.max(stats.total_actions, 1)) * 100)}%
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Acción</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="all">Todas</option>
                <option value="auth_login">Logins</option>
                <option value="form_submission">Envíos de Formulario</option>
                <option value="photo_upload">Subida de Fotos</option>
                <option value="page_view">Vistas de Página</option>
                <option value="button_click">Clicks de Botón</option>
                <option value="social_login_attempt">Intentos Social</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rango de Tiempo</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="all">Todo el Tiempo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-gray-800 rounded-lg">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">📱 Actividades Recientes</h2>
            <p className="text-gray-400 text-sm">Actualización automática cada 10 segundos</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p>Cargando actividades...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No hay actividades para mostrar
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-4 border-b border-gray-700 hover:bg-gray-750">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getActionIcon(activity.action_type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getActionColor(activity.action_type)}`}>
                          {activity.action_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {formatTimeAgo(activity.created_at)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-300 mt-1">
                        {activity.usuarios ? (
                          <span>👤 {activity.usuarios.nombre} ({activity.usuarios.email})</span>
                        ) : (
                          <span>👤 Usuario anónimo</span>
                        )}
                      </div>
                      
                      {activity.action_data && Object.keys(activity.action_data).length > 0 && (
                        <div className="mt-2 text-xs bg-gray-700 p-2 rounded">
                          <details>
                            <summary className="cursor-pointer text-gray-400">
                              Ver detalles...
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-gray-300">
                              {JSON.stringify(activity.action_data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-900 text-green-200 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">En vivo - Tracking activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
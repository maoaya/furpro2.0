import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import { supabase } from '../config/supabaseClient';
import TournamentService from '../services/TournamentService';
import MainLayout from '../components/MainLayout';

export default function NotificacionesTorneoPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, invitation, match, result, suspension, update

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      let query = supabase
        .from('tournament_notifications')
        .select(`
          *,
          tournament:tournaments(name, category)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tournament_notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await TournamentService.markNotificationAsRead(notificationId);

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read_at)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('tournament_notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          read_at: notif.read_at || new Date().toISOString()
        }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('tournament_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'invitation':
        return '📩';
      case 'registration_confirmed':
        return '✅';
      case 'match_scheduled':
        return '📅';
      case 'referee_assigned':
        return '👨‍⚖️';
      case 'result_updated':
        return '📊';
      case 'suspension':
        return '⚠️';
      case 'general_update':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type, isRead) => {
    const baseColor = isRead ? 'bg-white' : 'bg-blue-50';
    
    switch (type) {
      case 'invitation':
        return `${baseColor} border-l-4 border-blue-500`;
      case 'registration_confirmed':
        return `${baseColor} border-l-4 border-green-500`;
      case 'match_scheduled':
        return `${baseColor} border-l-4 border-purple-500`;
      case 'referee_assigned':
        return `${baseColor} border-l-4 border-orange-500`;
      case 'result_updated':
        return `${baseColor} border-l-4 border-indigo-500`;
      case 'suspension':
        return `${baseColor} border-l-4 border-red-500`;
      case 'general_update':
        return `${baseColor} border-l-4 border-gray-500`;
      default:
        return `${baseColor} border-l-4 border-gray-400`;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      invitation: 'Invitación',
      registration_confirmed: 'Inscripción Confirmada',
      match_scheduled: 'Partido Programado',
      referee_assigned: 'Árbitro Asignado',
      result_updated: 'Resultado Actualizado',
      suspension: 'Sanción',
      general_update: 'Actualización General'
    };
    return labels[type] || type;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read_at) return false;
    if (filter === 'read' && !notif.read_at) return false;
    if (selectedCategory !== 'all' && notif.notification_type !== selectedCategory) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (loading) {
    return <MainLayout><div className="p-4 text-center">Cargando notificaciones...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notificaciones de Torneos</h1>
            {unreadCount > 0 && (
              <p className="text-red-600 font-semibold mt-1">
                🔴 {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Marcar todo como leído
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Filtro de Estado */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Sin leer
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'read'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Leídas
            </button>
          </div>

          {/* Filtro de Categoría */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'invitation', 'registration_confirmed', 'match_scheduled', 'result_updated', 'suspension'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : getTypeLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                {notifications.length === 0
                  ? 'No tienes notificaciones'
                  : 'No hay notificaciones que coincidan con los filtros'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`${getNotificationColor(notif.notification_type, notif.read_at)} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start gap-4">
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getNotificationIcon(notif.notification_type)}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500">
                          {getTypeLabel(notif.notification_type)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{notif.message}</p>
                    {notif.tournament && (
                      <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                        🏆 {notif.tournament.name}
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    {!notif.read_at ? (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 whitespace-nowrap"
                      >
                        Marcar como leído
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 text-center px-3 py-1">
                        ✓ Leído
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  {new Date(notif.created_at).toLocaleString('es-ES')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estadísticas */}
        {notifications.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sin leer</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Leídas</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.read_at).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => {
                  const today = new Date();
                  const notifDate = new Date(n.created_at);
                  return notifDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

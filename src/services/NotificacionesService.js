import { supabase } from '../config/supabase';
import {
  disableOnSchemaError,
  isTableDisabled,
  withTableProbe,
} from '../utils/schemaCompatibilityGate.js';

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type || 'SYSTEM',
    title: row.title || row.titulo || 'Notificación',
    body: row.body || row.mensaje || row.content || '',
    icon: row.icon || '🔔',
    created_at: row.created_at,
    read: Boolean(row.read || row.leido || row.read_at),
    data: row.data || {},
    ...row,
  };
}

export class NotificacionesService {
  /** Carga desde notifications o notificaciones (schema drift). */
  static async getNotificaciones(userId) {
    if (!userId) return [];
    const tables = ['notifications', 'notificaciones'];
    for (const table of tables) {
      if (isTableDisabled(table)) continue;
      const result = await withTableProbe(table, async () => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) disableOnSchemaError(error, { table });
        return { data, error };
      });
      if (result?.skipped || result?.error) continue;
      return (result?.data || []).map(mapRow).filter(Boolean);
    }
    return [];
  }
}

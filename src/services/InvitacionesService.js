// Servicio para gestionar invitaciones a equipos
import { supabase } from '../config/supabase';

export class InvitacionesService {
  /**
   * Obtener invitaciones pendientes del usuario
   */
  static async getMisInvitaciones(userId) {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          id,
          team_id,
          team:teams(id, name, logo_url, captain_id),
          inviter:inviter_id(email),
          championship_type,
          category,
          max_age,
          status,
          created_at,
          responded_at
        `)
        .eq('invited_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error obteniendo invitaciones:', err);
      return [];
    }
  }

  /**
   * Aceptar invitación y agregar a plantilla
   */
  static async aceptarInvitacion(invitacionId, userId) {
    try {
      // 1. Obtener detalles de la invitación
      const { data: invData } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitacionId)
        .single();

      if (!invData) throw new Error('Invitación no encontrada');

      // 2. Actualizar estado de invitación
      const { error: updateErr } = await supabase
        .from('team_invitations')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', invitacionId);

      if (updateErr) throw updateErr;

      // 3. Agregar jugador a la plantilla
      const { error: rosterErr } = await supabase
        .from('team_rosters')
        .insert([{
          team_id: invData.team_id,
          championship_type: invData.championship_type,
          user_id: userId,
          status: 'active',
          joined_at: new Date().toISOString()
        }]);

      if (rosterErr && rosterErr.code !== '23505') { // 23505 = unique violation (ya existe)
        throw rosterErr;
      }

      return { success: true };
    } catch (err) {
      console.error('Error aceptando invitación:', err);
      throw err;
    }
  }

  /**
   * Rechazar invitación
   */
  static async rechazarInvitacion(invitacionId) {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'rejected', responded_at: new Date().toISOString() })
        .eq('id', invitacionId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error rechazando invitación:', err);
      throw err;
    }
  }

  /**
   * Cancelar invitación (por parte del invitador)
   */
  static async cancelarInvitacion(invitacionId) {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled', responded_at: new Date().toISOString() })
        .eq('id', invitacionId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error cancelando invitación:', err);
      throw err;
    }
  }

  /**
   * Obtener invitaciones enviadas por un equipo
   */
  static async getInvitacionesDelEquipo(teamId) {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          id,
          invited_user:invited_user_id(email),
          carfutpro!inner(nombre, apellido, avatar_url, photo_url),
          championship_type,
          category,
          status,
          created_at
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error obteniendo invitaciones del equipo:', err);
      return [];
    }
  }

  /**
   * Remover jugador de la plantilla
   */
  static async removerDeEquipo(teamId, userId, championshipType) {
    try {
      const { error } = await supabase
        .from('team_rosters')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .eq('championship_type', championshipType);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error removiendo del equipo:', err);
      throw err;
    }
  }
}

export default InvitacionesService;

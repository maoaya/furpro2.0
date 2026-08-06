/**
 * FP-MEM-001 — helpers para liberar channels Realtime de Supabase.
 * Preferir removeChannel (libera el socket/topic); fallback a unsubscribe.
 */

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {import('@supabase/supabase-js').RealtimeChannel | null | undefined} channel
 */
export function removeRealtimeChannel(client, channel) {
  if (!channel) return;
  try {
    if (client?.removeChannel) {
      client.removeChannel(channel);
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    channel.unsubscribe?.();
  } catch {
    /* noop */
  }
}

/**
 * Cleanup para varios channels a la vez (usar como return de useEffect).
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param  {...import('@supabase/supabase-js').RealtimeChannel} channels
 */
export function cleanupRealtimeChannels(client, ...channels) {
  return () => {
    for (const ch of channels) {
      removeRealtimeChannel(client, ch);
    }
  };
}

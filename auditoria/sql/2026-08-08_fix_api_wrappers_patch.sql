-- Patch: finish migration after ERROR 42704 type "public.rpc_ranking_equipos" does not exist
-- Cause: api wrappers used RETURNS SETOF public.<function_name> (no composite type).
-- Run this in SQL Editor (no need to re-run the full migration if earlier steps already applied).

BEGIN;

CREATE SCHEMA IF NOT EXISTS api;

-- Ensure public RPCs exist (safe recreate)
DROP FUNCTION IF EXISTS public.rpc_ranking_equipos();
DROP FUNCTION IF EXISTS public.rpc_ranking_equipos(text);
DROP FUNCTION IF EXISTS public.rpc_ranking_equipos(text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION public.rpc_ranking_equipos(
  p_deporte text DEFAULT NULL,
  p_ciudad text DEFAULT NULL,
  p_pais text DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  equipo_id uuid,
  id uuid,
  nombre text,
  puntos_card numeric,
  puntos_equipo numeric,
  puntos numeric,
  nivel_card integer,
  nivel_equipo integer,
  ranking_position integer,
  posicion integer,
  deporte text,
  ciudad text,
  pais text,
  logo text,
  foto_escudo text,
  escudo text,
  overall numeric,
  victorias integer,
  partidos_jugados integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ranked AS (
    SELECT
      e.id AS equipo_id,
      e.id,
      e.nombre::text AS nombre,
      COALESCE(ec.puntos_card, 0)::numeric AS puntos_card,
      COALESCE(ec.puntos_card, 0)::numeric AS puntos_equipo,
      COALESCE(ec.puntos_card, 0)::numeric AS puntos,
      COALESCE(ec.nivel_card, 1)::integer AS nivel_card,
      COALESCE(ec.nivel_card, 1)::integer AS nivel_equipo,
      COALESCE(
        ec.ranking_position,
        ROW_NUMBER() OVER (ORDER BY COALESCE(ec.puntos_card, 0) DESC, e.nombre ASC)
      )::integer AS ranking_position,
      e.deporte::text AS deporte,
      e.ciudad::text AS ciudad,
      e.pais::text AS pais,
      e.logo::text AS logo,
      e.foto_escudo::text AS foto_escudo,
      e.escudo::text AS escudo,
      COALESCE(ec.overall, 50)::numeric AS overall,
      COALESCE(ec.victorias, 0)::integer AS victorias,
      COALESCE(ec.partidos_jugados, 0)::integer AS partidos_jugados
    FROM public.equipos e
    LEFT JOIN public.equipos_card ec ON ec.equipo_id = e.id
    WHERE (p_deporte IS NULL OR lower(coalesce(e.deporte, '')) = lower(p_deporte)
           OR coalesce(e.deporte_id::text, '') = p_deporte)
      AND (p_ciudad IS NULL OR lower(coalesce(e.ciudad, '')) = lower(p_ciudad))
      AND (p_pais IS NULL OR lower(coalesce(e.pais, '')) = lower(p_pais))
  )
  SELECT
    r.equipo_id, r.id, r.nombre, r.puntos_card, r.puntos_equipo, r.puntos,
    r.nivel_card, r.nivel_equipo, r.ranking_position, r.ranking_position AS posicion,
    r.deporte, r.ciudad, r.pais, r.logo, r.foto_escudo, r.escudo,
    r.overall, r.victorias, r.partidos_jugados
  FROM ranked r
  ORDER BY r.puntos_card DESC, r.nombre ASC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 500))
  OFFSET GREATEST(0, COALESCE(p_offset, 0));
$$;

GRANT EXECUTE ON FUNCTION public.rpc_ranking_equipos(text, text, text, integer, integer) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios();
DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios(integer);
DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios(integer, uuid);

CREATE OR REPLACE FUNCTION public.obtener_sugerencias_usuarios(
  p_limite integer DEFAULT 24,
  p_usuario uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  usuario_id uuid,
  auth_user_id uuid,
  nombre text,
  apellido text,
  foto_perfil text,
  ciudad text,
  pais text,
  display_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT COALESCE(p_usuario, auth.uid()) AS uid
  ),
  excluded AS (
    SELECT u.id
    FROM public.usuarios u, me
    WHERE me.uid IS NOT NULL
      AND (u.id = me.uid OR u.auth_user_id = me.uid)
    UNION
    SELECT am.amigo_id
    FROM public.amistades am, me
    WHERE me.uid IS NOT NULL AND am.usuario_id = me.uid
    UNION
    SELECT am.usuario_id
    FROM public.amistades am, me
    WHERE me.uid IS NOT NULL AND am.amigo_id = me.uid
    UNION
    SELECT f.followed_id
    FROM public.follows f, me
    WHERE me.uid IS NOT NULL AND f.follower_id = me.uid
  )
  SELECT
    u.id,
    u.id AS usuario_id,
    u.auth_user_id,
    u.nombre::text,
    u.apellido::text,
    u.foto_perfil::text,
    u.ciudad::text,
    u.pais::text,
    trim(both FROM concat_ws(' ', u.nombre, u.apellido))::text AS display_name
  FROM public.usuarios u
  WHERE NOT EXISTS (
    SELECT 1 FROM excluded x WHERE x.id = u.id
  )
  ORDER BY u.nombre NULLS LAST
  LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 24), 100));
$$;

GRANT EXECUTE ON FUNCTION public.obtener_sugerencias_usuarios(integer, uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.fp_obtener_bandeja_chat(
  p_usuario_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := COALESCE(p_usuario_id, auth.uid());
  v_personal jsonb := '[]'::jsonb;
  v_marketplace jsonb := '[]'::jsonb;
  v_team jsonb := '[]'::jsonb;
  v_tournament jsonb := '[]'::jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object(
      'personal', '[]'::jsonb,
      'marketplace', '[]'::jsonb,
      'team', '[]'::jsonb,
      'tournament', '[]'::jsonb,
      'owner_id', null,
      'loadedAt', now()
    );
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(x)::jsonb ORDER BY x.last_message_at DESC NULLS LAST), '[]'::jsonb)
  INTO v_personal
  FROM (
    SELECT
      COALESCE(s.conversation_id, s.conversacion_id) AS id,
      COALESCE(s.conversation_id, s.conversacion_id) AS conversation_id,
      COALESCE(s.conversation_id, s.conversacion_id) AS conversacion_id,
      'direct'::text AS conversation_type,
      COALESCE(s.peer_user_id, s.peer_id) AS peer_user_id,
      COALESCE(s.peer_user_id, s.peer_id) AS other_user_id,
      COALESCE(s.title, u.nombre, 'Chat') AS title,
      COALESCE(s.title, trim(both FROM concat_ws(' ', u.nombre, u.apellido))) AS other_user_name,
      COALESCE(s.avatar_url, u.foto_perfil) AS avatar_url,
      COALESCE(s.avatar_url, u.foto_perfil) AS other_user_avatar,
      COALESCE(s.last_message_text, s.last_message, '') AS last_message,
      COALESCE(s.last_message_text, s.last_message, '') AS last_message_text,
      s.last_message_at,
      COALESCE(s.unread_count, 0) AS unread_count,
      COALESCE(s.owner_id, s.usuario_id) AS owner_id
    FROM public.futpro_chat_sessions s
    LEFT JOIN public.usuarios u ON u.id = COALESCE(s.peer_user_id, s.peer_id)
    WHERE s.deleted_at IS NULL
      AND COALESCE(s.owner_id, s.usuario_id) = v_uid
      AND lower(coalesce(s.conversation_type, s.tipo, 'direct')) IN ('direct', 'directo', 'personal', '')
    ORDER BY s.last_message_at DESC NULLS LAST
    LIMIT 120
  ) x;

  SELECT COALESCE(jsonb_agg(row_to_json(x)::jsonb ORDER BY x.last_message_at DESC NULLS LAST), '[]'::jsonb)
  INTO v_marketplace
  FROM (
    SELECT
      COALESCE(s.conversation_id, s.conversacion_id) AS id,
      COALESCE(s.conversation_id, s.conversacion_id) AS conversation_id,
      'marketplace'::text AS conversation_type,
      COALESCE(s.peer_user_id, s.peer_id) AS peer_user_id,
      COALESCE(s.peer_user_id, s.peer_id) AS other_user_id,
      COALESCE(s.title, 'Marketplace') AS title,
      COALESCE(s.title, 'Marketplace') AS other_user_name,
      s.avatar_url,
      s.avatar_url AS other_user_avatar,
      COALESCE(s.last_message_text, s.last_message, '') AS last_message,
      s.last_message_at,
      COALESCE(s.unread_count, 0) AS unread_count,
      s.product_id,
      s.product_id AS producto_id,
      COALESCE(s.owner_id, s.usuario_id) AS owner_id
    FROM public.futpro_chat_sessions s
    WHERE s.deleted_at IS NULL
      AND COALESCE(s.owner_id, s.usuario_id) = v_uid
      AND lower(coalesce(s.conversation_type, s.tipo, '')) IN ('marketplace', 'market')
    ORDER BY s.last_message_at DESC NULLS LAST
    LIMIT 120
  ) x;

  SELECT COALESCE(jsonb_agg(row_to_json(x)::jsonb), '[]'::jsonb)
  INTO v_team
  FROM (
    SELECT
      COALESCE(s.conversation_id, s.conversacion_id) AS id,
      COALESCE(s.conversation_id, s.conversacion_id) AS team_id,
      COALESCE(s.title, 'Equipo') AS nombre,
      COALESCE(s.title, 'Equipo') AS title,
      s.avatar_url,
      COALESCE(s.last_message_text, s.last_message, '') AS "lastMessage",
      s.last_message_at AS "lastMessageAt",
      COALESCE(s.unread_count, 0) AS "unreadCount"
    FROM public.futpro_chat_sessions s
    WHERE s.deleted_at IS NULL
      AND COALESCE(s.owner_id, s.usuario_id) = v_uid
      AND lower(coalesce(s.conversation_type, s.tipo, '')) IN ('team', 'equipo')
    LIMIT 80
  ) x;

  SELECT COALESCE(jsonb_agg(row_to_json(x)::jsonb), '[]'::jsonb)
  INTO v_tournament
  FROM (
    SELECT
      COALESCE(s.conversation_id, s.conversacion_id) AS id,
      COALESCE(s.conversation_id, s.conversacion_id) AS tournament_id,
      COALESCE(s.title, 'Torneo') AS nombre,
      COALESCE(s.title, 'Torneo') AS title,
      s.avatar_url,
      COALESCE(s.last_message_text, s.last_message, '') AS "lastMessage",
      s.last_message_at AS "lastMessageAt",
      COALESCE(s.unread_count, 0) AS "unreadCount"
    FROM public.futpro_chat_sessions s
    WHERE s.deleted_at IS NULL
      AND COALESCE(s.owner_id, s.usuario_id) = v_uid
      AND lower(coalesce(s.conversation_type, s.tipo, '')) IN ('tournament', 'torneo')
    LIMIT 80
  ) x;

  RETURN jsonb_build_object(
    'personal', COALESCE(v_personal, '[]'::jsonb),
    'marketplace', COALESCE(v_marketplace, '[]'::jsonb),
    'team', COALESCE(v_team, '[]'::jsonb),
    'tournament', COALESCE(v_tournament, '[]'::jsonb),
    'owner_id', v_uid,
    'loadedAt', now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.fp_obtener_bandeja_chat(uuid) TO anon, authenticated, service_role;

-- api wrappers with explicit RETURNS TABLE (no SETOF function-name)
DROP FUNCTION IF EXISTS api.rpc_ranking_equipos(text, text, text, integer, integer);
DROP FUNCTION IF EXISTS api.obtener_sugerencias_usuarios(integer, uuid);
DROP FUNCTION IF EXISTS api.fp_obtener_bandeja_chat(uuid);

CREATE OR REPLACE FUNCTION api.fp_obtener_bandeja_chat(p_usuario_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.fp_obtener_bandeja_chat(p_usuario_id);
$$;

CREATE OR REPLACE FUNCTION api.rpc_ranking_equipos(
  p_deporte text DEFAULT NULL,
  p_ciudad text DEFAULT NULL,
  p_pais text DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  equipo_id uuid,
  id uuid,
  nombre text,
  puntos_card numeric,
  puntos_equipo numeric,
  puntos numeric,
  nivel_card integer,
  nivel_equipo integer,
  ranking_position integer,
  posicion integer,
  deporte text,
  ciudad text,
  pais text,
  logo text,
  foto_escudo text,
  escudo text,
  overall numeric,
  victorias integer,
  partidos_jugados integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.rpc_ranking_equipos(p_deporte, p_ciudad, p_pais, p_limit, p_offset);
$$;

CREATE OR REPLACE FUNCTION api.obtener_sugerencias_usuarios(
  p_limite integer DEFAULT 24,
  p_usuario uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  usuario_id uuid,
  auth_user_id uuid,
  nombre text,
  apellido text,
  foto_perfil text,
  ciudad text,
  pais text,
  display_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.obtener_sugerencias_usuarios(p_limite, p_usuario);
$$;

GRANT EXECUTE ON FUNCTION api.fp_obtener_bandeja_chat(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION api.rpc_ranking_equipos(text, text, text, integer, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION api.obtener_sugerencias_usuarios(integer, uuid) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;

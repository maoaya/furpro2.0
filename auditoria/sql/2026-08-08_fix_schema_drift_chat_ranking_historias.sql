-- Zona Pro / FutPro — fix schema drift causing console 400/404
-- Project: qqrxetxcglwrejtblwut
-- Date: 2026-08-08
--
-- Root causes verified against live REST API:
-- 1) rpc_ranking_equipos → 400: column e.deporte_nombre does not exist (equipos.deporte exists)
-- 2) obtener_sugerencias_usuarios(p_limite,p_usuario) → 400: column am.id does not exist (amistades has no id)
-- 3) fp_obtener_bandeja_chat → 404: function missing
-- 4) mensajes select destinatario → 400: column missing
-- 5) futpro_chat_sessions English columns → 400: legacy Spanish column names only
-- 6) historias?expires_at= → 400: column missing (fecha_vencimiento / expira_en exist)
--
-- Run in Supabase Dashboard → SQL Editor (service role / postgres).
-- Idempotent: safe to re-run.

BEGIN;

-- ---------------------------------------------------------------------------
-- 0) Helpers
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS api;

-- ---------------------------------------------------------------------------
-- 1) historias: alias expires_at
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.historias
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

UPDATE public.historias
SET expires_at = COALESCE(expires_at, fecha_vencimiento, expira_en, creado_en + interval '24 hours')
WHERE expires_at IS NULL
  AND COALESCE(fecha_vencimiento, expira_en, creado_en) IS NOT NULL;

-- Keep expires_at roughly in sync for new rows that only set legacy cols.
CREATE OR REPLACE FUNCTION public.historias_sync_expires_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.expires_at := COALESCE(NEW.expires_at, NEW.fecha_vencimiento, NEW.expira_en, NOW() + interval '24 hours');
  NEW.fecha_vencimiento := COALESCE(NEW.fecha_vencimiento, NEW.expires_at);
  NEW.expira_en := COALESCE(NEW.expira_en, NEW.expires_at);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_historias_sync_expires_at ON public.historias;
CREATE TRIGGER trg_historias_sync_expires_at
BEFORE INSERT OR UPDATE ON public.historias
FOR EACH ROW EXECUTE PROCEDURE public.historias_sync_expires_at();

-- ---------------------------------------------------------------------------
-- 2) mensajes: add destinatario expected by inbox fast-path
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.mensajes
  ADD COLUMN IF NOT EXISTS destinatario uuid;

CREATE INDEX IF NOT EXISTS idx_mensajes_destinatario
  ON public.mensajes (destinatario)
  WHERE destinatario IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3) futpro_chat_sessions: English aliases expected by product bundle
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.futpro_chat_sessions
  ADD COLUMN IF NOT EXISTS conversation_id uuid,
  ADD COLUMN IF NOT EXISTS conversation_type text,
  ADD COLUMN IF NOT EXISTS peer_user_id uuid,
  ADD COLUMN IF NOT EXISTS product_id uuid,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS last_message_text text,
  ADD COLUMN IF NOT EXISTS owner_id uuid,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

UPDATE public.futpro_chat_sessions s
SET
  conversation_id = COALESCE(s.conversation_id, s.conversacion_id),
  peer_user_id = COALESCE(s.peer_user_id, s.peer_id),
  last_message_text = COALESCE(s.last_message_text, s.last_message),
  owner_id = COALESCE(s.owner_id, s.usuario_id),
  conversation_type = COALESCE(
    s.conversation_type,
    CASE lower(coalesce(s.tipo, ''))
      WHEN 'direct' THEN 'direct'
      WHEN 'directo' THEN 'direct'
      WHEN 'personal' THEN 'direct'
      WHEN 'marketplace' THEN 'marketplace'
      WHEN 'market' THEN 'marketplace'
      WHEN 'equipo' THEN 'team'
      WHEN 'team' THEN 'team'
      WHEN 'torneo' THEN 'tournament'
      WHEN 'tournament' THEN 'tournament'
      ELSE NULLIF(lower(coalesce(s.tipo, '')), '')
    END
  ),
  created_at = COALESCE(s.created_at, s.updated_at, now())
WHERE s.conversation_id IS NULL
   OR s.peer_user_id IS NULL
   OR s.owner_id IS NULL
   OR s.conversation_type IS NULL
   OR s.last_message_text IS NULL
   OR s.created_at IS NULL;

CREATE OR REPLACE FUNCTION public.futpro_chat_sessions_sync_aliases()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.conversation_id := COALESCE(NEW.conversation_id, NEW.conversacion_id);
  NEW.conversacion_id := COALESCE(NEW.conversacion_id, NEW.conversation_id);
  NEW.peer_user_id := COALESCE(NEW.peer_user_id, NEW.peer_id);
  NEW.peer_id := COALESCE(NEW.peer_id, NEW.peer_user_id);
  NEW.owner_id := COALESCE(NEW.owner_id, NEW.usuario_id);
  NEW.usuario_id := COALESCE(NEW.usuario_id, NEW.owner_id);
  NEW.last_message_text := COALESCE(NEW.last_message_text, NEW.last_message);
  NEW.last_message := COALESCE(NEW.last_message, NEW.last_message_text);
  IF NEW.conversation_type IS NULL AND NEW.tipo IS NOT NULL THEN
    NEW.conversation_type := CASE lower(NEW.tipo)
      WHEN 'directo' THEN 'direct'
      WHEN 'personal' THEN 'direct'
      WHEN 'market' THEN 'marketplace'
      WHEN 'equipo' THEN 'team'
      WHEN 'torneo' THEN 'tournament'
      ELSE lower(NEW.tipo)
    END;
  END IF;
  IF NEW.tipo IS NULL AND NEW.conversation_type IS NOT NULL THEN
    NEW.tipo := NEW.conversation_type;
  END IF;
  NEW.created_at := COALESCE(NEW.created_at, now());
  NEW.updated_at := COALESCE(NEW.updated_at, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_futpro_chat_sessions_sync_aliases ON public.futpro_chat_sessions;
CREATE TRIGGER trg_futpro_chat_sessions_sync_aliases
BEFORE INSERT OR UPDATE ON public.futpro_chat_sessions
FOR EACH ROW EXECUTE PROCEDURE public.futpro_chat_sessions_sync_aliases();

CREATE INDEX IF NOT EXISTS idx_futpro_chat_sessions_owner_id
  ON public.futpro_chat_sessions (owner_id)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- 4) rpc_ranking_equipos — rewrite without equipos.deporte_nombre
-- ---------------------------------------------------------------------------
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
    r.equipo_id,
    r.id,
    r.nombre,
    r.puntos_card,
    r.puntos_equipo,
    r.puntos,
    r.nivel_card,
    r.nivel_equipo,
    r.ranking_position,
    r.ranking_position AS posicion,
    r.deporte,
    r.ciudad,
    r.pais,
    r.logo,
    r.foto_escudo,
    r.escudo,
    r.overall,
    r.victorias,
    r.partidos_jugados
  FROM ranked r
  ORDER BY r.puntos_card DESC, r.nombre ASC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 500))
  OFFSET GREATEST(0, COALESCE(p_offset, 0));
$$;

GRANT EXECUTE ON FUNCTION public.rpc_ranking_equipos(text, text, text, integer, integer) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 5) obtener_sugerencias_usuarios — no amistades.id
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 6) fp_obtener_bandeja_chat — missing RPC (404)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 7) api schema mirrors (publishable key defaults to api for some paths)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  -- Compatible views for REST when Accept-Profile: api
  EXECUTE $v$
    CREATE OR REPLACE VIEW api.mensajes AS
    SELECT * FROM public.mensajes
  $v$;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'api.mensajes view skipped: %', SQLERRM;
END $$;

DO $$
BEGIN
  EXECUTE $v$
    CREATE OR REPLACE VIEW api.futpro_chat_sessions AS
    SELECT * FROM public.futpro_chat_sessions
  $v$;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'api.futpro_chat_sessions view skipped: %', SQLERRM;
END $$;

DO $$
BEGIN
  EXECUTE $v$
    CREATE OR REPLACE VIEW api.historias AS
    SELECT * FROM public.historias
  $v$;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'api.historias view skipped: %', SQLERRM;
END $$;

-- Expose RPCs under api schema as thin wrappers (PostgREST looks at api first for publishable key)
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
RETURNS SETOF public.rpc_ranking_equipos
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
RETURNS SETOF public.obtener_sugerencias_usuarios
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

GRANT SELECT ON ALL TABLES IN SCHEMA api TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;

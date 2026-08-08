-- Patch: re-create obtener_sugerencias_usuarios without public.usuarios.user_id
-- (public.usuarios has id + auth_user_id; api.usuarios has user_id)

DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios();
DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios(integer);
DROP FUNCTION IF EXISTS public.obtener_sugerencias_usuarios(integer, uuid);
DROP FUNCTION IF EXISTS api.obtener_sugerencias_usuarios(integer, uuid);

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

GRANT EXECUTE ON FUNCTION api.obtener_sugerencias_usuarios(integer, uuid) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

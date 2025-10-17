-- MIGRACIÓN: Crear tabla user_activities en esquema api
CREATE SCHEMA IF NOT EXISTS api;

-- Asegurar extensión para UUID aleatorio
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS api.user_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type text NOT NULL,
    action_data jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Permitir inserts desde el API REST
ALTER TABLE api.user_activities ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir inserts a usuarios autenticados
CREATE POLICY api_user_activities_insert ON api.user_activities
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Permitir selects a usuarios autenticados
CREATE POLICY api_user_activities_select ON api.user_activities
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_api_user_activities_user_id ON api.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_api_user_activities_action_type ON api.user_activities(action_type);
CREATE INDEX IF NOT EXISTS idx_api_user_activities_created_at ON api.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_user_activities_user_action ON api.user_activities(user_id, action_type);

-- Permisos requeridos por PostgREST
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT SELECT, INSERT ON api.user_activities TO anon, authenticated;

-- Si tienes datos en public.user_activities, migra así:
-- INSERT INTO api.user_activities (id, user_id, action_type, action_data, created_at)
-- SELECT id, user_id, action_type, action_data, created_at FROM public.user_activities;

-- (Opcional) Revoca acceso a la tabla antigua para evitar duplicados
-- REVOKE ALL ON public.user_activities FROM PUBLIC;

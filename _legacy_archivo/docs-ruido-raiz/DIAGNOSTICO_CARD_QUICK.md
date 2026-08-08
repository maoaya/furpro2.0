# 🎯 TEST RÁPIDO: Verificar RLS Policies en Supabase

## 1. Abre esta URL en el navegador (después de autenticarte):
```
https://futpro.vip/diagnostico-card.html
```

## 2. Pasos:
1. Primero: click en "🔄 Verificar Sesión" - debe mostrar tu usuario
2. Luego: click en "📋 Ver pendingProfileData" - debe mostrar datos del formulario
3. Después: click en "🧪 Probar Inserción" - intenta crear card directamente
4. Si falla con error 406: copiar el error completo y compartir

## 3. Si ves ERROR 406:
Significa que la política RLS está bloqueando el INSERT. Necesitamos ejecutar esto en Supabase:

```sql
-- Verificar políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'carfutpro';

-- Si no hay INSERT policy, crearla:
CREATE POLICY "users_can_insert_own_card"
ON carfutpro FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Si no hay SELECT policy:
CREATE POLICY "users_can_select_own_card"
ON carfutpro FOR SELECT
USING (auth.uid() = user_id);

-- Si no hay UPDATE policy:
CREATE POLICY "users_can_update_own_card"
ON carfutpro FOR UPDATE
USING (auth.uid() = user_id);
```

## 4. Logs importantes:
Abre F12 (Consola) y busca mensajes que empiecen con:
- 📍 Step 1, Step 2, Step 3... (de AuthCallback.jsx)
- ✅ o ❌ (éxito o error)
- 📋 cardData to insert
- Supabase error code y message

## 5. Si el INSERT funciona:
- Card debe aparecer en https://futpro.vip/perfil-card
- Si no: presiona F5 para recargar

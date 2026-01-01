<!-- GUÍA RÁPIDA: ARREGLAR ERRORES EN FUTPRO.VIP -->

# 🔧 GUÍA RÁPIDA: Configurar Supabase para FutPro

**Errores actuales:**
- ❌ `api.usuarios` no existe (404)
- ❌ `api.carfutpro` no existe (404)
- ❌ Bucket `avatars` no existe (400)

**Solución:** Ejecutar 1 script SQL en Supabase

---

## 📋 PASO 1: Ejecutar Script en Supabase

1. Abre: https://app.supabase.com/projects/qqrxetxcglwrejtblwut/sql/new
2. Copia TODO el contenido de: `supabase/sql/MASTER_SETUP_COMPLETO.sql`
3. Pega en el SQL Editor
4. Click **"Run"** (o Ctrl+Enter)
5. Espera a ver: ✅ "SETUP COMPLETADO"

**Qué hace este script:**
- ✅ Crea bucket `avatars` en Storage
- ✅ Crea tabla `public.card_player` con JSONB
- ✅ Crea schema `api` con tabla `api.carfutpro`
- ✅ Crea vista `api.usuarios`
- ✅ Habilita RLS (4 políticas)
- ✅ Crea función `agregar_puntos_jugador()`

**Tiempo:** ~10 segundos

---

## 📋 PASO 2: Exponer Schema en API

1. Ve a Supabase Dashboard: https://app.supabase.com/projects/qqrxetxcglwrejtblwut/settings/api
2. Busca **"Exposed schemas"**
3. Verifica que esté: `api` ✅ (si no está, agrégalo)
4. Guarda cambios
5. **Espera 2 minutos** (importante!)

---

## 📋 PASO 3: Actualizar Navegador

1. Abre https://futpro.vip
2. Presiona **Ctrl+F5** (reload hard cache)
3. Prueba registrarse nuevamente

---

## ✅ Verificar que Funcionó

En la consola del navegador deberías ver (sin 404s):

```
✅ auth.usuarios cargado
✅ card_player creada
✅ Puntos sumados correctamente
```

---

## 📞 Si sigue fallando:

Ejecuta esto en Supabase para verificar:

```sql
-- Ver si todo está creado
SELECT * FROM obtener_estado_sistema();
```

O ejecuta manualmente estos scripts en orden:
1. `supabase/sql/00_FUNCIONES_VERIFICACION.sql`
2. `supabase/sql/01_FUNCIONES_PUNTOS_TIERS.sql`
3. `supabase/sql/MASTER_SETUP_COMPLETO.sql`

---

**Estado:** 🚀 El frontend está en producción, solo falta configurar Supabase

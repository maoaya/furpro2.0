# ⚡ CONFIGURAR VARIABLES DE ENTORNO EN NETLIFY

## El problema:
El error `401 Failed to load resource` en `qqrxetxcglwrejtblwut.supabase.co/auth/v1/health` indica que **Netlify no tiene las variables de Supabase configuradas**.

## Solución inmediata:

### 1. Ir a Netlify Dashboard
- https://app.netlify.com/sites/futprovip/configuration/env

### 2. Agregar estas variables de entorno (Copy-Paste):

```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.F6GSIfkPgpgrcXkJU8b2PHhv-T5Lh36WSS2xdiuH-C8
VITE_GOOGLE_CLIENT_ID=760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
```

### 3. Guardar y Deploy
- Click "Save" en Netlify
- Ir a "Deploys" y click en el último deploy (o click "Trigger deploy" en Site settings)

### 4. Esperar a que termine el build

---

## Verificar que funcionó:
1. Abre Consola del navegador (F12)
2. Ve a https://futpro.vip/registro
3. Deberías ver los logs:
   - ✅ `🗄️ Inicializando Supabase Client...`
   - ✅ `🌍 Ubicación detectada (ipapi.co)` o fallback `ipwho.is`
4. Los campos de ciudad/país deben autocompletarse

---

## Si el deploy sigue sin funcionar desde CLI:

```bash
# Opción A: Unlink y link de nuevo
netlify unlink
netlify link --id 74bcadc0-f0f4-493a-8bbb-d73ebed36e85

# Opción B: Deploy directo desde Netlify UI
# 1. Ir a https://app.netlify.com/sites/futprovip/deploys
# 2. Click "Trigger deploy" sin Git push
```

---

## Debug si aún no funciona:

Abre F12 → Console en https://futpro.vip y busca:
- `❌ Variables de entorno de Supabase faltantes` → Falta VITE_SUPABASE_URL
- `⚠️ ipapi.co no disponible` → Revisar bloqueadores/CORS
- `✅ Ubicación detectada` → Geolocalización OK

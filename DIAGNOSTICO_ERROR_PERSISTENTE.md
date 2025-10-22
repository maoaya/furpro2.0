# 🔴 ERROR PERSISTENTE: Unable to exchange external code

## 📊 Estado Actual

**Fecha:** 21 de octubre de 2025, 4:15 PM  
**Error:** `Unable to exchange external code: 4/0AVGzR1BsWP...`  
**Estado:** El error persiste después de múltiples intentos

---

## 🎯 DIAGNÓSTICO FINAL

El hecho de que el error **persista exactamente igual** después de configurar Supabase significa que hay **un problema específico en Google Cloud Console** que no se ha corregido.

### Posibles causas en orden de probabilidad:

1. **❌ El redirect_uri en Google Cloud Console AÚN tiene URLs incorrectas**
   - Debe tener SOLO: `https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback`
   - NO debe tener: `https://futpro.vip/auth/callback` ni ninguna otra

2. **❌ El Client Secret en Supabase es incorrecto**
   - Debe ser copiado EXACTAMENTE desde Google Cloud Console
   - Sin espacios, sin saltos de línea, sin caracteres extra

3. **❌ Los cambios en Google no se han propagado**
   - Google tarda 2-5 minutos en propagar cambios de OAuth
   - Si acabas de guardar, espera 5 minutos completos

4. **❌ El OAuth Client ID usado en Supabase NO es el mismo que configuraste**
   - Puede que tengas múltiples OAuth Clients en Google
   - Verifica que el Client ID en Supabase coincida con el que editaste

---

## ✅ VERIFICACIÓN CRÍTICA PASO A PASO

### PASO 1: Identificar el OAuth Client correcto

1. Abre: https://console.cloud.google.com/apis/credentials

2. En la sección "OAuth 2.0 Client IDs", **copia el Client ID completo** de cada uno

3. Abre Supabase: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers

4. **Verifica que el Client ID en Supabase coincida EXACTAMENTE** con uno de los Client IDs de Google

### PASO 2: Verificar el OAuth Client correcto

1. En Google Cloud Console, **click en el nombre** del OAuth Client que coincide con Supabase

2. **Toma captura de pantalla** de la sección "Authorized redirect URIs"

3. **Verifica que tenga SOLO esto:**
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   ```

4. Si tiene CUALQUIER otra URL, **elimínala**

5. Click en **"SAVE"**

### PASO 3: Verificar el Client Secret

1. En la pantalla del OAuth Client (Google Cloud Console), busca el **"Client Secret"**

2. Click en el ícono de **"Copy"** (📋) para copiar el Client Secret

3. Ve a Supabase → Providers → Google

4. **Borra completamente** el Client Secret actual

5. **Pega el nuevo Client Secret** (Ctrl+V)

6. **NO presiones Enter ni agregues saltos de línea**

7. Click en **"Save"**

### PASO 4: Esperar propagación

1. **Cierra todas las ventanas de futpro.vip**

2. **Espera 5 minutos completos** (cronometra)

3. Mientras esperas, verifica el OAuth Consent Screen:
   - URL: https://console.cloud.google.com/apis/credentials/consent
   - Si está en "Testing", tu email DEBE estar como Test user
   - Si no está, agrégalo y espera otros 2 minutos

### PASO 5: Prueba definitiva

1. Abre **ventana de incógnito**: Ctrl + Shift + N

2. Abre **DevTools ANTES** de navegar: F12

3. Ve a pestaña **Network** en DevTools

4. Navega a: https://futpro.vip

5. Click en "Continuar con Google"

6. Selecciona tu cuenta

7. **En la pestaña Network**, busca la llamada que contiene `/callback`

8. Click en esa llamada → Pestaña **"Response"**

9. **Copia el contenido completo** de la respuesta y pégalo aquí

---

## 🆘 ALTERNATIVA: Crear Nuevo OAuth Client Desde Cero

Si después de seguir TODOS los pasos arriba el error persiste, entonces hay algo corrupto. Crea un OAuth Client nuevo:

### En Google Cloud Console:

1. Ve a: https://console.cloud.google.com/apis/credentials

2. Click en **"+ CREATE CREDENTIALS"**

3. Selecciona **"OAuth client ID"**

4. Application type: **"Web application"**

5. Name: **"FutPro OAuth Fix 2025"**

6. **Authorized JavaScript origins:**
   ```
   https://futpro.vip
   https://qqrxetxcglwrejtblwut.supabase.co
   ```

7. **Authorized redirect URIs** (SOLO ESTA):
   ```
   https://qqrxetxcglwrejtblwut.supabase.co/auth/v1/callback
   ```

8. Click **"CREATE"**

9. **Copia el nuevo Client ID y Client Secret** que aparecen

### En Supabase:

1. Ve a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers

2. Google Provider:
   - **Client ID:** Pega el NUEVO Client ID
   - **Client Secret:** Pega el NUEVO Client Secret

3. Click **"Save"**

4. **Espera 2 minutos**

5. Prueba en incógnito nuevamente

---

## 📋 Checklist de Verificación Completa

Marca cada item SOLO si lo verificaste personalmente:

- [ ] Abrí Google Cloud Console y encontré el OAuth Client
- [ ] El Client ID en Google coincide EXACTAMENTE con el de Supabase
- [ ] Los "Authorized redirect URIs" en Google tienen SOLO la URL de Supabase
- [ ] Eliminé cualquier otra URL de los redirect URIs
- [ ] Guardé los cambios en Google (click en "SAVE")
- [ ] Copié el Client Secret directamente desde Google (con el botón copy)
- [ ] Pegué el Client Secret en Supabase sin espacios ni saltos de línea
- [ ] Guardé en Supabase (click en "Save")
- [ ] Mi email está como Test user en OAuth Consent Screen (si está en Testing)
- [ ] Esperé 5 minutos completos después de guardar
- [ ] Cerré TODAS las pestañas de futpro.vip antes de probar
- [ ] Probé en ventana de incógnito NUEVA
- [ ] Limpié localStorage/sessionStorage antes de probar

---

## 🔍 Información Necesaria para Diagnóstico Avanzado

Por favor proporciona:

### 1. Client ID Actual
```
El Client ID que tienes configurado en Supabase:
[PEGA AQUÍ]
```

### 2. Screenshot de Google Console
Toma captura de pantalla de:
- La lista de OAuth 2.0 Client IDs (para ver si hay múltiples)
- Los "Authorized redirect URIs" del client que usas

### 3. Response del Network Tab
Cuando hagas el flujo OAuth:
- Abre Network tab (F12)
- Busca la llamada `/callback`
- Copia la respuesta completa

---

## ⏰ Timeline de Acciones

| Hora | Acción | Resultado |
|------|--------|-----------|
| 3:57 PM | Primer intento OAuth | Error: Unable to exchange |
| 4:10 PM | Configuración ajustada | Error persiste |
| 4:15 PM | Segundo intento OAuth | Error persiste (mismo) |
| **Siguiente** | **Verificar Client ID correcto** | **Pendiente** |

---

**El error IDÉNTICO sugiere que los cambios no se aplicaron correctamente o se está usando un OAuth Client diferente al configurado.**

Por favor sigue el **PASO 1** arriba para verificar que el Client ID coincida.

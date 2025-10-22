## ⚠️ IMPORTANTE: CONFIGURACIÓN EN SUPABASE DASHBOARD

El Client Secret **NO se debe guardar en archivos .env del frontend** porque es información sensible.

### ✅ PASOS OBLIGATORIOS EN SUPABASE:

1. **Ve a Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
   ```

2. **Configura Google Provider:**

   - **Enabled:** ✅ (toggle verde)
   
   - **Client ID:**
     ```
     760210878835-r15nffmc9ldt4hb1a5k8mvs9dql7pkrf.apps.googleusercontent.com
     ```
   
   - **Client Secret:**
     ```
     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
     ```
   
   - **Authorized Client IDs:** (dejar vacío)
   
   - **Skip nonce check:** ❌ (dejar desmarcado)

3. **Haz clic en "Save"**

4. **Espera 3 minutos** para que propague

5. **Prueba en:**
   ```
   https://futpro.vip/diagnostico-oauth-live.html
   ```

---

## 🔒 Seguridad

- ✅ Client ID: Público (puede estar en .env)
- ❌ Client Secret: PRIVADO (solo en Supabase Dashboard)

El Client Secret que agregué a `.env.netlify` y `.env.production` es solo para referencia. 

**La configuración REAL debe hacerse en Supabase Dashboard.**

---

## 📋 Checklist de Configuración

- [ ] Client ID correcto en Supabase
- [ ] Client Secret pegado en Supabase (sin espacios)
- [ ] Provider Google habilitado (toggle verde)
- [ ] Click en "Save"
- [ ] Esperar 3 minutos
- [ ] Probar login en modo incógnito

---

**Después de configurar en Supabase Dashboard, el error "Unable to exchange external code" desaparecerá.**

# 🚀 INSTRUCCIONES: Forzar Despliegue en Netlify

## ⚡ MÉTODO RÁPIDO (Recomendado - 30 segundos)

### Opción A: Desde Dashboard de Netlify

1. **Abre en tu navegador**: https://app.netlify.com/sites/futprovip/deploys

2. **Click en el botón verde** "Trigger deploy" (esquina superior derecha)

3. **Selecciona**: "Clear cache and deploy site"

4. **Espera 2-3 minutos** hasta que el estado cambie a:
   - "Building" → "Deploying" → "Published ✅"

5. **Verifica** que el commit sea `a993e4a` o posterior

---

## 🔄 Si el Dashboard no Funciona

### Opción B: Forzar desde GitHub Actions

1. Ve a: https://github.com/maoaya/furpro2.0/actions

2. Si hay workflows, busca uno que dispare Netlify y ejecuta "Re-run"

### Opción C: Webhook de Netlify

Ejecuta este comando en tu terminal (PowerShell):

```powershell
$hookUrl = "https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID"
Invoke-WebRequest -Uri $hookUrl -Method POST
```

**Para obtener el Build Hook URL:**
1. Ve a: https://app.netlify.com/sites/futprovip/settings/deploys
2. Scroll down a "Build hooks"
3. Click "Add build hook"
4. Nombre: "Manual Deploy"
5. Branch: master
6. Copia la URL generada y reemplaza `YOUR_BUILD_HOOK_ID` arriba

---

## ✅ Verificar que el Deploy Está Activo

Una vez que hagas el "Trigger deploy", ejecuta esto cada minuto:

```cmd
curl -s https://futpro.vip/index.html | findstr /C:"a993e4a" && echo ✅ FIX ACTIVO || echo ⏳ Aun no publicado
```

---

## 🎯 Qué Esperar Después del Deploy

1. **El marker `a993e4a` aparecerá** en el HTML
2. **El login OAuth dejará de dar `bad_oauth_state`**
3. **Aterrizarás en `/home` después de Google login**

---

## 🚨 Si Nada Funciona

Netlify puede tener el auto-deploy deshabilitado. Verifica:

1. Ve a: https://app.netlify.com/sites/futprovip/settings/deploys
2. Sección "Deploy contexts"
3. **Production branch**: debe ser `master`
4. **Branch deploys**: debe estar `Enabled`
5. **Deploy previews**: puede estar en cualquier estado

Si está deshabilitado:
- Activa "Branch deploys" 
- Guarda cambios
- Haz un commit trivial para gatillar:
  ```cmd
  echo trigger > .netlify-trigger
  git add .netlify-trigger
  git commit -m "chore: trigger deploy"
  git push
  ```

---

**Última actualización**: 21 oct 2025, 09:00 AM  
**Commit con fix**: a993e4a (incluye a009753 con consolidación OAuth)

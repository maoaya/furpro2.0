# 🔐 Configuración de Secretos para CI/CD

## 📋 Secretos Necesarios

Para que el workflow de GitHub Actions funcione completamente, necesitas configurar estos secretos en tu repositorio:

### 🔧 Cómo agregar secretos en GitHub:
1. Ve a tu repositorio en GitHub
2. Clica en **Settings** (Configuración)
3. En el menú lateral, clica en **Secrets and variables** > **Actions**
4. Clica en **New repository secret**
5. Agrega cada secreto con su nombre y valor

---

## 📢 Notificaciones Slack

### `SLACK_WEBHOOK_URL`
**Descripción**: URL del webhook de Slack para enviar notificaciones
**Cómo obtenerlo**:
1. Ve a tu workspace de Slack
2. Busca "Incoming Webhooks" en las Apps
3. Agrega la app a tu workspace
4. Selecciona el canal donde quieres recibir notificaciones
5. Copia la URL del webhook (ejemplo: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`)

**Ejemplo de notificación que recibirás**:
```
✅ Tests passed on FutPro2.0
Branch: main
Commit: abc123 by usuario
Build took: 2m 45s
```

---

## 🚀 Deploy a Vercel

### `VERCEL_TOKEN`
**Descripción**: Token de acceso de Vercel
**Cómo obtenerlo**:
1. Ve a [vercel.com](https://vercel.com) y logueate
2. Ve a **Settings** > **Tokens**
3. Clica en **Create Token**
4. Dale un nombre (ej: "GitHub Actions")
5. Copia el token generado

### `VERCEL_ORG_ID`
**Descripción**: ID de tu organización/equipo en Vercel
**Cómo obtenerlo**:
1. En Vercel, ve a tu proyecto
2. Ve a **Settings** > **General**
3. Busca la sección "Project ID" y copia el **Team ID** (si es personal, será tu User ID)

### `VERCEL_PROJECT_ID`
**Descripción**: ID del proyecto específico en Vercel
**Cómo obtenerlo**:
1. En Vercel, ve a tu proyecto
2. Ve a **Settings** > **General**
3. Copia el **Project ID**

---

## 📧 Alternativa: Notificaciones por Email

Si prefieres email en lugar de Slack, reemplaza la sección de notificaciones con:

```yaml
- name: Notificación por Email
  if: always()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "FutPro CI/CD: ${{ job.status }}"
    body: |
      Estado: ${{ job.status }}
      Repositorio: ${{ github.repository }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
    to: tu-email@ejemplo.com
    from: noreply@futpro.com
```

**Secretos adicionales para email**:
- `EMAIL_USERNAME`: Tu email (ej: tu-email@gmail.com)
- `EMAIL_PASSWORD`: Contraseña de aplicación de Gmail

---

## 🔄 Alternativas de Deploy

### Deploy a Netlify
Reemplaza la sección de Vercel con:
```yaml
- name: Deploy a Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Deploy a Railway
```yaml
- name: Deploy a Railway
  uses: railway-app/railway-action@v1
  with:
    command: "railway deploy"
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## ✅ Lista de Verificación

- [ ] `SLACK_WEBHOOK_URL` configurado
- [ ] `VERCEL_TOKEN` configurado  
- [ ] `VERCEL_ORG_ID` configurado
- [ ] `VERCEL_PROJECT_ID` configurado
- [ ] Workflow testeado con un push a main
- [ ] Notificaciones funcionando
- [ ] Deploy funcionando

---

## 🚨 Seguridad

**IMPORTANTE**: 
- ✅ **NUNCA** pongas secretos directamente en el código
- ✅ Usa solo `${{ secrets.NOMBRE_SECRETO }}` en los workflows
- ✅ Los secretos son encriptados y solo visibles para ti
- ✅ Puedes rotar/cambiar secretos cuando quieras

---

**¡Con estos secretos configurados, tu pipeline estará completamente automatizado!** 🚀
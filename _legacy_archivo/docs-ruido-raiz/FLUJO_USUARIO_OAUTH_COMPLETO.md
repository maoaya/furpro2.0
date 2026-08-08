# 🎯 FLUJO DE USUARIO: REGISTRO OAUTH → PERFIL → CARD → HOMEPAGE

## ✅ Estado del Proyecto

- **Tests Backend**: ✅ 23/23 pasando
- **Tests Frontend**: ✅ 59/59 suites pasando, 135/135 tests OK
- **Tests E2E Cypress**: ✅ Creado `oauth-registro-completo.cy.js`
- **Deploy Netlify**: ✅ Desplegado en producción (https://futpro.vip)

---

## 📋 PASOS PARA EL USUARIO

### 1️⃣ **Acceder al Formulario de Registro Completo**

**URL**: `https://futpro.vip/formulario-registro-completo`

**Acción**: 
- El usuario accede al formulario de registro completo de FutPro.
- Completa opcionalmente los campos del formulario (nombre, apellidos, edad, posición, etc.).

---

### 2️⃣ **Iniciar OAuth con Google**

**Acción**:
- El usuario hace clic en el botón **"Continuar con Google"**.
- El sistema:
  - Guarda `post_auth_target = '/registro-perfil'` en `localStorage`
  - Guarda `oauth_origin = 'formulario_registro'` en `localStorage`
  - Pre-guarda borradores de datos del formulario en `localStorage`:
    - `futpro_user_card_data`
    - `futpro_registro_draft`
    - `draft_carfutpro`
    - `show_first_card = 'true'`
  - Redirige a la pantalla de autenticación de Google (OAuth).

**Componente**: `src/pages/FormularioRegistroCompleto.jsx` → `handleGoogleSignup()`

---

### 3️⃣ **Callback de OAuth**

**URL automática**: `https://futpro.vip/auth/callback?access_token=...&type=signup`

**Acción**:
- Supabase procesa la autenticación y redirige al callback de FutPro.
- El componente `AuthCallback` detecta al usuario autenticado y:
  - Lee `post_auth_target` y `oauth_origin` de `localStorage`.
  - Valida que `post_auth_target === '/registro-perfil'`.
  - **NO** hace upsert de carfutpro (solo si el target fuera `/perfil-card`).
  - Limpia flags: `post_auth_target`, `oauth_origin`.
  - Trackea el login con `userActivityTracker.trackLogin()`.
  - Redirige a **`/registro-perfil`**.

**Componente**: `src/pages/AuthCallback.jsx`

---

### 4️⃣ **Completar Perfil (Pantalla Intermedia)**

**URL**: `https://futpro.vip/registro-perfil`

**Acción**:
- El usuario ve la pantalla **"Completa tu perfil"** con campos editables:
  - Nombre
  - Apellidos
  - Posición
  - Experiencia
  - Foto (opcional)
- Al hacer clic en **"Guardar"** o **"Continuar"**:
  - El sistema hace **upsert** en la tabla `carfutpro` de Supabase.
  - Calcula el puntaje del jugador con `calcularPuntajeInicial()`.
  - Guarda los datos de la card en `localStorage` (`futpro_user_card_data`).
  - Marca `show_first_card = 'true'`.
  - Redirige a **`/perfil-card`**.

**Componente**: `src/pages/RegistroPerfil.jsx`

---

### 5️⃣ **Ver la Card Generada**

**URL**: `https://futpro.vip/perfil-card`

**Acción**:
- El usuario ve su **Card de Jugador** generada con:
  - Foto
  - Nombre y apellidos
  - Posición
  - Puntaje (0-99)
  - Gradiente de fondo dorado
  - Badge "NUEVA CARD" (si es primera vez)
- Al hacer clic en el botón **"Continuar"**:
  - El sistema limpia `show_first_card` de `localStorage`.
  - Redirige a **`/home-instagram`** (SPA tipo Instagram).

**Componente**: `src/pages/PerfilCard.jsx`

---

### 6️⃣ **Llegar a Homepage Instagram**

**URL**: `https://futpro.vip/home-instagram`

**Acción**:
- El usuario llega al **homepage tipo Instagram** de FutPro con:
  - Feed de publicaciones
  - Navegación inferior (Home, Ofertas, TV, Calendario)
  - Funcionalidad completa de red social futbolística

**Archivo**: `src/pages/HomeInstagram.jsx`

---

## 🔄 FLUJO ALTERNATIVO: Directo a Card

Si en algún momento se desea ir **directo a Card** tras el OAuth (sin pantalla intermedia):

1. En `FormularioRegistroCompleto.jsx`, cambiar:
   ```javascript
   localStorage.setItem('post_auth_target', '/perfil-card'); // en lugar de '/registro-perfil'
   ```

2. En `AuthCallback.jsx`, el callback detectará `target === '/perfil-card'` y:
   - Hará **upsert** directo en `carfutpro` usando `draft_carfutpro`.
   - Guardará `futpro_user_card_data`.
   - Redirigirá directo a `/perfil-card`.

---

## 🧪 VALIDACIÓN

### Tests Unitarios (Jest)

```bash
# Backend
npm run test:backend

# Frontend
npx jest -c jest.frontend.config.cjs --runInBand

# Tests específicos de OAuth
npx jest -c jest.frontend.config.cjs src/pages/__tests__/FormularioRegistroCompleto.oauth.test.jsx
npx jest -c jest.frontend.config.cjs src/pages/__tests__/AuthCallback.oauth.test.jsx
npx jest -c jest.frontend.config.cjs src/pages/__tests__/PerfilCard.test.jsx
```

### Tests E2E (Cypress)

```bash
# Abrir interfaz de Cypress
npx cypress open

# Ejecutar spec de OAuth
npx cypress run --spec cypress/e2e/oauth-registro-completo.cy.js
```

---

## 🚀 DEPLOY

El proyecto está configurado para **auto-deploy** en Netlify:

```bash
# Build local
npm run build

# Deploy manual
npm run deploy
# O usando tarea de VS Code: "Deploy (Netlify validated, -yes)"
```

**URL de Producción**: https://futpro.vip

---

## 📊 ESTADO DE ARCHIVOS MODIFICADOS

### Componentes Modificados

1. ✅ `src/pages/FormularioRegistroCompleto.jsx`
   - `handleGoogleSignup()`: Establece `post_auth_target='/registro-perfil'`, guarda borradores.

2. ✅ `src/pages/AuthCallback.jsx`
   - Lee `post_auth_target` y `oauth_origin`.
   - Upserta en `carfutpro` si `target==='/perfil-card'`.
   - Limpia flags y redirige con fallback a `window.location.href`.

3. ✅ `src/pages/RegistroPerfil.jsx`
   - Upserta en `carfutpro` tras completar perfil.
   - Establece `post_auth_target='/registro-perfil'` si no autenticado.

4. ✅ `src/pages/PerfilCard.jsx`
  - Botón "Continuar" navega a `/home-instagram`.
   - Limpia `show_first_card`.

5. ✅ `src/services/UserActivityTracker.js`
   - Protecciones para entorno Node (tests backend).
   - Comprobaciones de `localStorage`, `window`, `navigator`.

### Tests Creados

6. ✅ `src/pages/__tests__/FormularioRegistroCompleto.oauth.test.jsx`
7. ✅ `src/pages/__tests__/AuthCallback.oauth.test.jsx`
8. ✅ `src/pages/__tests__/PerfilCard.test.jsx`
9. ✅ `cypress/e2e/oauth-registro-completo.cy.js`

### Configuración

10. ✅ `babel.config.cjs` - Agregado `@babel/plugin-syntax-dynamic-import`
11. ✅ `jest.setup.mjs` - Polyfills para `localStorage`, `window`, `navigator`, `performance`

---

## 🎉 RESUMEN

El flujo de autenticación OAuth con Google desde el formulario de registro está **completamente funcional** y **testeado**:

- ✅ OAuth → `/registro-perfil` (pantalla intermedia)
- ✅ Completar perfil → `/perfil-card` (ver card)
- ✅ Continuar → `/home-instagram` (homepage tipo Instagram)
- ✅ Tests backend: 23/23 ✅
- ✅ Tests frontend: 135/135 ✅
- ✅ Tests E2E Cypress creados
- ✅ Deploy en Netlify: https://futpro.vip

**El usuario puede probar el flujo completo en producción accediendo a**:  
👉 **https://futpro.vip/formulario-registro-completo**

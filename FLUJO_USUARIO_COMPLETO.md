# 🏆 FutPro - Flujo Completo del Usuario

## 📋 Resumen del Flujo

Este documento mapea paso a paso por dónde debe pasar un usuario desde que llega a FutPro hasta que está completamente activo en la plataforma.

## 🚀 Flujo Principal: Usuario Nuevo

### 1. Página de Entrada (Login/Registro)
- **URL**: `https://futpro.vip/` (o cualquier URL, se redirige al login si no autenticado)
- **Componente**: `LoginRegisterForm.jsx`
- **Qué ve el usuario**:
  - Logo de FutPro
  - Tabs: "Ingresar" y "Registrarse"
  - Botones sociales: Google y Facebook
- **Acciones disponibles**:
  - Pestaña "Ingresar": configura redirect a `/dashboard`
  - Pestaña "Registrarse": configura redirect a `/validar-usuario`
  - Click en Google/Facebook: inicia OAuth

### 2A. Login Exitoso (Pestaña "Ingresar")
- **Proceso**: OAuth con Google/Facebook → Firebase Auth
- **Destino**: `/dashboard` (directo)
- **Lógica**: `AuthGate` en `main.jsx` lee `postLoginRedirect` y redirige

### 2B. Registro Exitoso (Pestaña "Registrarse")
- **Proceso**: OAuth con Google/Facebook → Firebase Auth
- **Destino**: `/validar-usuario` (formulario de inscripción)
- **Lógica**: `AuthGate` en `main.jsx` lee `postLoginRedirect` y redirige

### 3. Formulario de Validación/Inscripción
- **URL**: `/validar-usuario`
- **Componente**: `ValidarUsuarioForm.jsx`
- **Qué ve el usuario**:
  - Bienvenida
  - Formulario de validación de usuario
  - Botón "🏆 Continuar al Dashboard"
- **Propósito**: Completar datos del perfil, validaciones, etc.
- **Salida**: Click en "Continuar al Dashboard" → `/dashboard`

### 4. Dashboard Principal
- **URL**: `/dashboard`
- **Componente**: `Dashboard.jsx` (lazy-loaded)
- **Qué ve el usuario**:
  - Panel principal de la aplicación
  - Sidebar con navegación
  - Contenido personalizado según rol
- **Navegación**: Desde aquí puede acceder a todas las funciones

## 🧭 Navegación Dentro de la App

### Estructura de Rutas Principales

#### 🏠 Core/Principal
- `/dashboard` - Dashboard principal
- `/inicio` - Página de inicio alternativa
- `/perfil` - Perfil del usuario
- `/perfil-avanzado` - Configuración avanzada del perfil

#### ⚽ Gestión Deportiva
- `/equipos` - Lista de equipos
- `/equipos/:equipoId` - Detalle de equipo
- `/equipos/:equipoId/editar` - Editar equipo
- `/torneos` - Lista de torneos
- `/torneos/:torneoId` - Detalle de torneo
- `/torneos/:torneoId/editar` - Editar torneo
- `/partidos` - Lista de partidos
- `/partidos/:partidoId` - Detalle de partido
- `/partidos/:partidoId/editar` - Editar partido

#### 👥 Gestión de Usuarios
- `/usuarios` - Lista de usuarios
- `/usuarios/:usuarioId` - Detalle de usuario
- `/usuarios/:usuarioId/editar` - Editar usuario
- `/buscar-usuario` - Buscador de usuarios

#### 🎯 Funciones Especiales
- `/validar-usuario` - Formulario post-registro
- `/validador-web` - Validador web
- `/validador-web-colaborativo` - Validador colaborativo
- `/streaming` - Streaming en vivo
- `/chat` - Chat en tiempo real
- `/notificaciones` - Centro de notificaciones

#### 📊 Análisis y Estadísticas
- `/estadisticas-avanzadas` - Estadísticas detalladas
- `/logros` - Sistema de logros
- `/comparativas` - Comparar jugadores/equipos
- `/progreso` - Seguimiento de progreso
- `/penaltis` - Simulador de penaltis
- `/historial` - Historial de actividades

#### 🛠️ Administración
- `/admin` - Panel de administración
- `/moderacion` - Herramientas de moderación
- `/configuracion` - Configuración de la cuenta
- `/integraciones-api` - Integraciones API

#### 💰 Comercio y Pagos
- `/pagos-marketplace` - Marketplace y pagos
- `/invitaciones-solicitudes` - Gestión de invitaciones

#### 🏢 Páginas Empresariales
- `/crear-marca` - Crear marca
- `/categorias` - Categorías
- `/transporte` - Gestión de transporte

#### ❓ Soporte
- `/ayuda-faq` - Preguntas frecuentes
- `/soporte` - Centro de soporte
- `/recuperar-password` - Recuperar contraseña
- `/privacidad-seguridad` - Privacidad y seguridad

## 🔐 Estados de Autenticación

### Usuario No Autenticado
- **Cualquier URL** → Redirige a `LoginRegisterForm`
- **Componente activo**: `LoginRegisterForm.jsx`
- **Layout**: Sin sidebar, formulario centrado

### Usuario Autenticado
- **URLs protegidas** → Acceso a `AppRouter`
- **Componente activo**: `AppRouter.jsx` + `LayoutPrincipal`
- **Layout**: Sidebar completo + contenido principal

## 🔄 Flujos Especiales

### Recuperación de Sesión
1. Usuario regresa a la app
2. `AuthGate` verifica sesión automáticamente
3. Si hay sesión válida → directo al último destino o `/dashboard`
4. Si no hay sesión → `LoginRegisterForm`

### Logout
1. Usuario hace click en "Cerrar sesión"
2. Se limpia la sesión de Firebase/Supabase
3. Redirige a `LoginRegisterForm`

### Redirección Post-Login
1. `LoginRegisterForm` configura `postLoginRedirect` en localStorage
2. Tras OAuth exitoso, `AuthGate` lee y aplica la redirección
3. Se limpia `postLoginRedirect` para evitar loops

## 🎨 Componentes Clave

### `main.jsx` - Punto de Entrada
- Renderiza `AuthGate`
- Maneja redirecciones post-login
- Carga `I18nextProvider` y `AuthProvider`

### `AuthGate` - Control de Acceso
- Si `loading`: muestra loader
- Si no `user`: muestra `LoginRegisterForm`
- Si `user`: muestra `AppRouter` (o redirige si corresponde)

### `LoginRegisterForm.jsx` - Autenticación
- Tabs para login/registro
- OAuth con Google/Facebook únicamente
- Configura destino según tab activa

### `AppRouter.jsx` - Navegación Principal
- Router completo de la aplicación
- Lazy loading de todos los componentes
- Envuelto en `LayoutPrincipal`

### `LayoutPrincipal` - Layout de la App
- Sidebar con navegación
- Área de contenido principal
- Header/footer si corresponde

## 🐛 Problemas Solucionados

### ✅ Registro sin redirección
- **Problema**: Tras registro en tab "Registrarse", no iba a `/validar-usuario`
- **Solución**: Mejorado `AuthGate` para evitar loops y aplicar redirección correcta

### ✅ Facebook OAuth no funcionaba
- **Problema**: Configuración Firebase incompleta para Facebook
- **Solución**: Agregadas variables VITE_FIREBASE_MESSAGING_SENDER_ID y VITE_FIREBASE_STORAGE_BUCKET

### ✅ Loops de redirección
- **Problema**: `window.location.replace` causaba loops infinitos
- **Solución**: Verificar si ya estamos en la página destino antes de redirigir

### ✅ Navegación manual desde ValidarUsuario
- **Problema**: Usuarios atascados en `/validar-usuario`
- **Solución**: Botón "🏆 Continuar al Dashboard" para navegación manual

## 🚀 Próximos Pasos

1. **Verificar OAuth Facebook**: Confirmar que funciona en producción
2. **Mejorar ValidarUsuarioForm**: Conectar con backend para guardar datos del perfil
3. **Testing del flujo completo**: Probar desde registro hasta uso normal
4. **Optimizar redirecciones**: Considerar usar React Router en lugar de window.location.replace

---
*Última actualización: 19 de septiembre de 2025*
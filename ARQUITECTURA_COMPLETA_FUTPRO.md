# 📊 ARQUITECTURA COMPLETA FUTPRO 2.0

## 🏗️ ESTRUCTURA GENERAL DEL PROYECTO

### **Aplicación Principal**
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6 (BrowserRouter)
- **Estado Global**: Context API (AuthContext, RoleContext)
- **Base de Datos**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Netlify con funciones serverless
- **Dominio**: https://futpro.vip

### **Punto de Entrada**
```
src/main.jsx → src/FutProAppDefinitivo.jsx
```

---

## 🗺️ FLUJO DE NAVEGACIÓN PRINCIPAL

### **Router Principal: FutProAppDefinitivo.jsx**

#### **Rutas Públicas (Sin Autenticación)**
- `/` → LoginRegisterForm (Página de inicio/login)
- `/registro` → RegistroFuncionando (Registro simple)
- `/registro-completo` → RegistroCompleto (Registro con perfil completo)
- `/auth/callback` → CallbackPage (OAuth callback)
- `/auth/test` → OAuthLiveTest (Testing OAuth)
- `/debug-config` → DebugConfig (Configuración debug)

#### **Rutas Protegidas (Con ProtectedRoute)**
- `/home` → HomePage (Feed principal)
- `/dashboard` → DashboardPage (Panel administrativo)
- `/usuarios` → PageInDevelopment (En desarrollo)
- `/torneos` → PageInDevelopment (En desarrollo)
- `/equipos` → PageInDevelopment (En desarrollo)
- `/chat` → PageInDevelopment (En desarrollo)
- `/perfil` → PageInDevelopment (En desarrollo)
- `/notificaciones` → PageInDevelopment (En desarrollo)
- `/buscar/:query` → PageInDevelopment (En desarrollo)
- `/validar-usuario` → Confirmación de registro exitoso

#### **Componente ProtectedRoute**
- **Modo Gracia**: Permite acceso temporal después del registro
- **Validación**: Redirige a login si no hay usuario autenticado
- **Limpieza**: Elimina marcadores localStorage tras autenticación

---

## 📱 PÁGINAS Y FUNCIONALIDADES

### **1. AUTENTICACIÓN Y REGISTRO**

#### **LoginRegisterForm.jsx**
- **Funcionalidad**: Login con email/password y OAuth (Google/Facebook)
- **Características**:
  - Formulario dual login/registro
  - Integración con Supabase Auth
  - Redirección automática post-login
  - Manejo de errores de autenticación

#### **RegistroFuncionando.jsx**
- **Funcionalidad**: Registro simple con datos básicos
- **Características**:
  - Campos: nombre, email, password
  - Auto-confirmación opcional (sin verificación email)
  - Bypass de captcha con función serverless
  - Creación automática de perfil en tabla usuarios
  - Redirección estable a /home

#### **RegistroCompleto.jsx**
- **Funcionalidad**: Registro completo con perfil deportivo
- **Características**:
  - **Paso 1**: Datos básicos (nombre, email, contraseñas)
  - **Paso 2**: Info deportiva (edad, peso, posición, frecuencia juego)
  - **Paso 3**: Foto perfil y ubicación (ciudad, país)
  - Upload de imagen a Supabase Storage
  - Cálculo automático de calificación basado en frecuencia
  - Opción OAuth en paso final
  - Bypass captcha + redirección estable

#### **CallbackPage.jsx**
- **Funcionalidad**: Manejo de callbacks OAuth
- **Características**:
  - Procesamiento de tokens OAuth
  - Creación/actualización de perfil
  - Redirección a destino configurado

---

### **2. PÁGINA PRINCIPAL (HOME)**

#### **HomePage.jsx**
- **Funcionalidad**: Feed social de la aplicación
- **Características**:
  - **Feed de Publicaciones**: Lista de posts multimedia
  - **Likes en Tiempo Real**: WebSocket para likes instantáneos
  - **Comentarios en Tiempo Real**: Sistema de comentarios live
  - **Notificaciones**: WebSocket para notificaciones push
  - **Estadísticas de Usuario**: Partidos, goles, asistencias, cards, nivel
  - **Búsqueda**: Filtrado de contenido
  - **Copilot IA**: Asistente integrado
  - **Servicios Integrados**:
    - mediaService: Gestión multimedia
    - commentService: Sistema de comentarios
    - WebSocket hooks para tiempo real

---

### **3. DASHBOARD ADMINISTRATIVO**

#### **DashboardPage.jsx**
- **Funcionalidad**: Panel de control administrativo
- **Características**:
  - **Navegación Lateral**: Acceso rápido a secciones
  - **Estadísticas**: Contadores de usuarios, torneos, equipos
  - **Botones de Acción**: Navegación a gestión de entidades
  - **Integración Supabase**: RPC calls para estadísticas
  - **Diseño Responsivo**: Layout adaptativo

---

### **4. GESTIÓN DE ENTIDADES**

#### **TorneosPage.jsx**
- **Funcionalidad**: CRUD de torneos
- **Características**:
  - Lista de torneos con filtrado
  - Crear nuevo torneo (modal)
  - Ver detalle de torneo
  - Editar/eliminar torneos
  - Integración completa con Supabase
  - Feedback de operaciones

#### **EquiposPage.jsx**
- **Funcionalidad**: CRUD de equipos
- **Características**:
  - Lista de equipos con filtrado
  - Crear nuevo equipo
  - Ver detalle de equipo
  - Gestión completa CRUD
  - Control de roles y permisos

#### **UsuariosPage.jsx** (Múltiples versiones)
- **Funcionalidad**: Gestión de usuarios
- **Características**:
  - Lista paginada de usuarios
  - Filtros avanzados
  - Edición de perfiles
  - Gestión de roles
  - Moderación de contenido

---

### **5. PÁGINAS ESPECIALIZADAS**

#### **AdminPanelPage.jsx**
- **Funcionalidad**: Panel super administrativo
- **Características**:
  - Gestión de toda la plataforma
  - Estadísticas avanzadas
  - Moderación global
  - Configuración del sistema

#### **NotificationsPage.jsx**
- **Funcionalidad**: Centro de notificaciones
- **Características**:
  - Lista de notificaciones
  - Marcado como leído
  - Filtros por tipo
  - Configuración de preferencias

#### **ChatPage.jsx**
- **Funcionalidad**: Sistema de chat
- **Características**:
  - Chat en tiempo real
  - Múltiples salas
  - Multimedia support
  - Moderación integrada

---

### **6. PÁGINAS DE DESARROLLO**

#### **PageInDevelopment.jsx**
- **Funcionalidad**: Placeholder para páginas en construcción
- **Características**:
  - Mensaje personalizable
  - Icono dinámico
  - Botón de retorno
  - Diseño consistente

---

## 🎨 COMPONENTES DE LAYOUT

### **LayoutPrincipal.jsx**
- **Funcionalidad**: Layout principal de la aplicación
- **Estructura**:
  - TopBar: Barra superior con navegación
  - GlobalNav: Navegación lateral/global
  - Main Content: Área de contenido principal
  - BottomNav: Navegación inferior móvil
- **Validaciones**:
  - Control de autenticación
  - Verificación de perfil completo
  - Redirección automática si faltan datos

### **Componentes de Navegación**
- **TopBar**: Búsqueda, perfil, notificaciones
- **GlobalNav**: Menú lateral con secciones principales
- **BottomNav**: Navegación móvil (Home, Chat, Perfil, etc.)

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### **AuthContext.jsx**
- **Funcionalidades**:
  - Gestión de sesión Supabase
  - OAuth con Google/Facebook
  - Carga automática de perfil desde tabla usuarios
  - Estados: user, loading, role, perfil
  - Métodos: login, logout, register, OAuth handlers

### **Flujo de Autenticación**
1. **Login/Registro** → Supabase Auth
2. **Validación** → ProtectedRoute
3. **Carga de Perfil** → Tabla usuarios
4. **Redirección** → Destino configurado (localStorage postLoginRedirect)

### **Protección de Rutas**
- **ProtectedRoute**: Wrapper para rutas autenticadas
- **Modo Gracia**: 2 minutos de acceso post-registro
- **Marcadores**: localStorage para control de flujo
- **Redirección**: Sistema robusto con reintentos

---

## 🗄️ BASE DE DATOS (SUPABASE)

### **Tablas Principales**
- **usuarios**: Perfiles de usuario completos
- **torneos**: Gestión de torneos
- **equipos**: Gestión de equipos
- **partidos**: Gestión de partidos
- **publicaciones**: Feed social
- **comentarios**: Sistema de comentarios
- **likes**: Sistema de likes

### **Funciones RPC**
- **get_dashboard_stats**: Estadísticas para dashboard
- **Políticas RLS**: Row Level Security configurado

---

## 🌐 DESPLIEGUE Y HOSTING

### **Netlify Configuration**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: SPA routing configurado
- **Headers**: Cache control y seguridad
- **Functions**: Serverless para bypass de captcha

### **Variables de Entorno**
- **VITE_AUTO_CONFIRM_SIGNUP**: Auto-confirmación usuarios
- **SUPABASE_URL/KEY**: Configuración Supabase
- **OAuth Credentials**: Google/Facebook

---

## 📱 FUNCIONALIDADES TIEMPO REAL

### **WebSocket Hooks**
- **useWebSocketNotifications**: Notificaciones push
- **useWebSocketComments**: Comentarios en vivo
- **useWebSocketLikes**: Likes instantáneos

### **Servicios**
- **mediaService**: Gestión multimedia
- **commentService**: Sistema de comentarios
- **Integración completa** con backend real

---

## 🧪 TESTING Y QA

### **Páginas de Testing**
- **TestPage.jsx**: Página de pruebas generales
- **OAuthLiveTest.jsx**: Testing OAuth en vivo
- **DebugConfig.jsx**: Debug de configuración

### **Archivos de Testing**
- Jest tests distribuidos por componentes
- Cypress E2E tests
- Tests unitarios y de integración

---

## 🚀 CARACTERÍSTICAS ESPECIALES

### **Bypass de Captcha**
- **Frontend**: No envío de captcha token
- **Serverless**: Función Netlify para crear usuarios confirmados
- **Fallback**: Magic link si falla autenticación

### **Redirección Estable**
- **redirectStabilizer.js**: Utilidad para navegación robusta
- **Reintentos**: Múltiples intentos de navegación
- **Hard Redirect**: window.location como último recurso

### **Auto-confirmación**
- **Modo QA**: Sin verificación email en desarrollo
- **Banner**: Indicador visual del modo activo
- **Configuración**: Variable de entorno controlable

---

## 📊 MÉTRICAS Y ANALYTICS

### **Navigation Monitor**
- **useNavigationMonitor**: Hook para tracking de navegación
- **NavigationMonitor**: Componente de monitoreo
- **Logs detallados**: Para debugging y analytics

### **User Stats**
- Partidos jugados
- Goles y asistencias
- Tarjetas recibidas
- Nivel de usuario
- Calificación dinámica

---

## 🔧 HERRAMIENTAS DE DESARROLLO

### **Scripts Disponibles**
- `npm run dev`: Desarrollo local
- `npm run build`: Build producción
- `npm run deploy`: Despliegue automático
- `npm test`: Ejecución de tests

### **Limpieza y Mantenimiento**
- Scripts PowerShell para limpieza
- Git hooks configurados
- Netlify cache management

---

## 📋 ESTADO ACTUAL DEL PROYECTO

### **✅ Funcionalidades Completas**
- Sistema de autenticación completo
- Registro con auto-confirmación
- Bypass de captcha
- Redirección estable post-registro
- Layout principal funcional
- CRUD básico de entidades
- Integración Supabase
- Despliegue Netlify

### **🚧 En Desarrollo**
- Páginas marcadas como PageInDevelopment
- Funcionalidades avanzadas de chat
- Sistema completo de notificaciones
- Marketplace
- Streaming en vivo

### **🎯 Próximas Funcionalidades**
- Completar páginas en desarrollo
- Sistema de torneos avanzado
- Integración de pagos
- App móvil nativa
- IA más avanzada

---

Esta documentación proporciona una visión completa de cómo funciona cada componente del sistema FutPro 2.0, desde la arquitectura general hasta los detalles específicos de implementación.
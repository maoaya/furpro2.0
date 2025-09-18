# 🚦 Estado del sistema

Consulta `/api/ping` o el Validador Web para saber si el backend está activo.

---

# FutPro - Aplicación Profesional de Gestión de Fútbol ⚽

## 🎯 Descripción
FutPro es una aplicación completa para la gestión de fútbol que incluye:
- 🔐 Sistema de autenticación múltiple (Google, Facebook, Teléfono)
- 👥 Gestión completa de usuarios, equipos y torneos
- 📺 Transmisiones en vivo con WebRTC
- 💬 Chat en tiempo real
- 📱 Sistema de historias tipo Instagram
- 🏆 Sistema de calificación y logros
- 🎮 Juego interactivo de penaltis
- 📊 Analíticas y reportes completos

## 🚀 Características Principales

### 🔑 Autenticación
- Login con Google, Facebook y número de teléfono
- Registro por tipo de usuario (Jugador, Patrocinador, Organizador, Árbitro)
- Verificación parental para menores de 14 años
- Recuperación de contraseña segura

### ⚽ Tipos de Campeonatos
- **Micro**: 5 jugadores (máximo 12 en plantilla)
- **Fútbol 7**: 7 jugadores (máximo 16 en plantilla)
- **Fútbol 8**: 8 jugadores (máximo 18 en plantilla)
- **Fútbol 9**: 9 jugadores (máximo 20 en plantilla)
- **Fútbol 11**: 11 jugadores (máximo 23 en plantilla)

### 📊 Sistema de Calificación
- Novato → Amateur → Semi-Pro → Profesional → Crack → Estrella → Leyenda → Super Leyenda

### 🎮 Características Especiales
- Juego de penaltis interactivo (3 intentos cada 8 horas)
- Transmisiones en vivo hasta 10 espectadores
- Chat moderado automáticamente
- Sistema de historias con TTL de 24h
- Notificaciones push inteligentes

## 🛠️ Tecnologías Utilizadas
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Backend**: Node.js, Express
- **Base de Datos**: Supabase PostgreSQL
- **Tiempo Real**: Firebase Realtime Database
- **Autenticación**: Supabase Auth + Firebase Auth
- **Transmisiones**: WebRTC, Socket.io
- **IA**: OpenAI GPT-4 (Copilot integration)

## 📱 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/futpro/futpro-app.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_DATABASE_URL=your-database-url

# OpenAI
OPENAI_API_KEY=your-openai-key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

## 🎨 Diseño
- **Colores**: Negro y Dorado
- **Estilo**: Profesional y moderno
- **Responsive**: Optimizado para móviles y escritorio

## 🔒 Seguridad
- Encriptación de datos sensibles
- Rate limiting anti-spam
- Moderación automática de contenido
- Validación de edad y contenido
- Row Level Security (RLS) en Supabase

## 📞 Soporte
- Integración con Copilot para soporte técnico
- Chat en tiempo real
- Sistema de tickets
- Documentación completa

## 🚀 Roadmap
- [ ] v1.0: Funcionalidades básicas
- [ ] v1.1: Transmisiones en vivo
- [ ] v1.2: IA avanzada
- [ ] v1.3: Monetización
- [ ] v2.0: Expansión internacional

---
**© 2025 FutPro - Todos los derechos reservados**

# Endpoint Untitled-1

Se ha creado el endpoint `/api/untitled1` en el backend FutPro2.0.

**Uso:**
- Método: GET
- URL: `/api/untitled1`
- Respuesta:
```json
{
  "message": "Servicio Untitled-1 generado automáticamente."
}
```

**Integración:**
- El servicio está registrado en `server.js` y disponible para pruebas y desarrollo.

# FutPro 2.0 Workspace

## Requisitos

- Visual Studio Code
- Node.js y npm
- Java 17+ (para backend Spring Boot)
- Supabase API Key y configuración en `.env`
- Firebase API Key y configuración en `.env`
- Vite para frontend React

## Instalación

1. Clona el repositorio y abre la carpeta en Visual Studio Code.

2. Instala dependencias del frontend:
   ```bash
   npm install
   ```

3. Configura tus variables en `.env` (puedes copiar `.env.example`).

## Backend (Spring Boot)

1. Abre una terminal en la raíz del proyecto.
2. Inicia el backend con:
   ```bash
   ./gradlew bootRun
   ```
   > Si usas Windows, ejecuta:
   ```bash
   gradlew.bat bootRun
   ```
3. El backend estará disponible en `http://localhost:8080`.

## Frontend (Vite/React)

1. Abre una terminal en la raíz del proyecto.
2. Inicia el frontend con:
   ```bash
   npm run dev
   ```
3. Accede a la app en `http://localhost:5173` (o el puerto que indique Vite).

## Supabase y Firebase

- Configura las claves en `.env`.
- El frontend y backend usan Supabase para base de datos y autenticación.
- Firebase se usa para notificaciones y chat en tiempo real.

## Estructura de carpetas

- `/src` - Código fuente frontend y servicios
- `/server.js` - Servidor Node.js (si usas Node para API)
- `/src/config` - Configuración de Supabase, Firebase, JWT
- `/src/services` - Lógica de negocio y conexión con APIs
- `/src/components` - Componentes React
- `/src/pages` - Páginas React
- `/public` - Recursos estáticos y manifest

## Pruebas

- Ejecuta pruebas con:
  ```bash
  npm test
  ```
- Cypress para tests end-to-end:
  ```bash
  npx cypress open
  ```

## Notas

- Si usas Spring Boot, asegúrate de tener configurado el datasource y endpoints REST.
- Si usas Node.js, ejecuta `npm run start` para el backend.
- Para desarrollo local, puedes usar ambos backend y frontend en paralelo.

## Soporte

- Contacta al equipo FutPro para dudas o soporte.

# Chequeo de Salud del Sistema y Variables de Entorno

## Endpoint de Salud `/api/ping`

El backend expone un endpoint público para comprobar que el servidor está activo y accesible:

```
GET /api/ping
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "pong",
  "timestamp": "2025-09-15T12:34:56.789Z",
  "version": "1.0.0"
}
```
- `status`: Estado del backend ("ok" si está activo)
- `message`: Mensaje de confirmación ("pong")
- `timestamp`: Fecha y hora de la respuesta
- `version`: Versión del backend (desde package.json)

Puedes probar este endpoint desde el navegador, Postman o usando el Validador Web del frontend.

---

## Validador Web (Frontend)

El Validador Web muestra en tiempo real el estado del backend consultando `/api/ping`. Si el backend está activo, verás un mensaje verde con los detalles. Si no, verás una alerta roja.

---

## Variables de Entorno y Seguridad

- Todas las variables críticas que usa el frontend deben tener su versión con prefijo `VITE_` en el archivo `.env`.
- Ejemplo:
  ```env
  VITE_SUPABASE_URL=https://...
  VITE_OPENAI_API_KEY=sk-...
  ```
- El backend accede a las variables con `process.env.NOMBRE`.
- El frontend accede a las variables con `import.meta.env.VITE_NOMBRE`.
- **Nunca subas el archivo `.env` a un repositorio público.**
- Si cambias o agregas variables, reinicia el backend y recompila el frontend.

---

## Ejemplo rápido con curl

```bash
curl http://localhost:8080/api/ping
```

---

## Problemas comunes

- Si el Validador Web muestra "Inaccesible", asegúrate de que el backend está corriendo y que la variable `VITE_API_URL` apunta a la URL correcta.
- Si cambias el `.env`, reinicia backend y frontend.
- Si `/api/ping` no responde, revisa la consola del backend para ver errores.

---

## Flujo recomendado de despliegue

1. Configura el archivo `.env` (no lo subas a git).
2. Inicia el backend.
3. Inicia el frontend.
4. Verifica `/api/ping` y el Validador Web.

---

# FutPro - Aplicación Profesional de Gestión de Fútbol ⚽

## 🎯 Descripción
FutPro es una aplicación completa para la gestión de fútbol que incluye:
- 🔐 Sistema de autenticación múltiple (Google, Facebook, Teléfono)
- 👥 Gestión completa de usuarios, equipos y torneos
- 📺 Transmisiones en vivo con WebRTC
- 💬 Chat en tiempo real
- 📱 Sistema de historias tipo Instagram
- 🏆 Sistema de calificación y logros
- 🎮 Juego interactivo de penaltis
- 📊 Analíticas y reportes completos

## 🚀 Características Principales

### 🔑 Autenticación
- Login con Google, Facebook y número de teléfono
- Registro por tipo de usuario (Jugador, Patrocinador, Organizador, Árbitro)
- Verificación parental para menores de 14 años
- Recuperación de contraseña segura

### ⚽ Tipos de Campeonatos
- **Micro**: 5 jugadores (máximo 12 en plantilla)
- **Fútbol 7**: 7 jugadores (máximo 16 en plantilla)
- **Fútbol 8**: 8 jugadores (máximo 18 en plantilla)
- **Fútbol 9**: 9 jugadores (máximo 20 en plantilla)
- **Fútbol 11**: 11 jugadores (máximo 23 en plantilla)

### 📊 Sistema de Calificación
- Novato → Amateur → Semi-Pro → Profesional → Crack → Estrella → Leyenda → Super Leyenda

### 🎮 Características Especiales
- Juego de penaltis interactivo (3 intentos cada 8 horas)
- Transmisiones en vivo hasta 10 espectadores
- Chat moderado automáticamente
- Sistema de historias con TTL de 24h
- Notificaciones push inteligentes

## 🛠️ Tecnologías Utilizadas
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Backend**: Node.js, Express
- **Base de Datos**: Supabase PostgreSQL
- **Tiempo Real**: Firebase Realtime Database
- **Autenticación**: Supabase Auth + Firebase Auth
- **Transmisiones**: WebRTC, Socket.io
- **IA**: OpenAI GPT-4 (Copilot integration)

## 📱 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/futpro/futpro-app.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_DATABASE_URL=your-database-url

# OpenAI
OPENAI_API_KEY=your-openai-key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

## 🎨 Diseño
- **Colores**: Negro y Dorado
- **Estilo**: Profesional y moderno
- **Responsive**: Optimizado para móviles y escritorio

## 🔒 Seguridad
- Encriptación de datos sensibles
- Rate limiting anti-spam
- Moderación automática de contenido
- Validación de edad y contenido
- Row Level Security (RLS) en Supabase

## 📞 Soporte
- Integración con Copilot para soporte técnico
- Chat en tiempo real
- Sistema de tickets
- Documentación completa

## 🚀 Roadmap
- [ ] v1.0: Funcionalidades básicas
- [ ] v1.1: Transmisiones en vivo
- [ ] v1.2: IA avanzada
- [ ] v1.3: Monetización
- [ ] v2.0: Expansión internacional

---
**© 2025 FutPro - Todos los derechos reservados**

# Endpoint Untitled-1

Se ha creado el endpoint `/api/untitled1` en el backend FutPro2.0.

**Uso:**
- Método: GET
- URL: `/api/untitled1`
- Respuesta:
```json
{
  "message": "Servicio Untitled-1 generado automáticamente."
}
```

**Integración:**
- El servicio está registrado en `server.js` y disponible para pruebas y desarrollo.

# FutPro 2.0 Workspace

## Requisitos

- Visual Studio Code
- Node.js y npm
- Java 17+ (para backend Spring Boot)
- Supabase API Key y configuración en `.env`
- Firebase API Key y configuración en `.env`
- Vite para frontend React

## Instalación

1. Clona el repositorio y abre la carpeta en Visual Studio Code.

2. Instala dependencias del frontend:
   ```bash
   npm install
   ```

3. Configura tus variables en `.env` (puedes copiar `.env.example`).

## Backend (Spring Boot)

1. Abre una terminal en la raíz del proyecto.
2. Inicia el backend con:
   ```bash
   ./gradlew bootRun
   ```
   > Si usas Windows, ejecuta:
   ```bash
   gradlew.bat bootRun
   ```
3. El backend estará disponible en `http://localhost:8080`.

## Frontend (Vite/React)

1. Abre una terminal en la raíz del proyecto.
2. Inicia el frontend con:
   ```bash
   npm run dev
   ```
3. Accede a la app en `http://localhost:5173` (o el puerto que indique Vite).

## Supabase y Firebase

- Configura las claves en `.env`.
- El frontend y backend usan Supabase para base de datos y autenticación.
- Firebase se usa para notificaciones y chat en tiempo real.

## Estructura de carpetas

- `/src` - Código fuente frontend y servicios
- `/server.js` - Servidor Node.js (si usas Node para API)
- `/src/config` - Configuración de Supabase, Firebase, JWT
- `/src/services` - Lógica de negocio y conexión con APIs
- `/src/components` - Componentes React
- `/src/pages` - Páginas React
- `/public` - Recursos estáticos y manifest

## Pruebas

- Ejecuta pruebas con:
  ```bash
  npm test
  ```
- Cypress para tests end-to-end:
  ```bash
  npx cypress open
  ```

## Notas

- Si usas Spring Boot, asegúrate de tener configurado el datasource y endpoints REST.
- Si usas Node.js, ejecuta `npm run start` para el backend.
- Para desarrollo local, puedes usar ambos backend y frontend en paralelo.

## Soporte

- Contacta al equipo FutPro para dudas o soporte.

# Chequeo de Salud del Sistema y Variables de Entorno

## Endpoint de Salud `/api/ping`

El backend expone un endpoint público para comprobar que el servidor está activo y accesible:

```
GET /api/ping
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "pong",
  "timestamp": "2025-09-15T12:34:56.789Z",
  "version": "1.0.0"
}
```
- `status`: Estado del backend ("ok" si está activo)
- `message`: Mensaje de confirmación ("pong")
- `timestamp`: Fecha y hora de la respuesta
- `version`: Versión del backend (desde package.json)

Puedes probar este endpoint desde el navegador, Postman o usando el Validador Web del frontend.

---

## Validador Web (Frontend)

El Validador Web muestra en tiempo real el estado del backend consultando `/api/ping`. Si el backend está activo, verás un mensaje verde con los detalles. Si no, verás una alerta roja.

---

## Variables de Entorno y Seguridad

- Todas las variables críticas que usa el frontend deben tener su versión con prefijo `VITE_` en el archivo `.env`.
- Ejemplo:
  ```env
  VITE_SUPABASE_URL=https://...
  VITE_OPENAI_API_KEY=sk-...
  ```
- El backend accede a las variables con `process.env.NOMBRE`.
- El frontend accede a las variables con `import.meta.env.VITE_NOMBRE`.
- **Nunca subas el archivo `.env` a un repositorio público.**
- Si cambias o agregas variables, reinicia el backend y recompila el frontend.

---

## Ejemplo rápido con curl

```bash
curl http://localhost:8080/api/ping
```

---

## Problemas comunes

- Si el Validador Web muestra "Inaccesible", asegúrate de que el backend está corriendo y que la variable `VITE_API_URL` apunta a la URL correcta.
- Si cambias el `.env`, reinicia backend y frontend.
- Si `/api/ping` no responde, revisa la consola del backend para ver errores.

---

## Flujo recomendado de despliegue

1. Configura el archivo `.env` (no lo subas a git).
2. Inicia el backend.
3. Inicia el frontend.
4. Verifica `/api/ping` y el Validador Web.

---

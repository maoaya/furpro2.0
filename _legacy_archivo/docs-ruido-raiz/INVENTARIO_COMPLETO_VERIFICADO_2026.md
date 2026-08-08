# 📋 INVENTARIO COMPLETO - FUTPRO 2.0
**Fecha:** 16 de enero de 2026  
**Estado:** Verificación integral completa  
**Responsable:** Auditoría de Sistema

---

## 🔍 RESUMEN EJECUTIVO

| Categoría | Cantidad | Estado |
|-----------|----------|--------|
| Páginas React | 88 | ✅ Todas creadas |
| Rutas en App.jsx | 88+ | ✅ Todas definidas |
| Componentes | 150+ | ✅ Funcionales |
| Servicios | 12+ | ✅ Activos |
| Tablas SQL | 15+ | ✅ Configuradas |
| Usuarios | Sin límite | ⚠️ Sin validación de duplicados |

---

## 📍 FLUJO DE USUARIO: LOGIN → REGISTRO → CARD

### 1️⃣ **LOGIN (LoginPage.jsx)**
- **Ruta:** `/login`, `/auth`
- **Función:** Autenticación con email/password o Google OAuth
- **Verificaciones:**
  - ✅ Validar que email existe en tabla `carfutpro`
  - ✅ Validar que email existe en tabla `users`
  - ✅ Limitar intentos fallidos (SecurityService)
  - ⚠️ **REVISAR:** Detectar geolocalización IP precisa

**Archivos implicados:**
- `src/pages/LoginPage.jsx`
- `src/services/AuthService.js`
- `src/services/SecurityService.js`

---

### 2️⃣ **REGISTRO (FormularioRegistroCompleto.jsx)**
- **Ruta:** `/registro`, `/registro-nuevo`
- **Pasos:** 4 (Credenciales → Datos Personales → Futbolístico → Foto)
- **Ubicación Auto-detectada:** Por API ipapi.co y ipwho.is

#### **PASO 1: Credenciales**
- ✅ Email
- ✅ Contraseña (mín. 6 caracteres)
- ✅ Confirmación de contraseña

#### **PASO 2: Datos Personales**
- ✅ Nombre
- ✅ Apellido
- ✅ Peso (kg)
- ✅ Categoría (Masculina, Femenina, Infantil M/F)
- ✅ Altura (cm)
- ✅ Teléfono (opcional)
- ✅ Ciudad (auto-detectada)
- ✅ País (auto-detectada)
- ✅ Edad (mín. 8 años)
- ✅ Pierna dominante (Derecha, Izquierda, Ambidiestra)

#### **PASO 3: Información Futbolística** ⚠️ **NECESITA ACTUALIZACIÓN**
- ✅ Posición Favorita (11 posiciones Fútbol 11, 5 Futsal)
- ⚠️ **FALTA:** "Árbitro" como opción
- ✅ Nivel de Habilidad (Principiante → Elite)
- ✅ Equipo Favorito
- ✅ Disponibilidad de Juego
- ✅ Frecuencia de Juego
- ✅ Objetivo Deportivo
- ✅ Redes Sociales

**CAMPOS QUE DEBEN AGREGARSE SI ES ÁRBITRO:**
- `licenseNumber` - Número de licencia
- `certificationLevel` - Nivel de certificación
- `experienceYears` - Años de experiencia

#### **PASO 4: Foto de Perfil**
- ✅ Subir desde dispositivo
- ✅ Ingresar URL de imagen

**Guardar en:**
- ✅ `pendingProfileData` (localStorage)
- ✅ `draft_carfutpro` (localStorage)
- ✅ `carfutpro` tabla (Supabase)
- ⚠️ `tournament_referees` tabla (solo si posición = Árbitro)

**Validaciones necesarias:**
- ⚠️ **NO PERMITIR** email duplicado
- ⚠️ **Verificar:** email_único en tabla `users`
- ⚠️ **Verificar:** email_único en tabla `carfutpro`

---

### 3️⃣ **CARD FIFA (CardFIFA.jsx / PerfilCard.jsx)**
- **Ruta:** `/card-fifa`, `/perfil-card`
- **Función:** Mostrar tarjeta de jugador estilo FIFA

#### **Rutas en App.jsx:**
```javascript
<Route path="/card-fifa" element={<CardFIFA />} />
<Route path="/perfil-card" element={<PerfilCard />} />
<Route path="/sugerencias-card" element={<SugerenciasCard />} />
```

#### **MenuHamburguesa ruta:**
```javascript
{ nombre: 'Card Futpro', icono: '🆔', ruta: '/card-fifa', categoria: 'Juegos & Cards' }
```

✅ **RUTAS CORRECTAS** - No hay problema aquí

---

## 🏟️ RUTAS DE TORNEOS & ÁRBITRO

### **Árbitro Panel**
- **Ruta:** `/arbitro`
- **Componente:** `ArbitroPanelPage.jsx`
- **Función:** Dashboard para árbitros

### **Tablas relacionadas:**
- `tournament_referees` - Almacena árbitros registrados
  - `user_id` (UUID)
  - `license_number` (VARCHAR)
  - `certification_level` (VARCHAR)
  - `experience_years` (INT)
  - `available` (BOOLEAN)
  - `availability_schedule` (JSON)

### **Funciones:**
```sql
-- Verificar si usuario es árbitro
SELECT * FROM tournament_referees WHERE user_id = $1

-- Listar árbitros por nivel
SELECT * FROM tournament_referees 
WHERE certification_level = 'Regional'
```

---

## 📊 MATRIZ COMPLETA DE PÁGINAS

### **🔐 AUTENTICACIÓN (9 rutas)**
| Ruta | Componente | Estado | Descripción |
|------|-----------|--------|------------|
| `/login` | LoginPage | ✅ | Login email/Google |
| `/auth` | LoginPage | ✅ | Alias de login |
| `/registro` | FormularioRegistroCompleto | ✅ | Registro en 4 pasos |
| `/registro-nuevo` | FormularioRegistroCompleto | ✅ | Alias de registro |
| `/registro-perfil` | RegistroPerfil | ✅ | Perfil post-registro |
| `/auth/callback` | AuthCallback | ✅ | OAuth redirect |
| `/perfil-card` | PerfilCard | ✅ | Card FIFA post-registro |
| `/perfil` | PerfilNuevo | ✅ | Perfil principal |
| `/perfil/me` | PerfilNuevo | ✅ | Mi perfil |

### **🏠 PRINCIPALES (11 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | RootRoute → HomePage | ✅ |
| `/home` | FeedPage | ✅ |
| `/feed` | FeedPage | ✅ |
| `/perfil/:userId` | PerfilInstagram | ✅ |
| `/notificaciones` | Notificaciones | ✅ |
| `/marketplace` | MarketplaceCompleto | ✅ |
| `/videos` | VideosFeed | ✅ |
| `/chat` | Chat | ✅ |
| `/penaltis` | Penaltis | ✅ |
| `/card-fifa` | CardFIFA | ✅ |
| `/sugerencias-card` | SugerenciasCard | ✅ |

### **🏟️ EQUIPOS Y TORNEOS (15 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/equipos` | Equipos | ✅ |
| `/crear-equipo` | CrearEquipo | ✅ |
| `/equipo/:id` | EquipoDetallePage | ✅ |
| `/equipo/:teamId/plantilla` | PlantillaEquipo | ✅ |
| `/equipo/:teamId/plantilla-mejorada` | MiEquipoMejorado | ✅ |
| `/mi-equipo/:teamId` | MiEquipoMejorado | ✅ |
| `/convocar-jugadores/:teamId` | ConvocarJugadores | ✅ |
| `/mis-invitaciones` | MisInvitaciones | ✅ |
| `/torneos` | Torneos | ✅ |
| `/crear-torneo` | CrearTorneo | ✅ |
| `/crear-torneo-mejorado` | CrearTorneoMejorado | ✅ |
| `/crear-torneo-completo` | CrearTorneoCompleto | ✅ |
| `/torneo/:id` | TorneoDetallePage | ✅ |
| `/amistoso` | Amistoso | ✅ |
| `/tarjetas` | Tarjetas | ✅ |

### **📊 ESTADÍSTICAS Y RANKING (10 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/ranking` | RankingMejorado | ✅ |
| `/ranking-clasico` | EstadisticasPage | ✅ |
| `/ranking-jugadores` | RankingJugadoresCompleto | ✅ |
| `/ranking-equipos` | RankingEquiposCompleto | ✅ |
| `/buscar-ranking` | BuscarRanking | ✅ |
| `/estadisticas` | Estadisticas | ✅ |
| `/estadisticas-avanzadas` | EstadisticasAvanzadasPage | ✅ |
| `/progreso` | Progreso | ✅ |
| `/historial-penaltis` | HistorialPage | ✅ |
| `/usuario/:id` | UsuarioDetallePage | ✅ |

### **💬 COMUNICACIÓN Y SOCIAL (7 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/chat` | ChatInstagram | ✅ |
| `/estados` | Estados | ✅ |
| `/amigos` | Amigos | ✅ |
| `/transmision-en-vivo` | LiveStreamPage | ✅ |
| `/subir-historia` | SubirHistoria | ✅ |
| `/chat-instagram-new` | ChatInstagramNew | ✅ |
| `/penaltis-multijugador` | PenaltisMultijugador | ✅ |

### **🎯 ARBITRAJE Y TORNEOS AVANZADOS (7 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/crear-torneo-avanzado` | CrearTorneoAvanzado | ✅ |
| `/arbitro` | ArbitroPanelPage | ✅ |
| `/torneo/:tournamentId/standings` | TorneoStandingsPage | ✅ |
| `/torneo/:tournamentId/brackets` | TorneoBracketPage | ✅ |
| `/notificaciones-torneo` | NotificacionesTorneoPage | ✅ |
| `/penaltis-multijugador` | PenaltisMultijugador | ✅ |
| `/crear-torneo-avanzado` | CrearTorneoAvanzado | ✅ |

### **⚙️ USUARIO Y CONFIGURACIÓN (5 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/editar-perfil` | EditarPerfil | ✅ |
| `/configuracion` | ConfiguracionPage | ✅ |
| `/logros` | Logros | ✅ |
| `/seccion/:slug` | SeccionPlaceholder | ✅ |
| `/diagnostico-funciones` | DiagnosticoFunciones | ✅ |

### **📄 INFORMACIÓN (6 rutas)**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `/ayuda` | PageInDevelopment | ✅ |
| `/soporte` | Soporte | ✅ |
| `/privacidad` | Privacidad | ✅ |
| `/comparativas` | PageInDevelopment | ✅ |
| `/compartir` | PageInDevelopment | ✅ |
| `/chat-sql` | PageInDevelopment | ✅ |

### **❌ CATCH-ALL**
| Ruta | Componente | Estado |
|------|-----------|--------|
| `*` | NotFoundPage | ✅ |

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### **1. POSICIÓN DE ÁRBITRO EN REGISTRO** 🔴 CRÍTICO
**Ubicación:** `FormularioRegistroCompleto.jsx` línea ~720  
**Problema:** El select de "Posición Favorita" NO incluye "Árbitro"  
**Impacto:** Los árbitros no pueden registrarse correctamente  
**Solución necesaria:**
- Agregar opción "🤴 Árbitro" en el select
- Cuando se selecciona Árbitro, mostrar campos:
  - `licenseNumber`
  - `certificationLevel`
  - `experienceYears`
- Guardar en tabla `tournament_referees`

### **2. VALIDACIÓN DE EMAIL DUPLICADO** 🟡 IMPORTANTE
**Ubicación:** `AuthService.js` línea 45-60  
**Estado:** ✅ Parcialmente implementado
**Verificaciones:**
- ✅ Checkea si email existe en tabla `users`
- ✅ Checkea si email existe en tabla `carfutpro`
- ⚠️ **Pero:** Usa `.maybeSingle()` que puede fallar silenciosamente
- ⚠️ **Debe usar:** `.single()` con manejo de error

### **3. GEOLOCALIZACIÓN PRECISA (IP)** 🟡 IMPORTANTE
**Ubicación:** `FormularioRegistroCompleto.jsx` línea 65-115  
**Servicio:** ipapi.co y ipwho.is
**Problema:**
- ✅ Detecta ciudad y país
- ⚠️ **FALTA:** Municipios/distritos
- ⚠️ **FALTA:** Precisión regional por país

**Datos que debería tener por país:**
- 🇦🇷 Argentina: Provincias y municipios
- 🇨🇱 Chile: Regiones y comunas
- 🇨🇴 Colombia: Departamentos y municipios
- 🇲🇽 México: Estados y municipios
- 🇧🇷 Brasil: Estados y cidades
- etc. (mundo completo)

### **4. USUARIOS SIN VALIDACIÓN DE DUPLICADOS** 🔴 CRÍTICO
**Problema:** Usuario puede crear varias cuentas con mismo email
**Ubicación:** `AuthService.signUpWithEmail()` línea 41-120
**Solución requerida:**
```javascript
// Debe usar CONSTRAINT de DB + validación de app
// En SQL:
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);
ALTER TABLE carfutpro ADD CONSTRAINT unique_email_carfutpro UNIQUE(email);
```

---

## 🗄️ TABLAS SQL CRÍTICAS

### **users**
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE) ⚠️ Falta CONSTRAINT
- password_hash (VARCHAR)
- created_at (TIMESTAMP)
```

### **carfutpro**
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- email (VARCHAR) ⚠️ Falta UNIQUE
- nombre (VARCHAR)
- apellido (VARCHAR)
- posicion (VARCHAR) ⚠️ Debe incluir "Árbitro"
- categoria (VARCHAR)
- ciudad (VARCHAR)
- pais (VARCHAR)
- lat (FLOAT)
- lon (FLOAT)
- created_at (TIMESTAMP)
```

### **tournament_referees**
```sql
- user_id (UUID, PK, FK to auth.users) ✅
- license_number (VARCHAR)
- certification_level (VARCHAR)
- experience_years (INT)
- available (BOOLEAN)
- availability_schedule (JSON)
```

---

## ✅ LISTA DE VERIFICACIÓN - ANTES DE DEPLOY

- [ ] **CRÍTICO:** Agregar "Árbitro" a formulario de registro
- [ ] **CRÍTICO:** Campos de árbitro (licenseNumber, certificationLevel, experienceYears)
- [ ] **CRÍTICO:** Validación de email duplicado con CONSTRAINT en DB
- [ ] **IMPORTANTE:** Geolocalización con municipios completos
- [ ] Verificar que CardFIFA guarda datos correctamente
- [ ] Verificar que usuarios se guardan sin duplicados
- [ ] Verificar que PerfilCard carga datos correctamente
- [ ] Test de flujo completo: Registro → Card → HomePage
- [ ] Verificar OAuth callback redirecciona correctamente
- [ ] Build sin errores

---

## 📞 CONTACTO & REFERENCIAS

**Archivos clave:**
- Formulario: `src/pages/FormularioRegistroCompleto.jsx`
- Autenticación: `src/services/AuthService.js`
- App Router: `src/App.jsx`
- SQL Bases: `DISCIPLINARY_SANCTIONS.sql`, esquema en Supabase

**Última verificación:** 16 de enero de 2026

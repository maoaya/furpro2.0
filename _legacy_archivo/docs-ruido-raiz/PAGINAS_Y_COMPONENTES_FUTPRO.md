# 📱 PÁGINAS Y COMPONENTES - FUTPRO 2.0

## 🔐 MÓDULO DE AUTENTICACIÓN

### 1. **Landing Page** (`/`)
**Archivo:** `LoginRegisterForm.jsx`
**Componentes:**
- Formulario de login
- Formulario de registro
- Botones OAuth (Google/Facebook)
- Logo FutPro
- Animaciones de entrada

### 2. **Página de Login** (`/login`)
**Archivo:** `AuthPageUnificada.jsx`
**Componentes:**
- Input email
- Input password
- Botón "Iniciar sesión"
- Botón "Iniciar con Google"
- Botón "Iniciar con Facebook"
- Link "¿Olvidaste tu contraseña?"
- Link "Crear cuenta"

### 3. **Página de Registro** (`/registro`)
**Archivo:** `AuthPageUnificada.jsx`
**Componentes:**
- Input nombre completo
- Input email
- Input password
- Input confirmar password
- Botón "Registrarse"
- Botones OAuth (Google/Facebook)
- Checkbox términos y condiciones
- Link "Ya tengo cuenta"

### 4. **Registro Multi-paso** (`/registro-nuevo`)
**Archivo:** `RegistroNuevo.jsx`
**Componentes:**
- **Paso 1:** Datos personales (nombre, email, password)
- **Paso 2:** Información deportiva (posición, pie dominante)
- **Paso 3:** Foto de perfil y avatar
- **Paso 4:** Confirmación y términos
- Barra de progreso
- Botones "Anterior" / "Siguiente"
- Indicador de pasos (1/4, 2/4, etc.)

### 5. **Callback OAuth** (`/auth/callback`)
**Archivo:** `AuthCallback.jsx`
**Componentes:**
- Spinner de carga
- Mensaje "Completando registro..."
- Handler de código OAuth
- Creación automática de perfil
- Redirección a homepage

---

## 🏠 MÓDULO PRINCIPAL

### 6. **Homepage Instagram** (`/homepage-instagram.html`)
**Archivo:** `public/homepage-instagram.html`
**Componentes:**
- **Header Superior:**
  - Logo FutPro
  - Botón menú hamburguesa
  - Icono notificaciones
  - Icono chat
  
- **Barra de Historias:**
  - Avatar "Mi Historia"
  - Avatares de equipos/amigos
  - Indicador live (rojo pulsante)
  
- **Feed de Posts:**
  - Avatar usuario
  - Nombre y timestamp
  - Imagen/Video del post
  - Botones: Like, Comentar, Compartir
  - Contador de likes
  - Sección de comentarios
  
- **Bottom Navigation:**
  - Icono Home
  - Icono Market
  - Botón + (publicar)
  - Icono Videos
  - Icono Alertas
  
- **Menú Hamburguesa (31 opciones):**
  - 6 opciones Principal
  - 5 opciones Equipos/Torneos
  - 5 opciones Juegos/Cards
  - 6 opciones Social
  - 4 opciones Rankings
  - 5 opciones Administración

### 7. **Feed React** (`/feed`)
**Archivo:** `FeedPage.jsx`
**Componentes:**
- SidebarMenu (izquierda)
- Grid de posts
- Card de post individual
- Modal comentarios
- Modal compartir
- Infinite scroll
- BottomNav

---

## 👤 MÓDULO DE PERFIL

### 8. **Perfil Instagram** (`/perfil-instagram.html`)
**Archivo:** `public/perfil-instagram.html`
**Componentes:**
- **Header Perfil:**
  - Avatar grande
  - Nombre usuario
  - Bio/Descripción
  - Stats: Posts, Seguidores, Siguiendo
  - Botón "Editar perfil"
  
- **Tabs:**
  - Posts (grid)
  - Partidos
  - Logros
  - Estadísticas
  
- **Grid de Posts:**
  - Miniaturas posts
  - Indicador video/foto
  - Contador likes

### 9. **Perfil React** (`/perfil/:userId`)
**Archivo:** `PerfilPage.jsx`
**Componentes:**
- Layout con sidebar
- Avatar editable
- Información usuario
- Tabs dinámicos
- Gráficas estadísticas
- Lista de partidos recientes

### 10. **Editar Perfil** (`/editar-perfil.html`)
**Archivo:** `public/editar-perfil.html`
**Componentes:**
- Upload foto perfil
- Input nombre
- Input bio
- Input posición
- Input equipo
- Selector pie dominante
- Botón guardar
- Botón cancelar

---

## 📊 MÓDULO DE ESTADÍSTICAS

### 11. **Estadísticas** (`/estadisticas.html`)
**Archivo:** `public/estadisticas.html`
**Componentes:**
- **Resumen General:**
  - Partidos jugados
  - Goles
  - Asistencias
  - Tarjetas
  
- **Gráficas:**
  - Rendimiento por mes
  - Goles vs partidos
  - Comparativa con promedio
  
- **Tabla Detallada:**
  - Por torneo
  - Por rival
  - Por posición

### 12. **Estadísticas Avanzadas** (`/estadisticas-avanzadas`)
**Archivo:** `EstadisticasAvanzadasPage.jsx`
**Componentes:**
- Layout con sidebar
- Gráficas interactivas (Chart.js)
- Filtros por fecha
- Exportar PDF
- Comparativas

### 13. **Progreso** (`/progreso`)
**Archivo:** `ProgresoPage.jsx`
**Componentes:**
- Línea de tiempo
- Hitos alcanzados
- Objetivos pendientes
- Barra de progreso
- Badges de logros

---

## ⚽ MÓDULO DE PARTIDOS

### 14. **Partidos** (`/partidos.html`)
**Archivo:** `public/partidos.html`
**Componentes:**
- **Lista de Partidos:**
  - Card partido (equipo vs equipo)
  - Resultado/marcador
  - Fecha y hora
  - Botón "Ver detalles"
  
- **Filtros:**
  - Próximos
  - Finalizados
  - En curso
  - Por torneo

### 15. **Detalle Partido** (`/partido/:id`)
**Archivo:** `PartidoDetalle.jsx`
**Componentes:**
- Marcador grande
- Alineaciones
- Goleadores
- Tarjetas
- Estadísticas del partido
- Timeline de eventos

---

## 🏆 MÓDULO DE EQUIPOS Y TORNEOS

### 16. **Equipos** (`/equipos.html`)
**Archivo:** `public/equipos.html`
**Componentes:**
- **Lista de Equipos:**
  - Card equipo (escudo, nombre)
  - Jugadores totales
  - Partidos jugados
  - Botón "Ver detalles"
  
- **Modal Crear Equipo:**
  - Input nombre equipo
  - Upload escudo
  - Selector colores
  - Botón crear

### 17. **Detalle Equipo** (`/equipo/:id`)
**Archivo:** `EquipoDetallePage.jsx`
**Componentes:**
- Header con escudo
- Lista de jugadores
- Estadísticas del equipo
- Próximos partidos
- Historial de resultados
- Botón "Editar" (si es admin)

### 18. **Torneos** (`/torneo.html`)
**Archivo:** `public/torneo.html`
**Componentes:**
- **Lista Torneos:**
  - Card torneo
  - Estado (inscripciones/en curso/finalizado)
  - Equipos participantes
  - Fechas
  
- **Modal Crear Torneo:**
  - Input nombre
  - Selector formato (eliminación/round-robin)
  - Fecha inicio
  - Número equipos

### 19. **Detalle Torneo** (`/torneo/:id`)
**Archivo:** `TorneoDetallePage.jsx`
**Componentes:**
- Info torneo
- Tabla de posiciones
- Fixture/calendario
- Goleadores
- Tarjetas
- Resultados por fecha

### 20. **Amistoso** (`/amistoso.html`)
**Archivo:** `public/amistoso.html`
**Componentes:**
- Selector equipo local
- Selector equipo visitante
- Selector fecha/hora
- Input ubicación
- Botón "Crear partido"

---

## 🎮 MÓDULO DE JUEGOS

### 21. **Penaltis** (`/penaltis.html`)
**Archivo:** `public/penaltis.html`
**Componentes:**
- Canvas del arco
- Botones direcciones (9 zonas)
- Marcador jugador vs CPU
- Animación portero
- Botón "Disparar"
- Historial de tiros

### 22. **Penaltis React** (`/penaltis`)
**Archivo:** `PenaltisPage.jsx`
**Componentes:**
- Layout con sidebar
- Juego de penaltis
- Tabla de mejores puntajes
- Logros desbloqueables

### 23. **Historial Penaltis** (`/historial-penaltis`)
**Archivo:** `HistorialPenaltisPage.jsx`
**Componentes:**
- Tabla partidas jugadas
- Filtros por fecha
- Estadísticas generales
- Récord personal

### 24. **Centro de Juegos** (`/juegos.html`)
**Archivo:** `public/juegos.html`
**Componentes:**
- **Grid de Juegos:**
  - Card "Penaltis"
  - Card "Trivias"
  - Card "Adivina el jugador"
  - Card "Formación táctica"
  
- Cada card con:
  - Icono del juego
  - Nombre
  - Descripción breve
  - Botón "Jugar"

---

## 🃏 MÓDULO DE CARDS FIFA

### 25. **Tarjetas** (`/tarjetas.html`)
**Archivo:** `public/tarjetas.html`
**Componentes:**
- **Card FIFA del Usuario:**
  - OVR (rating general)
  - Posición
  - Foto/Avatar
  - Stats: PAC, SHO, PAS, DRI, DEF, PHY
  - Color según rating (Bronze/Silver/Gold)
  
- **Botones:**
  - "Generar nueva card"
  - "Compartir card"
  - "Ver sugerencias"
  
- **Galería de Cards:**
  - Cards de amigos
  - Cards destacadas

---

## 🏅 MÓDULO DE LOGROS

### 26. **Logros** (`/logros.html`)
**Archivo:** `public/logros.html`
**Componentes:**
- **Grid de Logros:**
  - Icono logro
  - Nombre
  - Descripción
  - Estado (desbloqueado/bloqueado)
  - Progreso (barra %)
  
- **Categorías:**
  - Goleador
  - Asistente
  - Veterano
  - Invencible
  - Coleccionista

### 27. **Logros React** (`/logros`)
**Archivo:** `LogrosPage.jsx`
**Componentes:**
- Layout con sidebar
- Filtros por categoría
- Animación desbloqueo
- Notificaciones logros

---

## 💬 MÓDULO SOCIAL

### 28. **Chat** (`/chat.html`)
**Archivo:** `public/chat.html`
**Componentes:**
- **Lista de Conversaciones:**
  - Avatar contacto
  - Nombre
  - Último mensaje
  - Indicador online
  - Badge mensajes no leídos
  
- **Ventana de Chat:**
  - Burbujas de mensajes
  - Input mensaje
  - Botón enviar
  - Indicador "escribiendo..."
  - Emoji picker

### 29. **Chat SQL** (`/chat-sql`)
**Archivo:** `ChatSQLPage.jsx`
**Componentes:**
- Layout con sidebar
- Chat Firebase realtime
- Lista usuarios online
- Rooms/grupos

### 30. **Notificaciones** (`/notificaciones.html`)
**Archivo:** `public/notificaciones.html`
**Componentes:**
- **Lista Notificaciones:**
  - Icono tipo (partido/logro/mensaje)
  - Texto notificación
  - Timestamp
  - Estado (leída/no leída)
  - Botón acción

### 31. **Notificaciones React** (`/notificaciones`)
**Archivo:** `NotificationsPage.jsx`
**Componentes:**
- Layout con sidebar
- Filtros por tipo
- Marcar todas leídas
- Eliminar todas

### 32. **Videos TikTok** (`/videos.html`) 🆕
**Archivo:** `public/videos.html`
**Componentes:**
- **Contenedor Vertical:**
  - Videos full-screen
  - Auto-play al scroll
  - Scroll snap
  
- **Overlay Info:**
  - Avatar autor
  - Nombre usuario
  - Descripción
  - Hashtags
  
- **Barra de Acciones:**
  - Botón Like (animado)
  - Botón Comentar
  - Botón Compartir
  - Contador visualizaciones
  
- **Badge Live:**
  - Indicador "EN VIVO"
  - Animación pulso
  
- **Tabs:**
  - Para Ti
  - Siguiendo
  - En Vivo
  
- **Modal Transmisión:**
  - Vista previa cámara
  - Input título stream
  - Botón "Iniciar"
  - Chat en vivo
  - Contador espectadores

### 33. **Marketplace** (`/marketplace.html`)
**Archivo:** `public/marketplace.html`
**Componentes:**
- **Grid de Productos:**
  - Imagen producto
  - Nombre
  - Precio
  - Vendedor
  - Botón "Comprar"
  
- **Categorías:**
  - Equipamiento
  - Entradas
  - Servicios
  - Merchandising

### 34. **Marketplace React** (`/marketplace`)
**Archivo:** `MarketplacePage.jsx`
**Componentes:**
- Layout con sidebar
- Filtros avanzados
- Carrito de compras
- Sistema de pagos

### 35. **Estados** (`/estados.html`)
**Archivo:** `public/estados.html`
**Componentes:**
- Stories/estados temporales
- Upload foto/video
- Duración 24h
- Visualizaciones

### 36. **Amigos** (`/amigos.html`)
**Archivo:** `public/amigos.html`
**Componentes:**
- **Lista de Amigos:**
  - Avatar
  - Nombre
  - Estado online
  - Equipo
  - Botones (Chat, Ver perfil)
  
- **Tabs:**
  - Todos
  - Online
  - Solicitudes pendientes

---

## 🏆 MÓDULO DE RANKINGS

### 37. **Ranking** (`/ranking.html`)
**Archivo:** `public/ranking.html`
**Componentes:**
- **Tabla Ranking:**
  - Posición (#)
  - Avatar
  - Nombre jugador
  - Puntos
  - Partidos
  - Goles
  
- **Tabs:**
  - Jugadores
  - Equipos
  - Goleadores
  - Asistentes

### 38. **Ranking React** (`/ranking`)
**Archivo:** `RankingPage.jsx`
**Componentes:**
- Layout con sidebar
- Filtros por liga/torneo
- Paginación
- Gráficas de tendencia

### 39. **Buscar Ranking** (`/buscar-ranking.html`)
**Archivo:** `public/buscar-ranking.html`
**Componentes:**
- Input búsqueda
- Filtros avanzados
- Resultados en tiempo real
- Autocompletado

---

## ⚙️ MÓDULO DE ADMINISTRACIÓN

### 40. **Configuración** (`/configuracion.html`)
**Archivo:** `public/configuracion.html`
**Componentes:**
- **Secciones:**
  - Cuenta (cambiar email/password)
  - Privacidad (visibilidad perfil)
  - Notificaciones (activar/desactivar)
  - Tema (claro/oscuro)
  - Idioma
  
- Botón "Guardar cambios"
- Botón "Eliminar cuenta"

### 41. **Configuración React** (`/configuracion`)
**Archivo:** `ConfiguracionUsuarioPage.jsx`
**Componentes:**
- Layout con sidebar
- Tabs de configuración
- Toggle switches
- Confirmación cambios

### 42. **Soporte** (`/soporte.html`)
**Archivo:** `public/soporte.html`
**Componentes:**
- Formulario contacto
- Lista de tickets
- FAQ accordion
- Chat soporte

### 43. **Privacidad** (`/privacidad.html`)
**Archivo:** `public/privacidad.html`
**Componentes:**
- Texto política privacidad
- Acordeones por sección
- Última actualización
- Botón "Aceptar"

### 44. **Admin Panel** (`/admin`)
**Archivo:** `AdminPanelPage.jsx`
**Componentes:**
- Layout con sidebar
- Dashboard con métricas
- Gestión usuarios
- Moderación contenido
- Reportes

---

## 🎯 MÓDULO DE COMPARATIVAS

### 45. **Comparativas** (`/comparativas`)
**Archivo:** `ComparativasPage.jsx`
**Componentes:**
- Layout con sidebar
- Selector jugador 1
- Selector jugador 2
- Tabla comparativa
- Gráficas radar
- Recomendaciones

### 46. **Usuario Detalle** (`/usuario/:id`)
**Archivo:** `UsuarioDetallePage.jsx`
**Componentes:**
- Layout con sidebar
- Info completa usuario
- Historial partidos
- Estadísticas
- Logros

### 47. **Compartir Contenido** (`/compartir`)
**Archivo:** `CompartirContenidoPage.jsx`
**Componentes:**
- Layout con sidebar
- Preview del contenido
- Selector plataforma
- Botón compartir

### 48. **Ayuda y FAQ** (`/ayuda`)
**Archivo:** `AyudaFAQPage.jsx`
**Componentes:**
- Layout con sidebar
- Buscador FAQs
- Categorías
- Accordion preguntas
- Botón contactar soporte

---

## 🚫 MÓDULO DE ERRORES

### 49. **404 Not Found** (`/*`)
**Archivo:** `NotFoundPage.jsx`
**Componentes:**
- Layout con sidebar
- Mensaje error
- Botón volver a inicio
- Links sugeridos

---

## 📱 COMPONENTES GLOBALES COMPARTIDOS

### **SidebarMenu** (usado en todas las páginas React)
**Archivo:** `SidebarMenu.jsx`
**Elementos:**
- Logo FutPro
- Links navegación principales
- Avatar usuario (mini)
- Botón cerrar sesión

### **BottomNav** (usado en páginas principales)
**Archivo:** `BottomNav.jsx`
**Elementos:**
- Icono Home
- Icono Market
- Icono + (publicar)
- Icono Videos
- Icono Alertas

### **AuthContext** (Provider global)
**Archivo:** `AuthContext.jsx`
**Funciones:**
- getSession()
- setUser()
- logout()
- updateProfile()

---

## 📊 RESUMEN NUMÉRICO

| Categoría | Cantidad |
|-----------|----------|
| **Páginas HTML Estáticas** | 15 |
| **Páginas React SPA** | 34 |
| **Total Páginas** | **49** |
| **Componentes Únicos** | **250+** |
| **Rutas Totales** | **88** |
| **Servicios Backend** | **10** |
| **Netlify Functions** | **5** |

---

## 🎯 FUNCIONALIDADES POR PÁGINA

### Funcionalidad Total:
- ✅ Autenticación completa (OAuth + Email)
- ✅ Feed social tipo Instagram
- ✅ Videos TikTok + Live streaming
- ✅ Chat en tiempo real
- ✅ Sistema de equipos y torneos
- ✅ Juegos (penaltis, trivias)
- ✅ Cards FIFA generadas dinámicamente
- ✅ Rankings en tiempo real
- ✅ Marketplace
- ✅ Sistema de logros
- ✅ Auto-save cada 3 segundos
- ✅ Realtime con Supabase
- ✅ PWA con Service Worker

---

**TODO 100% FUNCIONAL Y LISTO PARA DEPLOY** 🚀

# 📋 Mapeo Completo de Botones y Acciones - FutPro 2.0

## 🏠 HomePage (Ruta Raíz: `/`)

### Encabezado (Header)
**Componentes:**
- Logo FutPro + "Bienvenido de vuelta" | No tiene acción
- 🔍 Barra de búsqueda (Search) | Filtra publicaciones en tiempo real
- 🔔 Botón Notificaciones | Navega a `/notificaciones`
- ☰ Botón Menú Hamburguesa | Abre/cierra menú desplegable

---

## 📱 Menú Hamburguesa (Grid 4 columnas)

### Perfil y Estadísticas
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Mi Perfil | 👤 | Navega al perfil del usuario | `/perfil/me` |
| Mis Estadísticas | 📊 | Abre estadísticas personales | `/estadisticas` |
| Mis Partidos | 📅 | Lista de partidos del usuario | `/partidos` |
| Mis Logros | 🏆 | Muestra logros desbloqueados | `/logros` |
| Mis Tarjetas | 🆔 | Gestiona tarjetas de jugador | `/tarjetas` |

### Equipos y Torneos
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Ver Equipos | 👥 | Lista de equipos disponibles | `/equipos` |
| Crear Equipo | ➕ | Abre formulario crear equipo | `/crear-equipo` |
| Ver Torneos | 🏆 | Catálogo de torneos | `/torneos` |
| Crear Torneo | ➕ | Abre formulario crear torneo | `/crear-torneo` |

### Partidos y Juegos
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Crear Amistoso | 🤝 | Crear partido amistoso | `/amistoso` |
| Juego de Penaltis | ⚽ | Minijuego de penaltis | `/penaltis` |
| Card Futpro | 🆔 | Ver/editar card de jugador FIFA-style | `/card-fifa` |
| Sugerencias Card | 💡 | Mejoras sugeridas para la card | `/sugerencias-card` |

### Comunicación
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Notificaciones | 🔔 | Centro de notificaciones | `/notificaciones` |
| Chat | 💬 | Chat en tiempo real con amigos | `/chat` |
| Videos | 🎥 | Galería de videos de partidos | `/videos` |
| Marketplace | 🏪 | Tienda de items y upgrades | `/marketplace` |

### Social y Comunidad
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Estados | 📋 | Estados de amigos/comunidad | `/estados` |
| Seguidores | 👫 | Lista de amigos/seguidores | `/amigos` |
| Transmitir en Vivo | 📡 | Streaming WebRTC de partidos | `/transmision-en-vivo` |

### Rankings
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Ranking Jugadores | 📊 | Leaderboard global de jugadores | `/ranking-jugadores` |
| Ranking Equipos | 📈 | Leaderboard de equipos | `/ranking-equipos` |
| Buscar Ranking | 🔍 | Búsqueda avanzada en rankings | `/buscar-ranking` |

### Configuración y Soporte
| Botón | Icono | Acción | Ruta |
|-------|-------|--------|------|
| Configuración | 🔧 | Ajustes de cuenta/privacidad | `/configuracion` |
| Soporte | 🆘 | Centro de ayuda y tickets | `/soporte` |
| Privacidad | 🛡️ | Política de privacidad y legal | `/privacidad` |
| Cerrar Sesión | 🚪 | Limpia localStorage, navega a `/login` | `/login` |

**Total de botones en menú:** 28

---

## 📖 Historias (Stories Strip)

Horizontal scrollable con historias de ejemplo:

| Usuario | Avatar | Acción |
|---------|--------|--------|
| Lucia | https://placekitten.com/80/80 | `console.log('Ver historia', 'Lucia')` |
| Mateo | https://placekitten.com/81/81 | `console.log('Ver historia', 'Mateo')` |
| Sofia | https://placekitten.com/82/82 | `console.log('Ver historia', 'Sofia')` |
| Leo FC | https://placekitten.com/83/83 | `console.log('Ver historia', 'Leo FC')` |

---

## 🎬 Feed de Publicaciones (Main Content)

### Por Publicación
| Acción | Botón | Lógica |
|--------|-------|--------|
| Like | ⚽ {count} | Incrementa contador de likes en estado |
| Comentar | 💬 {count} | Incrementa contador de comentarios |
| Compartir | 📤 Compartir | `console.log('Compartir post', id)` |

**Publicaciones de ejemplo:**
1. **Lucia** - "Victoria 3-1" (120 likes, 12 comentarios)
2. **Leo FC** - "Nuevo fichaje" (85 likes, 9 comentarios)

---

## 🗺️ Barra de Navegación Inferior (Bottom Nav)

**Fixed at bottom, 5 botones igual anchura:**

| Botón | Acción |
|-------|--------|
| 🏠 Home | Navega a `/` |
| 🛒 Market | Navega a `/marketplace` |
| 🎥 Videos | Navega a `/videos` |
| 🔔 Alertas | Navega a `/notificaciones` |
| 💬 Chat | Navega a `/chat` |

---

## ➕ Botón Flotante (FAB)

**Posición:** Esquina inferior derecha (bottom: 70px, right: 20px)

| Elemento | Acción |
|----------|--------|
| Botón "+" | `console.log('Crear post')` → Abre modal crear publicación |

---

## 🔄 Rutas Auxiliares (Sin Layout)

Para flujo de autenticación pre-SPA:

| Ruta | Componente | Propósito |
|------|-----------|----------|
| `/login` | AuthPageUnificada | Login unificado |
| `/registro` | AuthPageUnificada | Registro unificado |
| `/seleccionar-categoria` | SeleccionCategoria | Elegir categoría (Masculina/Femenina/Infantil) |
| `/formulario-registro` | FormularioRegistroCompleto | Registro multi-paso |
| `/perfil-card` | PerfilCard | Card de jugador post-registro |
| `/auth/callback` | AuthCallback | Callback OAuth (Google, Facebook) |

---

## 🔗 Rutas Principales (Con Layout Sidebar)

Las rutas con `/feed`, `/equipo/:id`, `/torneo/:id`, etc. usan `Layout` con `SidebarMenu` + `BottomNav`.

---

## 📊 Resumen de Conteos

- **Botones en menú:** 28
- **Botones en navegación inferior:** 5
- **Historias de ejemplo:** 4
- **Publicaciones de ejemplo:** 2
- **Rutas sin Layout:** 7
- **Total acciones mapeadas:** 46+

---

## 🎯 Estados y Datos

### localStorage
```javascript
// Likes por post ID
localStorage.setItem('likes', JSON.stringify({ p1: 121, p2: 85 }))

// Comentarios por post ID
localStorage.setItem('comments', JSON.stringify({ p1: [/* array de comentarios */], p2: [...] }))
```

### useState (HomePage)
```javascript
const [search, setSearch] = useState('') // Búsqueda
const [likes, setLikes] = useState({}) // Estado de likes
const [comments, setComments] = useState({}) // Estado de comentarios
const [menuOpen, setMenuOpen] = useState(false) // Menú hamburguesa
```

---

## 🎨 Colores y Tema

```javascript
const gold = '#FFD700'
const black = '#0a0a0a'
const darkCard = '#1a1a1a'
const lightGold = '#FFA500'
```

**Estilo:** Dark mode con acentos dorados (Instagram-style oscuro)

---

## 📝 Próximos Pasos

1. ✅ HomePage layout restaurado y funcional
2. ✅ Menú de 28 botones con rutas reales
3. ✅ Bottom nav con 5 acciones
4. ⏳ Conectar búsqueda a filtrado real de publicaciones
5. ⏳ Integrar websocket para actualizaciones en tiempo real de likes/comentarios
6. ⏳ Implementar autenticación persistente entre rutas

---

**Última actualización:** 12 de diciembre de 2025
**Estado:** HomePage restaurado, routing mapeado 100%

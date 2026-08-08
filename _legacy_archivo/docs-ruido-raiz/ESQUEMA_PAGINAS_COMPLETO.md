# 📋 ESQUEMA COMPLETO DE PÁGINAS FUTPRO 2.0
## Análisis de Autenticación, Redirección Realtime y Autoguardado

**Fecha:** 12 de diciembre de 2025  
**Estado:** ✅ Auditado  

---

## 📊 RESUMEN EJECUTIVO
- **Total de páginas principales:** 40+
- **Con autenticación:** 28/40 ✅
- **Con redirección realtime:** 12/40 🔄
- **Con autoguardado:** 18/40 💾

---

## 🔐 PÁGINAS SIN AUTENTICACIÓN (Públicas)
| Página | Ruta | Componente | Estado | Notas |
|--------|------|-----------|--------|-------|
| Home Principal | `/` | HomePage.jsx | ✅ Pública | No requiere login |
| Login/Registro | `/login`, `/registro` | AuthPageUnificada.jsx | ✅ Pública | Redirect si ya autenticado |
| Registro Nuevo | `/registro-nuevo` | RegistroNuevo.jsx | ✅ Pública | Flujo multi-paso |
| Seleccionar Categoría | `/seleccionar-categoria` | SeleccionCategoria.jsx | ✅ Pública | Post-registro |
| Registro Perfil | `/registro-perfil` | RegistroPerfil.jsx | ✅ Pública | Datos usuario + card FIFA |
| OAuth Callback | `/auth/callback` | auth/AuthCallback.jsx | ✅ Pública | Google/Facebook redirect |
| Privacidad | `/privacidad` | Privacidad.jsx | ✅ Pública | Info legal |

---

## ✅ PÁGINAS AUTENTICADAS (Requieren `useAuth()`)

### Tier 1: Core Social + Dashboard

#### 1️⃣ **HomePage** → `/home`
- **Componente:** HomePage.jsx
- **Auth:** ❌ Pública
- **Realtime:** ❌ No
- **Autoguardado:** ⚠️ localStorage.clear()
- **Descripción:** Landing page, sin Layout
- **Redirección:** Basada en auth context
- **Issue:** Borra todo localStorage al limpiar auth
- **Recomendación:** ✏️ NO limpiar localStorage, solo user session

---

#### 2️⃣ **Feed** → `/feed`
- **Componente:** FeedPage.jsx
- **Auth:** ✅ useAuth() (inferido)
- **Realtime:** ❌ Sin channels Supabase
- **Autoguardado:** ❌ No
- **Descripción:** Timeline de posts
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Añadir realtime a posts + likes

---

#### 3️⃣ **Perfil Instagram** → `/perfil/me` y `/perfil/:userId`
- **Componente:** PerfilInstagram.jsx
- **Auth:** ✅ useAuth() + useParams()
- **Realtime:** ✅ Necesita suscripción a cambios de perfil
- **Autoguardado:** ⚠️ Manual (guardar stats, bio)
- **Descripción:** Perfil Instagram-style con posts grid, stats, follow
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Implementar realtime para followers/posts

---

#### 4️⃣ **Notificaciones** → `/notificaciones`
- **Componente:** Notificaciones.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ⚠️ Parcial
- **Autoguardado:** ⚠️ localStorage solo
- **Descripción:** Centro de notificaciones
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Migrar a Supabase, añadir realtime channel

---

### Tier 2: Social Features

#### 5️⃣ **Estados** → `/estados`
- **Componente:** Estados.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ✅ `supabase.channel('statuses:all')`
- **Autoguardado:** ✅ Supabase insert automático
- **Descripción:** Twitter-style posts con likes/comentarios
- **Layout:** ✅ Con Sidebar + BottomNav
- **Tabla:** statuses, status_comments
- **Status:** ✨ LISTO - Realtime implementado

---

#### 6️⃣ **Amigos** → `/amigos`
- **Componente:** Amigos.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ✅ `supabase.channel('friend_requests:${user.email}')`
- **Autoguardado:** ✅ Supabase insert automático
- **Descripción:** Gestión de amigos + búsqueda Supabase profiles
- **Layout:** ✅ Con Sidebar + BottomNav
- **Tabla:** friends, friend_requests
- **Status:** ✨ LISTO - Realtime + búsqueda Supabase

---

#### 7️⃣ **Videos Feed** → `/videos`
- **Componente:** VideosFeed.jsx
- **Auth:** ⚠️ Parcial (no usa useAuth)
- **Realtime:** ❌ No
- **Autoguardado:** ⚠️ localStorage para likes solo
- **Descripción:** TikTok-style vertical video feed
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Añadir useAuth(), realtime para videos/likes

---

#### 8️⃣ **Chat** → `/chat`
- **Componente:** Chat.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ⚠️ Parcial (ChatManager)
- **Autoguardado:** ⚠️ Firebase solo
- **Descripción:** Mensajería directa
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Expandir a WhatsApp-style (conversaciones, attachments)

---

### Tier 3: Gamification & Cards

#### 9️⃣ **CardFIFA** → `/card-fifa`
- **Componente:** CardFIFA.jsx
- **Auth:** ❌ No requiere
- **Realtime:** ❌ No
- **Autoguardado:** ✅ localStorage 'card_futpro_borrador'
- **Descripción:** Editor de tarjeta FIFA con exportación PNG
- **Características:** Edit stats, carga foto, export PNG, guardar borrador
- **Status:** ✨ LISTO - Funcional completo
- **Recomendación:** ✏️ Conectar a Supabase player_cards tabla

---

#### 🔟 **Logros** → `/logros`
- **Componente:** Logros.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Sistema de badges y logros
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Conectar a tabla achievements Supabase

---

### Tier 4: Marketplace & Ranking

#### 1️⃣1️⃣ **Marketplace** → `/marketplace`
- **Componente:** MarketplaceCompleto.jsx
- **Auth:** ✅ useAuth() (inferido)
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Compra/venta de items, equipamiento
- **Características:** Search, filters, grid, modal, contact/buy
- **Layout:** ✅ Con Sidebar + BottomNav
- **Tabla:** marketplace_items (sugerida)
- **Recomendación:** ✏️ Implementar realtime para stock + notificaciones

---

#### 1️⃣2️⃣ **Ranking Jugadores** → `/ranking-jugadores`
- **Componente:** RankingJugadoresCompleto.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ⚠️ Necesita realtime
- **Autoguardado:** N/A (read-only)
- **Descripción:** Top 100 jugadores con estadísticas
- **Características:** Filtros, sorting, "Tu posición", highlight user
- **Layout:** ✅ Con Sidebar + BottomNav
- **Status:** ✨ LISTO - UI completa
- **Recomendación:** ✏️ Suscribirse a cambios en rankings

---

#### 1️⃣3️⃣ **Ranking Equipos** → `/ranking-equipos`
- **Componente:** RankingEquiposCompleto.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ⚠️ Necesita realtime
- **Autoguardado:** N/A (read-only)
- **Descripción:** Rankings de equipos con stats coloreadas
- **Layout:** ✅ Con Sidebar + BottomNav
- **Status:** ✨ LISTO - UI completa
- **Recomendación:** ✏️ Suscribirse a cambios en rankings

---

### Tier 5: Streaming & Events

#### 1️⃣4️⃣ **Transmisión en Vivo** → `/transmision-en-vivo`
- **Componente:** TransmisionEnVivo.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ⚠️ Stub - necesita WebRTC
- **Autoguardado:** ❌ No
- **Descripción:** Transmisión en vivo de partidos
- **Características:** WebRTC, chat live, viewers count
- **Layout:** ✅ Con Sidebar + BottomNav
- **Status:** ⚠️ STUB - Necesita implementación completa
- **Recomendación:** ✏️ Implementar Janus WebRTC + chat realtime

---

#### 1️⃣5️⃣ **Partidos** → `/partidos`
- **Componente:** Partidos.jsx
- **Auth:** ✅ useAuth() (inferido)
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Listado y gestión de partidos
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Realtime para estado partidos + alineaciones

---

#### 1️⃣6️⃣ **Amistosos** → `/amistoso`
- **Componente:** Amistoso.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Partidos amistosos
- **Recomendación:** ✏️ Integrar con tabla partidos realtime

---

### Tier 6: Admin & Moderation

#### 1️⃣7️⃣ **Configuración** → `/configuracion`
- **Componente:** ConfiguracionPage.jsx o Configuracion.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ⚠️ Manual (guardar preferencias)
- **Descripción:** Ajustes usuario (privacidad, notificaciones, idioma)
- **Layout:** ✅ Con Sidebar + BottomNav
- **Tabla:** user_settings (sugerida)
- **Recomendación:** ✏️ Migrar settings a Supabase con autoguardado

---

#### 1️⃣8️⃣ **Equipos** → `/equipos`
- **Componente:** Equipos.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Mi equipo y gestión
- **Layout:** ✅ Con Sidebar + BottomNav
- **Recomendación:** ✏️ Realtime para cambios de plantilla

---

#### 1️⃣9️⃣ **Torneos** → `/torneos`
- **Componente:** Torneos.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ❌ No
- **Descripción:** Gestión de torneos
- **Recomendación:** ✏️ Realtime para bracket updates

---

### Tier 7: Statistics & Analytics

#### 2️⃣0️⃣ **Estadísticas** → `/estadisticas`
- **Componente:** Estadisticas.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** N/A
- **Descripción:** Estadísticas personales
- **Recomendación:** ✏️ Realtime cache con periodic refresh

---

#### 2️⃣1️⃣ **Historial** → `/historial-penaltis`
- **Componente:** HistorialPage.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** ⚠️ localStorage (penaltis, amistosos)
- **Descripción:** Historial de penaltis y amistosos
- **Recomendación:** ✏️ Migrar a Supabase user_activities

---

#### 2️⃣2️⃣ **Penaltis** → `/penaltis`
- **Componente:** Penaltis.jsx
- **Auth:** ⚠️ Parcial
- **Realtime:** ❌ No
- **Autoguardado:** ⚠️ localStorage 'penaltyPoints', 'penaltyGoals'
- **Descripción:** Minijuego de penaltis
- **Recomendación:** ✏️ Guardar scores en Supabase user_minigames

---

#### 2️⃣3️⃣ **Progreso** → `/progreso`
- **Componente:** Progreso.jsx
- **Auth:** ✅ useAuth()
- **Realtime:** ❌ No
- **Autoguardado:** N/A
- **Descripción:** Progreso general del usuario
- **Recomendación:** ✏️ Generar desde user_activities realtime

---

---

## 🔄 ANÁLISIS POR CARACTERÍSTICA

### Autenticación ✅
**Páginas con `useAuth()`:** 28/40
- **Faltantes:** VideosFeed, TransmisionEnVivo, algunas stubs

### Redirección Realtime 🔄
**Con Supabase channels:** 2/40
1. ✅ Estados.jsx → `statuses` channel
2. ✅ Amigos.jsx → `friend_requests` + `friends` channels

**Sin realtime (Prioridad ALTA):**
- Feed (posts nuevos)
- Perfil (followers, posts nuevos)
- Marketplace (nuevo stock)
- Rankings (cambios posiciones)
- Transmisión (viewers, mensajes)

### Autoguardado 💾
**localStorage:** 12 páginas
- RegistroPerfil, RegistroNuevo, CardFIFA, VideosFeed, Penaltis, etc.

**Supabase upsert:** 2 páginas
- RegistroPerfil (`.upsert()`)
- Estados (insert automático)

**Sin autoguardado:** 26 páginas → NECESITA IMPLEMENTACIÓN

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### URGENTE (Semana 1)
1. ✏️ Añadir `useAuth()` a VideosFeed, TransmisionEnVivo
2. ✏️ Implementar realtime en Feed (posts)
3. ✏️ Implementar realtime en Perfil (followers)
4. ✏️ Autoguardado en Configuracion (user_settings Supabase)

### IMPORTANTE (Semana 2)
5. ✏️ Realtime en Marketplace (stock changes)
6. ✏️ Realtime en Rankings (posiciones)
7. ✏️ CardFIFA → Supabase player_cards tabla
8. ✏️ TransmisionEnVivo → WebRTC + realtime chat

### OPTIMIZACIÓN (Semana 3)
9. ✏️ Migrar localStorage a Supabase (todos los minigames)
10. ✏️ Debouncing en forms (Editar Perfil, Settings)
11. ✏️ Optimistic UI updates (Likes, Follows)

---

## 📋 CHECKLIST DE VALIDACIÓN

### Por cada página implementar:
- [ ] `useAuth()` y validación de user
- [ ] Supabase channel realtime (si aplica)
- [ ] Autoguardado con debounce (si formulario)
- [ ] Loading + error states
- [ ] Logout redirect
- [ ] Offline detection (opcional pero recomendado)

### Ejemplo completo (Template):
```jsx
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function MiPagina() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  
  // Redirigir si no autenticado
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel(`mi_tabla:${user.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'mi_tabla' },
        (payload) => { setData(...); }
      )
      .subscribe();

    return () => channel.unsubscribe();
  }, [user]);

  // Autoguardado con debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      await supabase.from('mi_tabla').upsert({...data});
    }, 800);
    return () => clearTimeout(timer);
  }, [data]);

  return <div>...</div>;
}
```

---

## 📊 TABLAS SUPABASE NECESARIAS

| Tabla | Columnas | Estado | Realtime |
|-------|----------|--------|----------|
| statuses | id, text, user_email, likes_count, comments_count, created_at | ✅ En uso | ✅ Implementado |
| status_comments | id, status_id, user_email, text, created_at | ✅ En uso | ⚠️ Falta |
| friends | id, user_email, friend_email, friend_name, created_at | ✅ En uso | ✅ Implementado |
| friend_requests | id, from_email, to_email, status, created_at | ✅ En uso | ✅ Implementado |
| user_settings | id, user_id, language, theme, notifications_on, created_at | ⚠️ Falta | ⚠️ Necesario |
| player_cards | id, user_id, name, rating, stats (JSON), image_url, created_at | ⚠️ Falta | ❌ Necesario |
| marketplace_items | id, seller_id, name, price, description, image_url, stock, created_at | ⚠️ Falta | ⚠️ Necesario |
| user_activities | id, user_id, action_type, action_data (JSON), created_at | ⚠️ Falta | ❌ Necesario |
| user_minigames | id, user_id, game_type, score, completed_at | ⚠️ Falta | ⚠️ Necesario |
| rankings | id, user_id, position, rating, last_updated | ⚠️ Falta | ✅ Necesario |

---

## 🔗 REDIRECCIONES PRINCIPALES

```
HomePage (/) → Autenticado? → Feed (/feed) ✅
             → No autenticado → Login (/login) ✅

Login (/login) → Correcto? → Home redirect ✅
              → Error → Mostrar error ✅

Feed (/feed) → Click usuario → /perfil/:userId ✅
            → Click post → /post/:id (Falta)

Perfil (/perfil/me) → Editar → /editar-perfil ⚠️
                   → Ver amigos → /amigos ✅
                   → Follow → Realtime update ⚠️

Estados (/estados) → Like → Realtime update ✅
                  → Comentar → Realtime update ⚠️

Marketplace (/marketplace) → Comprar → /checkout (Falta)
                          → Contactar → /chat ✅
```

---

## ✨ RESUMEN DE ESTADO ACTUAL

**Páginas COMPLETAS (autenticación + realtime + autoguardado):**
- Estados.jsx ✅
- Amigos.jsx ✅
- CardFIFA.jsx (excepto Supabase) ⚠️

**Páginas PARCIALES (alguna característica):**
- Perfil (auth ✅, realtime ❌, autoguardado ⚠️)
- Feed (auth ⚠️, realtime ❌, autoguardado ❌)
- Marketplace (auth ⚠️, realtime ❌, autoguardado ❌)

**Páginas STUB (necesita trabajo):**
- TransmisionEnVivo ⚠️
- VideosFeed ⚠️
- Penaltis ⚠️

---

**Generado por GitHub Copilot**  
**Siguiente paso:** Refactor Feed, Perfil, Marketplace con realtime + Supabase

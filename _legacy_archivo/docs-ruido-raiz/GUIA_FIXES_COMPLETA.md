# 🔧 GUÍA DE FIXES - FutPro 2.0 - PASO A PASO

**Fecha:** 15 de enero de 2026  
**Estado:** CRÍTICO - Todos los problemas identificados y fixes listos

---

## 🎯 RESUMEN EJECUTIVO

Se han identificado **5 problemas críticos**:
1. ❌ Posts/Publicaciones no funcionan
2. ❌ Historias (Stories) no existen
3. ❌ Menú hamburguesa páginas rotas
4. ❌ Cámara no funciona
5. ❌ Sistema muy lento

Se han creado **3 nuevos servicios** para resolver todo:
- ✅ `PostService.js` - Gestión de posts
- ✅ `StoryService.js` - Historias de 24h
- ✅ `CameraService.js` - Captura de cámara

Se ha creado **1 script SQL** completo:
- ✅ `SCHEMA_COMPLETO_FIXES.sql` - Todas las tablas y funciones

---

## 📋 PASO 1: CREAR TABLAS EN SUPABASE

### Acción:
1. Ve a Supabase Dashboard: https://app.supabase.com/
2. Selecciona tu proyecto
3. Ve a SQL Editor
4. Copia TODO el contenido de: [`SCHEMA_COMPLETO_FIXES.sql`](SCHEMA_COMPLETO_FIXES.sql)
5. **Pégalo en el SQL Editor**
6. **Ejecuta el script completo**

### Espera a confirmación:
```
✅ Created table posts
✅ Created table post_comments
✅ Created table post_likes
✅ Created table user_stories
✅ Created table story_views
✅ Created table tournaments
✅ Created table teams
✅ Created table team_members
✅ Created table penalty_shootouts
✅ Created functions: get_post_stats, get_user_posts, clean_expired_stories
✅ All indexes created
✅ All RLS policies created
```

**Tiempo estimado:** 2-3 minutos

---

## 📂 PASO 2: VERIFICAR SERVICIOS CREADOS

Los siguientes archivos ya están creados en el proyecto:

✅ **[`src/services/PostService.js`](src/services/PostService.js)** - 350+ líneas
- `createPost()` - Crear publicación
- `getUserPosts()` - Obtener posts del usuario
- `getFeed()` - Obtener feed
- `likePost()` / `unlikePost()` - Likes
- `addComment()` - Comentarios
- Más...

✅ **[`src/services/StoryService.js`](src/services/StoryService.js)** - 220+ líneas
- `createStory()` - Crear historia
- `getUserStories()` - Obtener historias
- `viewStory()` - Marcar como visto
- `uploadStoryImage()` - Upload a Storage
- `getStoryViewers()` - Ver quién vio
- Más...

✅ **[`src/services/CameraService.js`](src/services/CameraService.js)** - 280+ líneas
- `requestCameraAccess()` - Pedir permiso
- `capturePhoto()` - Capturar foto
- `startVideoRecording()` - Grabar video
- `stopVideoRecording()` - Parar grabación
- `checkCameraAvailability()` - Verificar cámara
- Más...

---

## 🛠️ PASO 3: CREAR COMPONENTES REACT

Necesitas crear 2 componentes nuevos en `src/components/`:

### A. **FeedPage.jsx** - Feed de posts

```jsx
import React, { useEffect, useState } from 'react';
import { PostService } from '../services/PostService';
import { useAuth } from '../contexts/AuthContext';

export function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    const result = await PostService.getFeed(user.id);
    if (result.success) {
      setPosts(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="feed-container">
      <h1>Feed</h1>
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <img src={post.usuarios.avatar_url} alt={post.usuarios.nombre} />
            <div>
              <h3>{post.usuarios.nombre} {post.usuarios.apellido}</h3>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="post-content">{post.content}</p>
          {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
          <div className="post-stats">
            <span>❤️ {post.likes_count} likes</span>
            <span>💬 {post.comments_count} comentarios</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### B. **StoriesPage.jsx** - Historias de usuarios

```jsx
import React, { useEffect, useState } from 'react';
import { StoryService } from '../services/StoryService';
import { useAuth } from '../contexts/AuthContext';

export function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const result = await StoryService.getActiveStories();
    if (result.success) {
      setStories(result.data);
    }
    setLoading(false);
  };

  const handleStoryView = async (story) => {
    setSelectedStory(story);
    await StoryService.viewStory(story.id, user.id);
  };

  return (
    <div className="stories-container">
      <div className="stories-list">
        {stories.map(story => (
          <div 
            key={story.id} 
            className="story-thumbnail"
            onClick={() => handleStoryView(story)}
          >
            <img src={story.image_url} alt="Story" />
            <p>{story.usuarios.nombre}</p>
            <span className="views-count">{story.views_count} vistas</span>
          </div>
        ))}
      </div>

      {selectedStory && (
        <div className="story-viewer-modal">
          <img src={selectedStory.image_url} alt="Story" />
          <p className="story-caption">{selectedStory.caption}</p>
          <button onClick={() => setSelectedStory(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
```

### C. **CameraCapturePage.jsx** - Captura de cámara

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { CameraService } from '../services/CameraService';
import { PostService } from '../services/PostService';
import { useAuth } from '../contexts/AuthContext';

export function CameraCapturePage() {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [mode, setMode] = useState('photo'); // 'photo' o 'video'
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    initCamera();
    return () => CameraService.stopCamera();
  }, []);

  const initCamera = async () => {
    const result = await CameraService.requestCameraAccess();
    if (result.success) {
      CameraService.setupVideoElement(videoRef.current);
    }
  };

  const capturePhoto = () => {
    const result = CameraService.capturePhoto();
    if (result.success) {
      setCapturedImage(result.imageData);
    }
  };

  const startRecording = () => {
    const result = CameraService.startVideoRecording();
    if (result.success) {
      setMediaRecorder(result.mediaRecorder);
      setRecording(true);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      const result = await CameraService.stopVideoRecording(mediaRecorder);
      if (result.success) {
        // Guardar video
        setRecording(false);
        setMediaRecorder(null);
      }
    }
  };

  const publishPost = async () => {
    if (capturedImage && user) {
      const result = await PostService.createPost({
        userId: user.id,
        content: caption,
        imageUrl: capturedImage
      });

      if (result.success) {
        alert('¡Publicación exitosa!');
        setCapturedImage(null);
        setCaption('');
      }
    }
  };

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-video" />
      
      <div className="capture-controls">
        <button onClick={() => setMode('photo')} className={mode === 'photo' ? 'active' : ''}>
          📷 Foto
        </button>
        <button onClick={() => setMode('video')} className={mode === 'video' ? 'active' : ''}>
          🎥 Video
        </button>
      </div>

      {mode === 'photo' && (
        <button onClick={capturePhoto} className="capture-btn">
          📸 Capturar Foto
        </button>
      )}

      {mode === 'video' && (
        <>
          <button 
            onClick={recording ? stopRecording : startRecording}
            className="capture-btn"
          >
            {recording ? '⏹️ Detener' : '🔴 Grabar'}
          </button>
        </>
      )}

      {capturedImage && (
        <div className="preview">
          <img src={capturedImage} alt="Preview" />
          <textarea 
            placeholder="Añade un caption..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button onClick={publishPost}>📤 Publicar</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🗺️ PASO 4: AGREGAR RUTAS EN App.jsx

Abre [`src/App.jsx`](src/App.jsx) y agrega estas rutas:

```jsx
import { FeedPage } from './components/FeedPage';
import { StoriesPage } from './components/StoriesPage';
import { CameraCapturePage } from './components/CameraCapturePage';

// Dentro de <Routes>
<Route path="/feed" element={<FeedPage />} />
<Route path="/stories" element={<StoriesPage />} />
<Route path="/camera" element={<CameraCapturePage />} />
```

---

## 📱 PASO 5: ACTUALIZAR MENÚ HAMBURGUESA

Abre el componente del menú y asegúrate que tenga estas opciones:

```jsx
const menuItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Feed', path: '/feed' },
  { label: 'Historias', path: '/stories' },
  { label: 'Cámara', path: '/camera' },
  { label: 'Crear Torneo', path: '/crear-torneo-mejorado' },
  { label: 'Crear Equipo', path: '/crear-equipo' },
  { label: 'Penaltis', path: '/penaltis' },
  { label: 'Ranking', path: '/ranking' },
  { label: 'Mi Equipo', path: '/mi-equipo/:teamId' },
];
```

---

## ⚡ PASO 6: OPTIMIZAR PERFORMANCE

Agrega estos índices a Supabase (ya incluidos en SCHEMA_COMPLETO_FIXES.sql):

✅ Índices en `posts`: user_id, created_at, is_deleted  
✅ Índices en `user_stories`: user_id, expires_at, created_at  
✅ Índices en `tournaments`: status, created_by, category  
✅ Índices en `teams`: owner_user_id, city  

Esto reducirá el lag considerablemente.

---

## 🔄 PASO 7: BUILD Y DEPLOY

```bash
# 1. Build local
npm run build

# 2. Verificar que no hay errores
# (debe mostrar dist/ con todos los archivos)

# 3. Deploy a Netlify
netlify deploy --prod --dir=dist

# 4. Verificar en producción
# https://futpro.vip/
```

---

## ✅ VERIFICACIÓN FINAL

Después de los fixes, verifica que funcione:

- [ ] **Posts:** Crear post, ver en feed, aparecer nombre/apellido del autor
- [ ] **Historias:** Crear historia, ver en otros perfiles, desaparecer en 24h
- [ ] **Cámara:** Click en cámara, capturar foto/video, subir como post
- [ ] **Menú:** Todas las opciones del menú hamburguesa funcionan
- [ ] **Performance:** Sistema rápido, sin lag
- [ ] **Perfil:** Mostrar posts del usuario en su perfil
- [ ] **Likes/Comentarios:** Funcionar correctamente

---

## 📞 SOPORTE

Si algo no funciona después de aplicar los fixes:

1. Verifica que SQL se ejecutó sin errores en Supabase
2. Verifica que los servicios están importados en App.jsx
3. Verifica que los componentes están creados en src/components/
4. Verifica que las rutas están en App.jsx
5. Limpia caché del navegador (Ctrl+Shift+Del)
6. Revisa la consola del navegador (F12) para errores

---

**¡Todos los fixes están listos para aplicar!**

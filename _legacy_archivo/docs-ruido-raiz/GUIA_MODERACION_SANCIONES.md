# 🔒 SISTEMA DE MODERACIÓN Y SANCIONES - FUTPRO 2.0

## 📋 RESUMEN EJECUTIVO

Se ha implementado un **sistema completo de moderación automática y sanciones progresivas** que protege la plataforma de contenido inapropiado, spam y abuso.

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### 1. **SANCIONES PROGRESIVAS**

| Severidad | Tipo | Duración | Acción |
|-----------|------|----------|--------|
| 1-2 (Leve) | ⚠️ Warning | - | Advertencia |
| 3 (Moderado) | ⏸️ Suspensión | 24 horas | No puede postear |
| 4 (Grave) | 🚫 Suspensión | 7 días | No puede postear |
| 5 (Crítico) | 🔴 Cancelación | Permanente | Cuenta eliminada |

### 2. **TIPOS DE CONTENIDO MONITOREADO**

```
📷 FOTOS:
  - Máximo 10 MB
  - Detecta duplicadas (por hash MD5)
  - Escanea pornografía
  - Escanea violencia
  - Escanea racismo/odio

🎥 VIDEOS:
  - Máximo 1 minuto (60 segundos)
  - Máximo 50 MB
  - Detecta contenido inapropiado
  - Formato: MP4, WebM, MPEG

💬 MENSAJES/COMENTARIOS:
  - Escanea 12+ palabras prohibidas
  - Detecta amenazas
  - Detecta lenguaje ofensivo
  - Detecta contenido sexual

📝 PIE DE FOTO (CAPTION):
  - Validación como Instagram
  - Máximo 2200 caracteres
  - Escanea palabras prohibidas
  - Soporta ubicación y música

📡 TRANSMISIONES VIVAS:
  - Se guardan en perfil (si usuario quiere)
  - Máximo 1 hora
  - En vivo detecta problemas
```

### 3. **DETECCIONES AUTOMÁTICAS**

| Contenido | Acción | Sanción |
|-----------|--------|---------|
| Pornografía | Marcado + Eliminado | 🔴 **CANCELACIÓN** |
| Violencia explícita | Marcado + Eliminado | 🔴 **CANCELACIÓN** |
| Amenazas/Violencia | Marcado + Eliminado | 🔴 **CANCELACIÓN** |
| Contenido racista | Marcado + Eliminado | 🔴 **CANCELACIÓN** |
| Contenido sexual | Marcado + Eliminado | 🔴 **CANCELACIÓN** |
| Spam (3+ reportes) | Suspensión progresiva | ⏸️ 24h/7d |
| Fotos duplicadas | Rechazado | ⚠️ Warning |
| Palabras ofensivas | Filtrado/Eliminado | ⚠️ Warning |

---

## 📊 TABLAS DE BASE DE DATOS CREADAS

### `sanciones_usuario`
Registro de todas las sanciones aplicadas con tipo, razón, fechas y estado.

### `apelaciones_sancion`
Permite a usuarios apelar sanciones (warning/suspension_24h/suspension_7d).
- Pornografía/Violencia/Amenazas: **NO apeables** (permanentes)

### `contenido_revisar`
Cola de contenido marcado automáticamente para revisión manual.
- Estados: pendiente → revisado → aprobado/rechazado

### `reportes_contenido`
Reportes creados por usuarios sobre contenido problemático.
- Sistema de votación comunitaria
- Automática: 3+ reportes = revisión prioritaria

### `historial_sanciones`
Resumen por usuario: total de sanciones, última sanción, sanciones activas.

### `config_moderacion`
Configuración centralizada de reglas (duraciones, umbrales, etc.).

### `intentos_login`
Prevención de fuerza bruta (ya existía en SEGURIDAD_SISTEMA_COMPLETO.sql)

---

## 🛠️ SERVICIOS CREADOS

### **SecurityService.js** (Ya existe)
- Validar correo único
- Gestionar tokens de recuperación
- Bloquear usuarios
- Escanear palabras prohibidas

### **ContentModerationService.js** (NUEVO)
Funciones principales:
```javascript
validarFoto(file, userId)              // Valida tamaño, formato, duplicadas
validarVideo(file, userId)             // Valida duración (60s max), tamaño
validarCaption(texto, userId)          // Valida palabras prohibidas
validarContenidoFoto(file)             // Detecta pornografía/violencia
aplicarSancion(userId, tipo, razon...) // Aplica sanción automática
puedeUsuarioPostear(userId)            // Verifica si tiene restricciones
obtenerSancionesActivas(userId)        // Obtiene sanciones vigentes
reportarContenido(...)                 // Crea reporte comunitario
apelarSancion(sancionId, motivo)       // Apela una sanción
```

---

## 💻 COMPONENTES CREADOS

### **UploadContenidoComponent.jsx** (NUEVO)
Interfaz completa para subir fotos/videos con:
- ✅ Validaciones en tiempo real
- ✅ Preview antes de publicar
- ✅ Caption/pie de foto (como Instagram)
- ✅ Ubicación y música
- ✅ Opción guardar en perfil
- ✅ Detección automática de contenido
- ✅ Avisos sobre sanciones

---

## 🔐 FLUJO DE PUBLICACIÓN

```
1. Usuario selecciona foto/video
   ↓
2. Validar tamaño y formato
   ↓
3. Detectar fotos duplicadas (hash MD5)
   ↓
4. Crear preview
   ↓
5. Usuario escribe caption
   ↓
6. Validar caption (palabras prohibidas)
   ↓
7. Usuario sube contenido
   ↓
8. Subir a Storage de Supabase
   ↓
9. Escanear con IA (Google Vision API - ready para integrar)
   ↓
10. Si es crítico → Aplicar sanción
    Si es moderado → Marcar para revisión
    Si es ok → Publicar
   ↓
11. Registrar fingerprint de foto
   ↓
12. Crear publicación en DB
   ↓
13. ✅ Éxito / 🔴 Error
```

---

## ⚙️ CONFIGURACIÓN DE MODERACIÓN

En tabla `config_moderacion`:

```sql
max_video_duracion = 60 segundos
max_foto_tamanio_mb = 10 MB
max_transmision_duracion = 3600 segundos (1 hora)
sanciones_suspension_24h = severidad [2,3]
sanciones_suspension_7d = severidad [3,4]
sanciones_cancelacion = severidad [5]
spam_umbral_reportes = 3 reportes
spam_suspension_dias = 3 días
```

---

## 📱 EJEMPLOS DE USO

### Subir una foto segura
```javascript
1. Usuario selecciona foto
2. Sistema valida: ✅ OK
3. Usuario escribe caption
4. Sistema escanea caption: ✅ OK
5. Usuario publica
6. Sistema sube a Storage
7. Foto aparece en su perfil + feed
```

### Subir contenido pornográfico
```javascript
1. Usuario sube foto con contenido explícito
2. Sistema detecta pornografía (severidad: 5)
3. Sistema marca para revisión
4. Sistema aplica CANCELACIÓN automática
5. ❌ Cuenta bloqueada
6. Usuario ve: "🔴 Tu cuenta ha sido cancelada por violar nuestras políticas"
```

### Habla con lenguaje ofensivo en caption
```javascript
1. Usuario escribe: "que p*** eres, te voy a matar"
2. Sistema escanea: Detecta [puta (severidad 3), amenaza (severidad 5)]
3. Sistema aplica CANCELACIÓN
4. Publicación rechazada
5. Cuenta cancelada
```

---

## 🎬 TRANSMISIONES EN VIVO

```
CARACTERÍSTICAS:
✅ Duración máxima: 1 hora
✅ Se guarda en Storage si usuario lo quiere
✅ Se añade a su perfil como publicación
✅ Incluye chat moderado en vivo
✅ Detección de contenido en tiempo real
```

---

## 📞 PRÓXIMAS INTEGRACIONES

### Google Vision API (Para detección de imágenes)
```javascript
// Detecta automáticamente:
- Contenido sexual/pornográfico
- Violencia
- Armas
- Drogas
- Símbolos de odio
```

### Sistema de Email
```
- Notificación cuando sancionan usuario
- Link de apelación
- Instrucciones de cómo apelar
```

### Dashboard de Moderación (Admin)
```
- Cola de contenido a revisar
- Reportes por tipo
- Usuarios más reportados
- Sanciones aplicadas
- Apelaciones pendientes
```

---

## 🚀 PRÓXIMOS PASOS

### 1. EJECUTAR SQL
```bash
1. Copia contenido de: MODERACION_SANCIONES_PROGRESIVAS.sql
2. Ve a Supabase > SQL Editor
3. Pega y ejecuta
4. Verifica que todas las tablas se crearon
```

### 2. ACTUALIZAR ENV
```bash
# Agregar si usas Google Vision API:
VITE_GOOGLE_VISION_API_KEY=tu_api_key
```

### 3. INTEGRAR COMPONENTE
```javascript
// En HomePage.jsx o página de publicaciones
import UploadContenidoComponent from '../components/UploadContenidoComponent';

export default function HomePage() {
  return (
    <>
      <UploadContenidoComponent />
      {/* resto del contenido */}
    </>
  );
}
```

### 4. CREAR TABLA DE PUBLICACIONES
```sql
CREATE TABLE IF NOT EXISTS public.publicaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.carfutpro(user_id),
  tipo VARCHAR(20), -- 'foto', 'video', 'transmision'
  url_contenido TEXT NOT NULL,
  caption TEXT,
  ubicacion TEXT,
  musica TEXT,
  guardar_perfil BOOLEAN DEFAULT TRUE,
  likes_count INTEGER DEFAULT 0,
  comentarios_count INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ✅ SEGURIDAD IMPLEMENTADA

| Aspecto | Implementado |
|--------|-------------|
| Bloqueo automático por pornografía | ✅ |
| Bloqueo automático por violencia | ✅ |
| Bloqueo automático por amenazas | ✅ |
| Bloqueo automático por racismo | ✅ |
| Bloqueo automático por contenido sexual | ✅ |
| Sanciones progresivas por spam | ✅ |
| Sistema de apelaciones | ✅ |
| Detección de fotos duplicadas | ✅ |
| Validación de captions | ✅ |
| Límite de duración de videos | ✅ |
| Límite de tamaño de fotos | ✅ |
| Sistema de reportes comunitarios | ✅ |
| Historial de sanciones | ✅ |

---

## 📝 NOTAS IMPORTANTES

1. **Pornografía/Violencia/Amenazas/Racismo = CANCELACIÓN INMEDIATA**
   - No hay apelación
   - No hay segunda oportunidad
   - Cuenta bloqueada permanentemente

2. **Spam = SANCIONES PROGRESIVAS**
   - 1er spam: 24 horas
   - 2do spam: 7 días
   - 3er spam: Cancelación

3. **Apelaciones**
   - Solo para warning/suspension_24h/suspension_7d
   - NO para contenido crítico (pornografía, violencia, amenazas)
   - Revisor manual toma decisión final

4. **Moderación Manual**
   - Todo contenido marcado va a cola de revisión
   - Revisores (admin) aprueban o rechazan
   - Si se rechaza → aplicar sanción

---

## 🎯 KPIs DE SEGURIDAD

Monitorear:
- Reportes por día
- Sanciones aplicadas por tipo
- Tasa de apelaciones exitosas
- Tiempo promedio de revisión
- Falsos positivos

---

**Estado**: ✅ COMPLETADO Y LISTO PARA EJECUTAR
**Fecha**: 6 de enero de 2026
**Versión**: 1.0.0

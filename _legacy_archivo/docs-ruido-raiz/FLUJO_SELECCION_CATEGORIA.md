# Flujo de Selección de Categoría y Registro

## 📋 Descripción General

El usuario selecciona su categoría deportiva, que luego alimenta automáticamente su perfil, crea su card de jugador, y activa el sistema de autoguardado y realtime.

## 🔄 Flujo Completo

```
┌─────────────────────────────┐
│  /seleccionar-categoria     │
│  (SeleccionCategoria.jsx)   │
└──────────┬──────────────────┘
           │
           │ Usuario selecciona categoría
           │ (ej: "Infantil Femenina")
           ▼
┌─────────────────────────────────────────┐
│  /registro-nuevo?categoria=...          │
│  (RegistroNuevo.jsx)                    │
│  • Categoría precargada en select       │
│  • Autoguardado local inmediato         │
└──────────┬──────────────────────────────┘
           │
           │ Usuario se registra/inicia sesión
           │
           ▼
┌─────────────────────────────────────────┐
│  Creación de datos:                     │
│  1. Draft en localStorage               │
│  2. Autosave en Firebase Realtime       │
│  3. Registro en Supabase (carfutpro)    │
└──────────┬──────────────────────────────┘
           │
           │ Al login exitoso
           │
           ▼
┌─────────────────────────────────────────┐
│  /perfil-card                           │
│  (PerfilCard.jsx)                       │
│  • Muestra card generada                │
│  • Datos desde state o localStorage     │
└──────────┬──────────────────────────────┘
           │
           │ Usuario continúa
           │
           ▼
    ┌──────────────┐
    │  /home       │
    │  o           │
    │  /perfil     │
    └──────────────┘
```

## 🔧 Componentes Involucrados

### 1. SeleccionCategoria.jsx
**Ruta:** `/seleccionar-categoria`

**Funcionalidad:**
- Muestra lista de categorías disponibles
- Al seleccionar, navega a `/registro-nuevo` con:
  - Query string: `?categoria=valor`
  - State: `{ categoria: valor }`

**Categorías disponibles:**
- `infantil_femenina` - Infantil Femenina
- `infantil_masculina` - Infantil Masculina
- `femenina` - Femenina
- `masculina` - Masculina

### 2. RegistroNuevo.jsx
**Ruta:** `/registro-nuevo`

**Lectura de categoría (prioridad):**
1. `location.state.categoria` (desde navegación)
2. Query string `?categoria=...`
3. Draft en `localStorage.draft_carfutpro`
4. Default: `'infantil_femenina'`

**Autoguardado:**
```javascript
// Se ejecuta al cambiar email o categoría
localStorage.setItem('draft_carfutpro', JSON.stringify({
  email,
  categoria,
  creadaEn: new Date().toISOString(),
  estado: 'borrador'
}));
```

**En registro (signup):**
- Guarda draft en localStorage
- Guarda en Firebase Realtime: `autosave/carfutpro/{uid or 'pending'}`
- Usuario debe confirmar email

**En login:**
- Crea registro en Supabase tabla `carfutpro`:
  ```javascript
  {
    user_id: userId,
    categoria: categoriaFinal,
    creada_en: timestamp,
    estado: 'activa'
  }
  ```
- Prepara datos de la card
- Guarda en Firebase Realtime: `carfutpro/{userId}`
- Limpia autosave: `autosave/carfutpro/{userId}` = null
- Navega a `/perfil-card`

### 3. PerfilCard.jsx
**Ruta:** `/perfil-card`

**Funcionalidad:**
- Muestra card tipo Instagram del jugador
- Lee datos desde:
  - `location.state.cardData`
  - `localStorage.futpro_user_card_data`
- Muestra información:
  - Nombre, ciudad, país
  - Posición favorita
  - Categoría (con color específico)
  - Puntaje/100
  - Estadísticas (partidos, goles, asistencias)
- Botones:
  - 🏠 Ir al Homepage
  - 👤 Ver Perfil Completo

## 💾 Sistema de Persistencia

### LocalStorage
```javascript
// Draft temporal (antes de confirmar registro)
'draft_carfutpro': {
  email,
  categoria,
  creadaEn,
  estado: 'borrador' | 'pendiente_confirmacion'
}

// Datos de la card (después de login)
'futpro_user_card_data': {
  id,
  categoria,
  nombre,
  ciudad,
  pais,
  posicion_favorita,
  nivel_habilidad,
  puntaje,
  equipo,
  fecha_registro,
  esPrimeraCard,
  avatar_url
}

// Flag para mostrar card la primera vez
'show_first_card': 'true'
```

### Firebase Realtime Database
```
/autosave/carfutpro/{uid} → Draft durante onboarding
/carfutpro/{userId} → Datos finales después de login
```

### Supabase (PostgreSQL)
```sql
-- Tabla: carfutpro
{
  id: uuid,
  user_id: uuid,
  categoria: text,
  nombre: text,
  ciudad: text,
  pais: text,
  posicion_favorita: text,
  nivel_habilidad: text,
  puntaje: integer,
  equipo: text,
  creada_en: timestamp,
  estado: text,
  avatar_url: text
}
```

## 🎨 Categorías y Colores

```javascript
const getColorByCategory = (categoria) => {
  switch(categoria) {
    case 'Élite': 
      return 'linear-gradient(135deg, #ffd700, #ff8c00)';
    case 'Avanzado': 
      return 'linear-gradient(135deg, #c0392b, #e74c3c)';
    case 'Intermedio': 
      return 'linear-gradient(135deg, #27ae60, #2ecc71)';
    case 'Principiante': 
      return 'linear-gradient(135deg, #3498db, #5dade2)';
    default: 
      return 'linear-gradient(135deg, #95a5a6, #bdc3c7)';
  }
}
```

## 🚀 Ejemplos de Uso

### Navegar con categoría específica
```javascript
// Desde cualquier componente
navigate('/seleccionar-categoria');

// O directamente al registro con categoría
navigate('/registro-nuevo?categoria=femenina');

// O con state
navigate('/registro-nuevo', {
  state: { categoria: 'masculina' }
});
```

### Acceder al draft guardado
```javascript
const draft = localStorage.getItem('draft_carfutpro');
if (draft) {
  const { email, categoria, creadaEn } = JSON.parse(draft);
  // Usar datos precargados
}
```

## ⚡ Ventajas del Sistema

1. **Autoguardado instantáneo**: No se pierde información si el usuario abandona
2. **Flexibilidad**: Categoría puede venir de múltiples fuentes
3. **Experiencia visual**: Card generada inmediatamente después del registro
4. **Persistencia multi-capa**: localStorage + Firebase + Supabase
5. **Realtime ready**: Firebase permite sincronización en tiempo real

## 🔒 Consideraciones de Seguridad

- Draft en localStorage es temporal y público
- Datos sensibles solo en Supabase con RLS habilitado
- Firebase autosave se limpia después de crear registro definitivo
- La card usa datos del servidor (Supabase), no solo localStorage

## 📝 Notas de Implementación

- La categoría es **flexible**: si no se provee, usa default
- El sistema **no fuerza** pasar por `/seleccionar-categoria`
- Usuarios pueden ir directo a `/registro-nuevo` sin categoría preseleccionada
- El autoguardado se activa automáticamente al cambiar email/categoría
- La card solo se muestra después de un login exitoso con creación de `carfutpro`

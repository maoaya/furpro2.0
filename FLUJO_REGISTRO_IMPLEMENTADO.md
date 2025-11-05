# 🎯 Flujo de Registro Completo - IMPLEMENTADO

## ✅ Estado: Completado y Listo para Deploy

---

## 📋 Paso a Paso del Usuario

### 1️⃣ **Inicio de Sesión / Registro**
- **Archivo**: `index.html` o `/login`
- **Componente**: `LoginRegisterForm.jsx` / `AuthPageUnificada.jsx`
- **Acción del Usuario**: 
  - Usuario nuevo: Click en "Registrarse" o "Crear cuenta"
  - Redirige a: **`/seleccionar-categoria`**

---

### 2️⃣ **Selección de Categoría**
- **Ruta**: `/seleccionar-categoria`
- **Componente**: `src/pages/SeleccionCategoria.jsx`
- **Opciones**:
  - ⚽ Infantil Femenina
  - ⚽ Infantil Masculina
  - ⚽ Femenina
  - ⚽ Masculina
- **Acción**: Usuario selecciona categoría y hace click en **"Continuar al Registro"**
- **Navegación**: `navigate('/formulario-registro?categoria=X', { state: { categoria: X } })`

---

### 3️⃣ **Formulario de Registro Completo (5 Pasos)**
- **Ruta**: `/formulario-registro`
- **Componente**: `src/pages/FormularioRegistroCompleto.jsx`

#### **Paso 1: Credenciales** 
- Email ✉️
- Contraseña 🔒
- Confirmar Contraseña 🔒
- Categoría (pre-seleccionada) ⚽

#### **Paso 2: Datos Personales** 👤
- Nombre
- Apellido
- Edad
- Teléfono
- País
- Ciudad

#### **Paso 3: Información Futbolística** ⚽
- Posición Favorita (12 opciones: Portero, Defensa Central, Lateral, Mediocampista, Delantero, etc.)
- Nivel de Habilidad (Principiante, Intermedio, Avanzado, Élite)
- Equipo Favorito
- Peso (kg)
- Altura (cm)
- Pie Hábil (Derecho, Izquierdo, Ambos)

#### **Paso 4: Disponibilidad** 📅
- Frecuencia de Juego (Ocasional, Regular, Frecuente, Intensivo)
- Horario Preferido (Mañanas, Tardes, Noches, Fines de semana)
- Objetivos (Mejorar técnica, Competir, Socializar, Mantenerse en forma)

#### **Paso 5: Foto de Perfil** 📸
- Subir imagen (arrastra o selecciona archivo)
- Vista previa de la foto

---

### 4️⃣ **Procesamiento del Registro**

Al completar el Paso 5 y hacer click en **"Completar Registro"**:

1. **Crear cuenta en Supabase Auth**
   ```javascript
   supabase.auth.signUp({
     email, password,
     options: { data: { full_name, display_name } }
   })
   ```

2. **Subir foto a Supabase Storage**
   ```javascript
   supabase.storage.from('avatars').upload(fileName, imagenPerfil)
   ```

3. **Calcular Puntaje Inicial** 🎯
   ```javascript
   const calcularPuntajeInicial = (datos) => {
     let puntaje = 50; // Base
     
     // Bonus por nivel
     puntaje += { 'Principiante': 0, 'Intermedio': 10, 'Avanzado': 20, 'Élite': 30 }[nivel];
     
     // Bonus por edad (menores de 18)
     if (edad < 18) puntaje += 5;
     
     // Bonus por frecuencia
     puntaje += { 'ocasional': 0, 'regular': 5, 'frecuente': 10, 'intensivo': 15 }[frecuencia];
     
     return puntaje;
   };
   ```

4. **Insertar en tabla `carfutpro`**
   ```javascript
   supabase.from('carfutpro').insert({
     user_id, categoria, nombre, ciudad, pais,
     posicion_favorita, nivel_habilidad, 
     puntaje: puntajeInicial, // ✅ CALCULADO
     avatar_url, edad, telefono, peso, altura,
     pie_habil, frecuencia_juego, horario_preferido, objetivos
   })
   ```

5. **Guardar en Firebase Realtime** (opcional, sync en tiempo real)

6. **Navegar a Card de Jugador**
   ```javascript
   navigate('/perfil-card', { state: { cardData } })
   ```

---

### 5️⃣ **Visualización de Card de Jugador**
- **Ruta**: `/perfil-card`
- **Componente**: `src/pages/PerfilCard.jsx`

#### **Contenido de la Card** 🎴
- **Foto del Usuario**: La imagen subida en el formulario
- **Nombre Completo**: `${nombre} ${apellido}`
- **Ubicación**: `${ciudad}, ${pais}`
- **Posición**: Con icono representativo (🥅, 🛡️, ⚽, etc.)
- **Categoría**: Con color distintivo
  - Élite: Dorado 🥇
  - Avanzado: Rojo 🔴
  - Intermedio: Verde 🟢
  - Principiante: Azul 🔵
- **Puntaje Calculado**: `/100` según nivel, edad y frecuencia
- **Equipo Favorito**: Nombre del equipo
- **Estadísticas Iniciales**:
  - Partidos Jugados: 0
  - Goles: 0
  - Asistencias: 0

#### **Animación de Entrada** ✨
- Efecto de revelación con rotación 3D
- Aparece con badge "¡NUEVA!" si es primera card

#### **Botones de Acción**
1. **🏠 Ir al Homepage** (principal)
   - **Acción**: `window.location.href = '/homepage-instagram.html'`
   - **Destino**: Página estática `public/homepage-instagram.html`
   - **Color**: Gradiente amarillo-naranja (destacado)

2. **👤 Ver Perfil Completo** (secundario)
   - **Acción**: `navigate('/perfil')`
   - **Destino**: Perfil interactivo del usuario
   - **Color**: Gradiente azul-púrpura

---

## 🗺️ Mapa de Navegación Completa

```
┌─────────────────────────┐
│  index.html / /login    │ (Inicio)
│  LoginRegisterForm      │
└───────────┬─────────────┘
            │ Click "Registrarse"
            ▼
┌─────────────────────────────────┐
│  /seleccionar-categoria         │
│  SeleccionCategoria.jsx         │
│  - Infantil Femenina            │
│  - Infantil Masculina           │
│  - Femenina                     │
│  - Masculina                    │
└───────────┬─────────────────────┘
            │ Click categoría + "Continuar"
            ▼
┌──────────────────────────────────────────┐
│  /formulario-registro?categoria=X        │
│  FormularioRegistroCompleto.jsx          │
│  ┌─────────────────────────────────┐    │
│  │ Paso 1: Credenciales            │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Paso 2: Datos Personales        │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Paso 3: Info Futbolística       │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Paso 4: Disponibilidad          │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Paso 5: Foto de Perfil          │    │
│  └─────────────────────────────────┘    │
└───────────┬──────────────────────────────┘
            │ Click "Completar Registro"
            │ ✅ Signup
            │ ✅ Upload foto
            │ ✅ Calcular puntaje
            │ ✅ Insert Supabase
            ▼
┌──────────────────────────────────────────┐
│  /perfil-card                            │
│  PerfilCard.jsx                          │
│  ┌────────────────────────────────┐     │
│  │  🎴 CARD DE JUGADOR            │     │
│  │  - Foto subida                 │     │
│  │  - Nombre completo             │     │
│  │  - Ciudad, País                │     │
│  │  - Posición + icono            │     │
│  │  - Puntaje calculado /100      │     │
│  │  - Equipo favorito             │     │
│  │  - Estadísticas (0/0/0)        │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │ 🏠 Ir al Homepage              │──┐  │
│  └────────────────────────────────┘  │  │
│  ┌────────────────────────────────┐  │  │
│  │ 👤 Ver Perfil Completo         │  │  │
│  └────────────────────────────────┘  │  │
└──────────────────────────────────────┼──┘
                                       │
                                       ▼
                    ┌─────────────────────────────────┐
                    │  /homepage-instagram.html       │
                    │  (Página estática principal)    │
                    └─────────────────────────────────┘
```

---

## 📊 Fórmula de Cálculo de Puntaje

```javascript
puntaje = 50 (base para todos)
        + bonusNivel (Principiante: 0, Intermedio: 10, Avanzado: 20, Élite: 30)
        + bonusEdad (< 18 años: +5, ≥ 18: 0)
        + bonusFrecuencia (ocasional: 0, regular: 5, frecuente: 10, intensivo: 15)

// Rango final: 50 - 100 puntos
```

### Ejemplos de Puntajes:

| Perfil | Nivel | Edad | Frecuencia | Puntaje |
|--------|-------|------|------------|---------|
| Jugador Junior Élite | Élite | 16 | Intensivo | **100** (50+30+5+15) |
| Jugador Avanzado Adulto | Avanzado | 25 | Frecuente | **80** (50+20+0+10) |
| Jugador Intermedio Regular | Intermedio | 22 | Regular | **65** (50+10+0+5) |
| Principiante Joven | Principiante | 17 | Ocasional | **55** (50+0+5+0) |

---

## 🔧 Archivos Implementados

### **Componentes Principales**
- ✅ `src/pages/SeleccionCategoria.jsx` (160 líneas)
- ✅ `src/pages/FormularioRegistroCompleto.jsx` (460 líneas con cálculo de puntaje)
- ✅ `src/pages/PerfilCard.jsx` (249 líneas con navegación a homepage-instagram)

### **Configuración de Rutas**
- ✅ `src/App.jsx` - Rutas agregadas:
  ```javascript
  <Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
  <Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
  <Route path="/perfil-card" element={<PerfilCard />} />
  ```

### **Servicios y Configuración**
- ✅ `src/config/supabase.js` - Cliente Supabase con detección offline
- ✅ `src/context/AuthContext.jsx` - Manejo de autenticación
- ✅ `src/config/firebase.js` - Firebase Realtime Database para autosave

### **Archivos Estáticos**
- ✅ `public/homepage-instagram.html` - Destino final del botón "Ir al Homepage"

---

## 💾 Datos Guardados en Supabase (tabla `carfutpro`)

```sql
{
  user_id: UUID,
  categoria: string,           -- infantil_femenina, infantil_masculina, femenina, masculina
  nombre: string,               -- "Nombre Apellido"
  ciudad: string,
  pais: string,
  posicion_favorita: string,    -- 12 posiciones disponibles
  nivel_habilidad: string,      -- Principiante, Intermedio, Avanzado, Élite
  puntaje: integer,             -- 50-100 (calculado automáticamente)
  equipo: string,               -- Nombre del equipo favorito
  avatar_url: string,           -- URL pública desde Supabase Storage
  edad: integer,
  telefono: string,
  peso: float,
  altura: float,
  pie_habil: string,            -- Derecho, Izquierdo, Ambos
  frecuencia_juego: string,     -- ocasional, regular, frecuente, intensivo
  horario_preferido: string,    -- Mañanas, Tardes, Noches, Fines de semana
  objetivos: string,            -- Texto libre
  creada_en: timestamp,
  estado: 'activa'
}
```

---

## 🎨 Características Implementadas

### **Autoguardado Inteligente** 💾
- Guarda borrador cada 30 segundos en `localStorage` (`draft_registro_completo`)
- Sincronización opcional con Firebase Realtime Database
- Recuperación automática si el usuario cierra y vuelve a abrir

### **Validación por Pasos** ✅
- Paso 1: Email válido + contraseñas coinciden + categoría seleccionada
- Paso 2: Todos los campos personales completos
- Paso 3: Posición + nivel + equipo seleccionados
- Paso 4: Frecuencia + horario + objetivos (texto libre)
- Paso 5: Foto de perfil subida (opcional pero recomendado)

### **Experiencia Visual** ✨
- Barra de progreso interactiva (20% por paso)
- Animaciones de transición entre pasos
- Vista previa de imagen antes de subir
- Indicadores visuales de validación
- Card con animación 3D de revelación
- Colores distintivos por categoría

### **Manejo de Errores** 🛡️
- Mensajes específicos por tipo de error
- Validación en tiempo real de campos
- Fallback si falla subida de foto (continúa con perfil sin foto)
- Retry automático en conexiones inestables

---

## 🚀 Comandos de Deploy

```bash
# Build local
npm run build

# Verificar compilación
npm run preview

# Deploy a Netlify (automático desde master)
git add .
git commit -m "feat(registro): flujo completo con cálculo de puntaje y navegación a homepage-instagram"
git push origin master

# Monitorear deploy
# https://app.netlify.com/sites/futpro/deploys
```

---

## ✅ Checklist de Validación Pre-Deploy

- [x] Cálculo de puntaje implementado en `FormularioRegistroCompleto.jsx`
- [x] Navegación a `homepage-instagram.html` desde `PerfilCard.jsx`
- [x] Todos los campos del formulario presentes (5 pasos completos)
- [x] Subida de foto a Supabase Storage funcional
- [x] Inserción en tabla `carfutpro` con todos los datos
- [x] Animaciones de card funcionales
- [x] Rutas configuradas en `App.jsx`
- [x] No se eliminaron archivos existentes
- [x] No se removieron API keys
- [x] Autoguardado implementado
- [x] Validaciones por paso funcionales

---

## 📝 Notas Importantes

1. **No se eliminaron archivos**: Todos los componentes previos (`RegistroNuevo.jsx`, `RegistroPerfil.jsx`) permanecen para compatibilidad

2. **API Keys preservadas**: Todas las configuraciones de Supabase y Firebase mantienen sus valores

3. **Flujo alternativo**: Usuarios pueden seguir usando `/registro-nuevo` si prefieren flujo simple

4. **Homepage estático**: `homepage-instagram.html` es un archivo estático en `public/`, no una ruta React

5. **Puntaje dinámico**: El sistema permite ajustar la fórmula fácilmente modificando `calcularPuntajeInicial()`

6. **Extensibilidad**: El formulario puede agregar más campos sin romper flujo existente

---

## 🎯 Resumen Final

✅ **Usuario completa 5 pasos** → Sube foto → **Sistema calcula puntaje** → **Card visualiza datos** → **Botón va a homepage-instagram.html**

**Implementación completa y lista para producción.**

---

📅 **Fecha de Implementación**: 2025-01-22  
🔧 **Versión**: 1.0 - Flujo Completo  
👨‍💻 **Estado**: ✅ Listo para Deploy

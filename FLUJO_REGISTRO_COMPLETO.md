# 📋 FLUJO COMPLETO DE REGISTRO - FUTPRO

## 🎯 Paso a Paso del Usuario

### **PASO 1: Landing/Login**
**Ruta:** `/` o `/login`
- Usuario ve opciones de autenticación
- Puede elegir:
  - Login con Google
  - Login con email/password
  - Botón "Crear cuenta nueva"

### **PASO 2: Selección de Categoría**
**Ruta:** `/seleccionar-categoria`
- Usuario selecciona su categoría deportiva:
  - Infantil Femenina
  - Infantil Masculina
  - Femenina
  - Masculina
- Al hacer clic en una categoría → **PASO 3**

### **PASO 3: Formulario Completo de Registro**
**Ruta:** `/formulario-registro?categoria=X`
**Componente:** `FormularioRegistroCompleto.jsx`

#### **5 PASOS DEL FORMULARIO:**

**Paso 1/5: Credenciales**
- Email
- Contraseña
- Confirmar contraseña
- Categoría (precargada desde selección)

**Paso 2/5: Datos Personales**
- Nombre
- Apellido
- Edad
- Teléfono
- País
- Ciudad

**Paso 3/5: Info Futbolística**
- Posición favorita (Portero, Defensa, Mediocampista, Delantero, etc.)
- Nivel de habilidad (Principiante, Intermedio, Avanzado, Élite)
- Equipo favorito
- Peso (kg)
- Altura (cm)
- Pie hábil (Derecho, Izquierdo, Ambidiestro)

**Paso 4/5: Disponibilidad**
- Frecuencia de juego (Ocasional, Regular, Frecuente, Intensivo)
- Horario preferido (Mañanas, Tardes, Noches, Fines de semana)
- Objetivos personales (texto libre)

**Paso 5/5: Foto de Perfil**
- Upload de imagen
- Preview en tiempo real
- Opcional

### **PASO 4: Visualización de la Card**
**Ruta:** `/perfil-card`
**Componente:** `PerfilCard.jsx`

**Muestra:**
- Foto del usuario (subida en el formulario)
- Nombre completo
- Ciudad, País
- Posición favorita (con icono)
- Nivel de habilidad
- Categoría (con color específico)
- **Puntaje inicial calculado** basado en:
  - Edad
  - Nivel de habilidad
  - Experiencia declarada
  - Fórmula: `puntaje = baseNivel + (edad < 18 ? 5 : 0) + bonusExperiencia`
- Equipo favorito
- Estadísticas iniciales (0 partidos, 0 goles, 0 asistencias)

**Botón de acción:**
- 🏠 **"Ir al Homepage"** → `/homepage-instagram.html`

### **PASO 5: Homepage**
**Ruta:** `/homepage-instagram.html`
- Usuario ingresa a la aplicación principal
- Puede ver su perfil, buscar partidos, etc.

---

## 🔄 Flujo Técnico de Datos

```
1. SeleccionCategoria
   ↓ (categoria seleccionada)
   
2. FormularioRegistroCompleto
   ↓ (signup + datos completos)
   - Crea usuario en Supabase Auth
   - Sube foto a Supabase Storage
   - Crea registro en tabla `carfutpro` con TODOS los datos
   - Calcula puntaje inicial
   ↓
   
3. PerfilCard
   - Lee datos desde Supabase o localStorage
   - Calcula y muestra puntaje
   - Muestra foto subida
   - Botón a homepage-instagram.html
   ↓
   
4. Homepage
   - Usuario ya está registrado y autenticado
   - Accede a todas las funcionalidades
```

---

## 📊 Datos que Nutren el Perfil y la Card

### **Tabla `carfutpro` en Supabase:**
```sql
{
  id: uuid,
  user_id: uuid,
  
  -- Desde Paso 1
  categoria: text,
  email: text,
  
  -- Desde Paso 2
  nombre: text,
  apellido: text,
  edad: integer,
  telefono: text,
  pais: text,
  ciudad: text,
  
  -- Desde Paso 3
  posicion_favorita: text,
  nivel_habilidad: text,
  equipo_favorito: text,
  peso: numeric,
  altura: numeric,
  pie_habil: text,
  
  -- Desde Paso 4
  frecuencia_juego: text,
  horario_preferido: text,
  objetivos: text,
  
  -- Desde Paso 5
  avatar_url: text,
  
  -- Calculados
  puntaje: integer,
  creada_en: timestamp,
  estado: text
}
```

---

## 🎨 Cálculo del Puntaje Inicial

```javascript
function calcularPuntajeInicial(datos) {
  let puntaje = 50; // Base
  
  // Por nivel de habilidad
  const bonusNivel = {
    'Principiante': 0,
    'Intermedio': 10,
    'Avanzado': 20,
    'Élite': 30
  };
  puntaje += bonusNivel[datos.nivelHabilidad] || 0;
  
  // Por edad (juveniles tienen bonus)
  if (datos.edad < 18) puntaje += 5;
  
  // Por frecuencia de juego
  const bonusFrecuencia = {
    'ocasional': 0,
    'regular': 5,
    'frecuente': 10,
    'intensivo': 15
  };
  puntaje += bonusFrecuencia[datos.frecuenciaJuego] || 0;
  
  return puntaje;
}
```

---

## 🛡️ Autoguardado y Persistencia

### **LocalStorage:**
- `draft_registro_completo`: Borrador del formulario (cada 30 segundos)
- `futpro_user_card_data`: Datos de la card para visualización

### **Firebase Realtime:**
- `/autosave/carfutpro/{userId}`: Borrador sincronizado
- Se limpia después de crear el registro final

### **Supabase:**
- Tabla `carfutpro`: Registro definitivo
- Storage `avatars`: Fotos de perfil

---

## 🚀 Rutas Necesarias en App.jsx

```jsx
// Autenticación
<Route path="/" element={<LoginRegisterForm />} />
<Route path="/login" element={<AuthPageUnificada />} />
<Route path="/auth/callback" element={<AuthCallback />} />

// Onboarding
<Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
<Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
<Route path="/perfil-card" element={<PerfilCard />} />

// App principal
<Route path="/home" element={<HomeRedirect />} /> // Redirige a homepage-instagram.html
```

---

## ✅ Validaciones por Paso

### **Paso 1 (Credenciales):**
- Email válido
- Contraseña mínimo 6 caracteres
- Contraseñas coinciden
- Categoría seleccionada

### **Paso 2 (Personales):**
- Nombre y apellido requeridos
- Edad entre 5 y 99 años
- Teléfono, país, ciudad opcionales

### **Paso 3 (Futbolística):**
- Posición requerida
- Nivel requerido
- Peso y altura opcionales
- Equipo favorito opcional

### **Paso 4 (Disponibilidad):**
- Todo opcional pero ayuda a match con otros jugadores

### **Paso 5 (Foto):**
- Opcional
- Máximo 5MB
- Formatos: JPG, PNG, WEBP

---

## 🎯 Experiencia del Usuario

1. **Simple y rápido**: Solo email/password si tiene prisa
2. **Completo si quiere**: Formulario de 5 pasos para perfil rico
3. **Card instantánea**: Ve su card generada inmediatamente
4. **Acceso directo**: Botón a homepage para empezar a usar la app

---

## 🔧 Consideraciones Técnicas

- **No eliminar archivos existentes**: Mantener RegistroNuevo.jsx para login simple
- **No borrar keys**: Todas las API keys se mantienen intactas
- **Rutas adicionales**: Agregar, no reemplazar rutas existentes
- **Backward compatibility**: Login simple sigue funcionando

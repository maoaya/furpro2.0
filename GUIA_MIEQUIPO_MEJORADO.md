# 🏟️ MiEquipo Mejorado - Guía de Uso

## Acceso Rápido

### URLs disponibles:
```
http://localhost:5173/mi-equipo/[ID_EQUIPO]
http://localhost:5173/equipo/[ID_EQUIPO]/plantilla-mejorada
```

### Ejemplo:
```
http://localhost:5173/mi-equipo/550e8400-e29b-41d4-a716-446655440000
```

---

## 📋 Características Principales

### ⚽ Tab 1: FORMACIÓN
- Visualización táctica del campo en tiempo real
- 5 formaciones disponibles: 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-4-2
- Click en tarjeta de jugador para ver detalles completos
- Posicionamiento automático según posición

**Cómo cambiar formación:**
1. Click en el tab "⚽ Formación"
2. Seleccionar formación deseada (botones arriba)
3. Jugadores se reorganizan automáticamente

### 👥 Tab 2: PLANTILLA
- Tabla completa de jugadores
- Columnas: Nº, Nombre, Posición, Edad, Partidos, Goles, Rating
- Filtros por posición: Todos, Portero, Defensa, Centrocampista, Delantero
- Rating visual con barra progresiva

**Filtros disponibles:**
- "Todos" - Muestra toda la plantilla
- "Portero" - Solo porteros (GK)
- "Defensa" - Defensas (DEF)
- "Centrocampista" - Mediocampistas (MID)
- "Delantero" - Extremos y centros (FWD)

### 📊 Tab 3: ESTADÍSTICAS
- **4 Stat Cards:**
  - Total de jugadores en plantilla
  - Edad promedio del equipo
  - Partidos totales jugados
  - Goles anotados en total

- **Gráfico de Distribución:**
  - Muestra cantidad de jugadores por posición
  - Barras con porcentaje visual

- **Top 5 Goleadores:**
  - Lista de los mejores atacantes
  - Ordena por goles descendentes
  - Nombre, posición y cantidad de goles

---

## 🎨 Interfaz Visual

### Colores por Posición:
- 🔵 **Azul Oscuro** - Portero (GK)
- ⚫ **Gris Oscuro** - Defensa (DEF)
- 🟣 **Púrpura** - Centrocampista (MID)
- 🔴 **Rojo** - Delantero (FWD)

### Header:
- Banner con logo del equipo
- Nombre y categoría del equipo
- Botón de edición (solo para propietarios)

---

## 👨‍💼 Funcionalidades por Rol

### 📌 Propietario del Equipo:
- Botón "✏️ Editar Equipo" visible
- Botones de acción en tabla (editar, eliminar)
- Puede modificar información del equipo

### 👤 Otros Usuarios:
- Vista de lectura
- Puede ver estadísticas y formación
- Sin botones de edición

---

## 📱 Responsive Design

### Desktop (> 768px):
- Vista completa de formación en campo
- Tabla con todas las columnas
- 4 stat cards en una fila

### Tablet (768px - 480px):
- Tabla condensada
- Stat cards en 2 filas
- Scroll horizontal en tabla si es necesario

### Móvil (< 480px):
- Solo columnas esenciales en tabla
- Stat cards en una columna
- Navegación en tabs es más compacta

---

## 🔧 Integración Técnica

### Dependencias:
```jsx
import MiEquipoMejorado from './components/MiEquipoMejorado'
```

### En App.jsx:
```jsx
<Route path="/mi-equipo/:teamId" element={<MainLayout><MiEquipoMejorado /></MainLayout>} />
```

### Props/Parameters:
- `teamId` - ID del equipo (desde URL)
- Obtiene datos automáticamente de Supabase

### Datos que consulta:
```
- Tabla: equipos (información general)
- Tabla: jugadores_equipos (plantilla)
- Tabla: usuarios (perfil de jugadores)
```

---

## 🐛 Troubleshooting

### Problema: "Equipo no encontrado"
**Solución:** Verificar que el teamId en la URL sea correcto

### Problema: "No se cargan los jugadores"
**Solución:** Asegurar que hay jugadores asignados al equipo en Supabase

### Problema: "Modal se queda abierto"
**Solución:** Click en X o fuera del modal para cerrar

### Problema: "Tabla sin scroll en móvil"
**Solución:** Es normal, se muestran solo columnas importantes en móvil

---

## 📊 Información que Muestra

### Por Jugador:
- Número de camiseta
- Nombre completo
- Posición (GK, DEF, MID, FWD)
- Edad (calculada desde fecha nacimiento)
- Partidos jugados
- Goles anotados
- Rating (escala 0-10)
- Avatar/Foto del jugador

### Del Equipo:
- Nombre oficial
- Categoría/Rama
- Logo
- Descripción
- Cantidad total de jugadores
- Edad promedio
- Partidos totales
- Goles totales

---

## 🎯 Casos de Uso

### 1. Manager revisando plantilla antes de partido:
1. Click en `/mi-equipo/[ID]`
2. Tab "Formación" para ver disposición táctica
3. Tab "Plantilla" para revisar estado de jugadores
4. Tab "Estadísticas" para análisis pre-partido

### 2. Comparación de equipos:
1. Abrir MiEquipo de equipo A
2. Revisar estadísticas
3. Abrir MiEquipo de equipo B
4. Comparar edad, goles, distribución

### 3. Análisis de rendimiento:
1. Tab "Estadísticas"
2. Revisar top goleadores
3. Ver distribución por posición
4. Analizar si hay balance

---

## ✨ Características Especiales

- **Animaciones suaves** en transiciones
- **Glassmorphism** (efecto de cristal) en fondo
- **Dark theme** profesional
- **Colores temáticos** por posición
- **Responsive 100%** en todos los dispositivos
- **Modo oscuro** automático basado en tema del sistema

---

## 🚀 Próximas Mejoras

- [ ] Edición inline de número de camiseta
- [ ] Drag & drop para cambiar formación
- [ ] Exportar plantilla en PDF
- [ ] Comparación lado a lado con otro equipo
- [ ] Historial de cambios en plantilla
- [ ] Integración con calendario de partidos

---

**Versión:** 1.0  
**Estado:** ✅ Producción  
**Última actualización:** 2024

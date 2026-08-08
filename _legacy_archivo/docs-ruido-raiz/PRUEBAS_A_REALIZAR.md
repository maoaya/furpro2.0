# 🧪 PRUEBAS A REALIZAR EN FUTPRO 2.0

## 📋 Checklist de Pruebas Funcionales

### 1️⃣ **Menu Hamburguesa - Mostrar Foto y Nombre**
**Ubicación:** Header derecha (arriba)
**Pasos:**
- [ ] Abre la app en https://futpro.vip
- [ ] Haz clic en el icono de menú (☰) arriba a la derecha
- [ ] Verifica que aparezca:
  - Foto de perfil del usuario (circular con borde dorado)
  - Nombre del usuario (sin email)
  - No debe mostrar el email
- [ ] Cierra el menú

---

### 2️⃣ **Crear Card de Equipo**
**Ubicación:** MenuHamburguesa → "➕ Crear Equipo"
**Pasos:**
- [ ] Abre MenuHamburguesa (☰)
- [ ] Clic en "➕ Crear Equipo"
- [ ] Completa el formulario:
  - Nombre del equipo: "Test Equipo 2025"
  - Descripción: "Equipo de prueba"
  - Categoría: Selecciona una
  - Ubicación: Tu ciudad
  - Logo: Sube una imagen
- [ ] Haz clic en "Crear"
- [ ] **Verifica:** Equipo aparece en `/equipos`
- [ ] **Screenshot:** Captura pantalla del equipo creado

---

### 3️⃣ **Subir Foto**
**Ubicación:** BottomNavBar → Botón Cámara 📷
**Pasos:**
- [ ] En la página principal, clic en botón de cámara (BottomNavBar)
- [ ] Se abre dropdown con opciones
- [ ] Clic en "Tomar Foto" o "Subir Foto/Video"
- [ ] Selecciona una foto de tu PC
- [ ] Completa:
  - Descripción: "Mi foto de prueba"
  - Ubicación: Tu ciudad
- [ ] Clic en "Publicar"
- [ ] **Verifica:** Foto aparece en el feed
- [ ] **Screenshot:** Foto publicada en feed

---

### 4️⃣ **Subir Video**
**Ubicación:** BottomNavBar → Botón Cámara 📷
**Pasos:**
- [ ] Clic en botón de cámara
- [ ] Clic en "Grabar Video" o "Subir Foto/Video"
- [ ] Selecciona un video de tu PC (MP4, WebM)
- [ ] Completa:
  - Descripción: "Mi video de prueba"
  - Ubicación: Tu ciudad
- [ ] Clic en "Publicar"
- [ ] **Verifica:** Video aparece en feed con thumbnail
- [ ] **Screenshot:** Video en feed

---

### 5️⃣ **Subir Historia**
**Ubicación:** BottomNavBar → Botón Cámara 📷
**Pasos:**
- [ ] Clic en botón de cámara
- [ ] Clic en "Subir Historia"
- [ ] Selecciona foto o video
- [ ] Completa formulario
- [ ] Clic en "Publicar"
- [ ] **Verifica:** Historia aparece en carrusel de historias (arriba)
- [ ] **Screenshot:** Historia en carrusel

---

### 6️⃣ **Transmisión en Vivo (Live Stream)**
**Ubicación:** BottomNavBar → Botón Cámara 📷 o MenuHamburguesa
**Pasos:**
- [ ] Clic en botón de cámara
- [ ] Clic en "Transmisión en Vivo"
- [ ] Se abre formulario para iniciar live
- [ ] Completa:
  - Título: "Mi primer Live"
  - Descripción: "Transmisión de prueba"
  - Ubicación: Tu ciudad
- [ ] Clic en "Iniciar Live"
- [ ] **Verifica:** Página de live abierta
- [ ] **Verifica:** Se ve el botón "EN VIVO" 🔴
- [ ] **Screenshot:** Página de live stream

---

## 📊 Resumen de Pruebas

| Función | Estado | Notas |
|---------|--------|-------|
| Menu Hamburguesa (foto + nombre) | ⏳ Pendiente | |
| Crear Card de Equipo | ⏳ Pendiente | |
| Subir Foto | ⏳ Pendiente | |
| Subir Video | ⏳ Pendiente | |
| Subir Historia | ⏳ Pendiente | |
| Transmisión en Vivo | ⏳ Pendiente | |

---

## 🔧 Notas Técnicas

- **Deploy:** https://futpro.vip
- **Cambios recientes:**
  - ✅ MenuHamburguesa: Mostrar solo foto + nombre (sin email)
  - ✅ TopNavBar deshabilitado en MainLayout
  - ✅ Build en progreso...

- **Próximos pasos:**
  - Ejecutar todas las pruebas
  - Capturar screenshots
  - Reportar errores si los hay
  - Deploy a producción una vez validado

---

**Fecha:** 7 de enero de 2026  
**Usuario:** mauro

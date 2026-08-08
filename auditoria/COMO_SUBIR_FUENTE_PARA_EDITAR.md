# Cómo subirme el fuente (tú solo arrastras; yo hago el resto)

No tienes que ejecutar comandos raros. El ZIP de deploy **no sirve para editar**. Necesito la carpeta del PC.

## Opción A — Lo más fácil (recomendado)

1. En tu PC, abre el Explorador de archivos.
2. Ve a: `C:\Users\...\Desktop\futpro2.0`
3. Comprueba que dentro hay una carpeta `src` con archivos `.jsx` (no solo `dist`).
4. **Clica derecho** en la carpeta `futpro2.0` → **Enviar a** → **Carpeta comprimida (zip)**.
5. En este chat de Cursor, **arrastra ese `.zip` a la ventana del mensaje** (o usa el clip / adjuntar archivo) y escribe:

   `aquí está el fuente, impórtalo y prepáralo para editar`

6. Yo ejecuto el import a `src-zona-pro/` y ya podemos editar funciones.

## Opción B — Si este chat NO deja adjuntar (usa esta)

No abras otro chat. Sube el fuente por GitHub desde el PC y avísame aquí con el enlace.

### B1 — Rama en este repo (recomendado si sabes usar Git / GitHub Desktop)

En el PC, dentro de `C:\Users\lenovo\Desktop\futpro2.0`:

1. Crea una carpeta zip **o** copia el contenido fuente (con `src` + `package.json`) a un sitio temporal.
2. Sube ese zip a GitHub Releases **o** push a una rama, por ejemplo:

```bat
cd C:\Users\lenovo\Desktop\futpro2.0
git init
git remote add origin https://github.com/maoaya/furpro2.0.git
git checkout -b fuente-pc-zona-pro
git add src package.json vite.config.js vite.config.ts index.html public netlify 2>nul
git commit -m "fuente Desktop futpro2.0 para editar"
git push -u origin fuente-pc-zona-pro
```

(Si esa carpeta ya es un git distinto, también vale: súbelo y pega aquí la URL del repo/rama.)

3. En **este mismo chat** escribe solo:  
   `fuente subido en rama fuente-pc-zona-pro`  
   Yo lo traigo a `src-zona-pro/`.

### B2 — Enlace de descarga

Sube el ZIP a Google Drive / OneDrive / Dropbox (enlace público o que yo pueda abrir) y pega el link aquí.

### B3 — Cursor Desktop local

Abre Cursor en la carpeta `C:\Users\lenovo\Desktop\futpro2.0` (File → Open Folder) y trabaja ahí. Ese agente sí ve los `.jsx` del PC.

## Qué NO subir

- `deploy-6a7256d5ffd58e44433d5158.zip` → eso ya lo tenemos; es solo build.
- Solo la carpeta `dist` → tampoco tiene `.jsx`.

## Qué SÍ debe traer el zip

- `package.json`
- carpeta `src/` con `.jsx`
- (ideal) `vite.config.*` / configs del PC

## Mientras tanto

La app **ya corre**: http://127.0.0.1:4173/login  

Si me dices **qué función concreta** quieres cambiar ahora (texto, botón, flujo), puedo intentar parches puntuales sobre el build — pero para “editar muchas funciones” del sistema hace falta el fuente del paso A.

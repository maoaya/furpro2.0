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

## Opción B — Si no puedes zippear

Arrastra al chat **varios archivos clave** no basta para todo el sistema. Mejor el zip de toda la carpeta.

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

# Retiro: Forzar sistema / Recargar completa del menú

Fecha: 2026-08-08

Pedido: quitar del menú hamburguesa las opciones **Forzar sistema** y **Recargar completa**.

## Cambios

- `producto-deploy/assets/index-DchpCYR3.js`
  - Eliminadas entradas del menú ⋮ (`force-system`, `force-reload`).
  - Long-press Inicio ya no fuerza sistema (navega a inicio); title = `Inicio`.
- Hash actualizado en `scripts/ensure-producto-deploy.mjs` y `MANIFEST_CANONICO.json`.

Menú tras el patch: … → Privacidad → **Cerrar Sesión** (sin forzar/recargar).

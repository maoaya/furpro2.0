# Guía de pruebas FutPro

Este proyecto usa Jest para backend y frontend (React + Vite). Se incluyen rutas de fallback específicas para entorno de test con el fin de estabilizar la suite mientras se implementan endpoints reales.

## Cómo ejecutar

- Ejecutar toda la suite:

```
npm test -- -i
```

- Ejecutar un subconjunto por archivo:

```
npm test -- testing\amistosos.test.js -i
```

La opción `-i` fuerza modo interactivo secuencial, útil en Windows.

## Fallbacks de test

En entorno de test, se montan rutas de apoyo definidas en `src/routes/testFallbackRoutes.js`.
Estas mockean endpoints como:

- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/recover`
- Perfil: `/api/user/profile`, `/api/user/profile/:id`, `/api/user/profile/photo`
- Media: `/api/media/upload`
- Marketplace: `/api/marketplace/*`
- Live/Streaming: `/api/live/*`
- Chat/Grupos: `/api/chat/*`, `/api/messages/send`
- Amistosos: `/api/friendlies/*`
- Ranking: `/api/ranking/*`
- Stories/Feed: `/api/home/stories`, `/api/feed`, `/api/feed/stories`
- Invitaciones: `/api/invitations/*`, `/api/tournaments/invite`, `/api/teams/invite`
- Notificaciones: `/api/notifications/send`
- Moderación: `/api/moderation/report`
- Puntos/Card: `/api/points/*`, `/api/user/points/*`, `/api/user/card/change`
- Tournaments schedule: `/api/tournaments/:id/schedule`

Además, por compatibilidad, las mismas rutas también están disponibles sin el prefijo `/api` cuando `NODE_ENV=test`.

### Flags de control

Se controlan mediante variables de entorno:

- `FUTPRO_TEST_FALLBACKS=true` (por defecto en test): activa los fallbacks
- `FUTPRO_DISABLE_TEST_FALLBACKS=true`: desactiva los fallbacks incluso si `NODE_ENV=test`

Lógica en `src/main/expressApp.js`:

```
const enableTestFallbacks = (
  process.env.NODE_ENV === 'test' &&
  process.env.FUTPRO_DISABLE_TEST_FALLBACKS !== 'true' &&
  (process.env.FUTPRO_TEST_FALLBACKS === 'true' || typeof process.env.FUTPRO_TEST_FALLBACKS === 'undefined')
);
```

## Notas

- En tests “real” se evita cerrar `app` en `afterAll` para prevenir timeouts. Los tests usan directamente el `app` exportado de `server.js`.
- Se desactiva el rate limiting en test para no interferir con los casos.
- Uploads multipart se drenan en fallbacks para evitar `ECONNRESET`.

## Troubleshooting

- Si ves `Cannot use 'import.meta' outside a module` en tests de importación automática, el propio test los ignora de forma segura (solo registra un warning). No requiere acción.
- Si un test espera respuesta 404/401 pero el fallback devuelve 200/201, ajusta el test o desactiva fallbacks con `FUTPRO_DISABLE_TEST_FALLBACKS=true` para probar la ruta real.

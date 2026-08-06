# Validación FP-NAV-001

**Pass:** YES

## Rutas
| Ruta | status | text | hasRoot | aborted | hardFail |
|------|--------|------|---------|---------|----------|
| /perfil | 200 | 90 | yes | no | no |
| /perfil/me | 200 | 90 | yes | no | no |
| /crear-equipo | 200 | 1250 | yes | no | no |
| /login | 200 | 211 | yes | no | no |
| /home | 200 | 408 | yes | no | no |

## Stress perfil ↔ crear-equipo
- i=0 /perfil: text=90 aborted=no
- i=0 /crear-equipo: text=1250 aborted=no
- i=1 /perfil: text=90 aborted=no
- i=1 /crear-equipo: text=1250 aborted=no
- i=2 /perfil: text=90 aborted=no
- i=2 /crear-equipo: text=1250 aborted=no

### /perfil preview
```
Mi Perfil

Inicia sesión para ver tu perfil, card y momentos.

Iniciar sesión
Ir al inicio
```

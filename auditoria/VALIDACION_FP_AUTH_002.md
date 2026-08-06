# VALIDACION FP-AUTH-002

**Resultado:** PASS

## Criterio matriz
- grep getSession/getUser en `src/pages` → 0 (salvo AuthCallback)
- smoke nav rutas afectadas con rootText > 0

### Grep: PASS (forbidden=0)

- Sin call-sites prohibidos en pages.

### Nav smoke: PASS

| route | status | ms | rootText |
|---|---:|---:|---:|
| /login | 200 | 805 | 211 |
| /home | 200 | 723 | 408 |
| /feed | 200 | 714 | 408 |
| /perfil | 200 | 712 | 90 |
| /notificaciones | 200 | 727 | 90 |
| /ranking | 200 | 710 | 531 |
| /marketplace | 200 | 703 | 53 |
| /amigos | 200 | 695 | 123 |

Generado: 2026-08-06T23:53:13.697Z
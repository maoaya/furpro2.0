# Validación FP-AUTH-001

**Pass:** YES

| Métrica | Valor | Criterio |
|---------|-------|----------|
| auth/v1/health calls | 0 | ≤ 1 |
| auth/v1/health 401 | 0 | = 0 |
| REST /rest/v1/ probes | 11 | (reemplazo del health) |
| rutas OK | 10/10 | — |

## Rutas
- `/login` ok 706ms text=211 online=true
- `/home` ok 627ms text=408 online=true
- `/torneos` ok 604ms text=214 online=true
- `/equipos` ok 600ms text=859 online=true
- `/marketplace` ok 598ms text=48 online=true
- `/ranking-jugadores` ok 630ms text=4552 online=true
- `/chat` ok 618ms text=11 online=true
- `/privacidad` ok 590ms text=10 online=true
- `/videos` ok 588ms text=43 online=true
- `/crear-torneo` ok 601ms text=343 online=true

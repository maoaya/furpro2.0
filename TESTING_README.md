# FutPro 2.0 - Documentación de Testing

## 📋 Resumen General

Este documento describe el sistema de testing implementado para FutPro 2.0, incluyendo endpoints, componentes React y flujos de testing end-to-end.

## 🚀 Estado Actual

- ✅ **Backend Tests**: 11/11 passing
- ✅ **Frontend Tests**: 119/119 passing  
- ✅ **Integration Tests**: 2/2 passing
- ⚠️ **Legacy Tests**: 76 failing (fuera de scope)

## 📡 Backend Testing

### Servidor de Prueba
- **Archivo**: `server-test.js`
- **Puerto**: Dinámico (0 para tests)
- **Framework**: Express + CORS
- **Testing**: Jest + Supertest

### Endpoints Implementados

#### Health Check
```
GET /api/ping
```
**Respuesta**:
```json
{
  "status": "ok",
  "message": "pong", 
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

#### Ranking de Jugadores
```
GET /api/ranking/jugadores
```
**Query Parameters**:
- `categoria` (string): Filtro por categoría
- `edadMin` (number): Edad mínima
- `edadMax` (number): Edad máxima 
- `equipoId` (number): ID del equipo
- `limite` (number): Límite de resultados (default: 20)

**Respuesta**:
```json
{
  "status": "ok",
  "ranking": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "equipo_nombre": "FC Barcelona", 
      "edad": 25,
      "goles": 15,
      "asistencias": 8,
      "partidos_jugados": 22,
      "ranking": 95.5
    }
  ],
  "total": 3
}
```

#### Ranking de Campeonatos
```
GET /api/ranking/campeonatos
```
**Query Parameters**:
- `categoria` (string): Filtro por categoría
- `estado` (string): activo, finalizado, programado, cancelado
- `fechaInicioDesde` (date): Fecha inicio desde
- `fechaInicioHasta` (date): Fecha inicio hasta
- `limite` (number): Límite de resultados (default: 20)

**Respuesta**:
```json
{
  "status": "ok",
  "ranking": [
    {
      "id": 1,
      "nombre": "Liga Profesional 2025",
      "categoria": "Primera División",
      "estado": "activo",
      "fecha_inicio": "2025-03-01",
      "fecha_fin": "2025-12-15",
      "total_equipos": 20,
      "total_partidos": 380,
      "total_visualizaciones": 25000,
      "ranking": 94.7
    }
  ],
  "total": 3
}
```

### Tests Backend
```bash
# Ejecutar tests específicos del backend
npx jest -c jest.backend.config.cjs --runInBand testing/ping.test.js testing/ranking-new.test.js
```

## ⚛️ Frontend Testing

### Componentes React Principales

#### RankingJugadores
- **Archivo**: `src/components/RankingJugadores.jsx`
- **Features**: Tabla con filtros, paginación, loading/error states
- **API**: Consume `/api/ranking/jugadores`
- **Tests**: Mocks fetch, verifica renders y filtros

#### RankingCampeonatos  
- **Archivo**: `src/components/RankingCampeonatos.jsx`
- **Features**: Cards grid, estadísticas, filtros avanzados
- **API**: Consume `/api/ranking/campeonatos`
- **Tests**: Mocks fetch, verifica renders y selectors

#### RankingDashboard
- **Archivo**: `src/components/RankingDashboard.jsx`
- **Features**: Tabs switcher entre rankings
- **Tests**: Verifica navegación entre tabs

### Configuración API_URL
Los componentes resuelven la URL del backend dinámicamente:
```javascript
const getApiUrl = () =>
  (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.API_URL)) ||
  (typeof window !== 'undefined' && window.__API_URL__) ||
  'http://localhost:8080/api';
```

### Tests Frontend
```bash
# Ejecutar todos los tests frontend
npx jest -c jest.frontend.config.cjs --runInBand

# Tests específicos de ranking
npx jest -c jest.frontend.config.cjs --runInBand src/components/__tests__/Ranking*.test.jsx
```

## 🔗 Integration Testing

### Tests End-to-End
- **Archivo**: `src/components/__tests__/RankingIntegration.test.jsx`
- **Setup**: Levanta servidor Express en puerto aleatorio
- **Scope**: Verifica comunicación real FE-BE
- **Validación**: Renderizado de datos reales del backend

```bash
# Ejecutar integration tests
npx jest -c jest.frontend.config.cjs --runInBand src/components/__tests__/RankingIntegration.test.jsx
```

### Proceso de Integration Test
1. Inicia servidor Express en puerto dinámico
2. Configura `process.env.API_URL` y `window.__API_URL__`
3. Renderiza componentes React reales
4. Valida fetch y display de datos del backend
5. Limpia servidor y DOM entre tests

## 🛠️ Configuración Jest

### Backend Config (`jest.backend.config.cjs`)
```javascript
module.exports = {
  displayName: 'backend',
  testMatch: ['<rootDir>/testing/*.test.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

### Frontend Config (`jest.frontend.config.cjs`)
```javascript
module.exports = {
  displayName: 'frontend', 
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest']
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

## 📊 Comandos de Testing

### Backend Only
```bash
npx jest -c jest.backend.config.cjs --runInBand testing/ping.test.js testing/ranking-new.test.js
```

### Frontend Only  
```bash
npx jest -c jest.frontend.config.cjs --runInBand
```

### Integration Tests
```bash
npx jest -c jest.frontend.config.cjs --runInBand src/components/__tests__/RankingIntegration.test.jsx
```

### Full Suite (Frontend + Integration)
```bash
npx jest -c jest.frontend.config.cjs --runInBand
```

## 🎯 Datos de Test

### Jugadores de Ejemplo
- **Juan Pérez**: FC Barcelona, 25 años, 95.5 ranking
- **Carlos González**: Real Madrid, 28 años, 87.3 ranking  
- **Diego Martín**: Atlético Madrid, 22 años, 78.9 ranking

### Campeonatos de Ejemplo
- **Liga Profesional 2025**: Activo, 20 equipos, 94.7 ranking
- **Copa Nacional Sub-20**: Finalizado, 16 equipos, 82.1 ranking
- **Torneo Regional**: Programado, 12 equipos, 65.0 ranking

## ⚡ Performance

### Benchmarks
- **Ping Response**: < 200ms
- **Backend Tests**: ~22s para 11 tests
- **Frontend Tests**: ~59s para 119 tests
- **Integration Tests**: ~10s para 2 tests

## 🔧 Troubleshooting

### Error: "Cannot use import.meta outside a module"
- **Solución**: Usar `getApiUrl()` función en lugar de constante
- **Afecta**: Components que necesitan API_URL en Jest

### Error: "Found multiple elements with text"
- **Solución**: Usar selectores específicos como `findByText(/exact/)`
- **Afecta**: Tests con texto duplicado en DOM

### Error: "Cannot read properties of undefined (reading 'address')"
- **Solución**: Verificar que server-test.js exports correctamente
- **Afecta**: Tests que usan supertest con require()

## 📈 Next Steps

1. **Expand Backend**: Añadir más endpoints de ranking
2. **Add E2E**: Cypress tests para user flows
3. **Performance**: Tests de carga con Artillery
4. **CI/CD**: GitHub Actions para tests automáticos
5. **Coverage**: Configurar coverage reports con Jest

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Tests Status**: ✅ All Core Tests Passing
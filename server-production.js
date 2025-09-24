#!/usr/bin/env node
// Servidor de producción para FutPro
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { productionConfig } from './config/production.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

console.log('🚀 Iniciando servidor de producción FutPro...');

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Lo manejamos manualmente
  crossOriginEmbedderPolicy: false
}));

// Headers de seguridad personalizados
app.use((req, res, next) => {
  Object.entries(productionConfig.securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});

// Compresión
app.use(compression());

// CORS
app.use(cors(productionConfig.corsOptions));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(productionConfig.staticPath, {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'production',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Endpoint de diagnóstico OAuth
app.get('/api/oauth-config', (req, res) => {
  res.json({
    environment: 'production',
    domain: 'futpro.vip',
    urls: productionConfig.urls,
    timestamp: new Date().toISOString()
  });
});

// SPA fallback - DEBE ir al final
app.get('*', (req, res) => {
  console.log(`📄 Sirviendo SPA para: ${req.path}`);
  res.sendFile(productionConfig.fallbackPath);
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('💥 Error del servidor:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const server = app.listen(productionConfig.port, productionConfig.host, () => {
  console.log('✅ Servidor de producción iniciado:');
  console.log(`   🌐 URL: ${productionConfig.urls.base}`);
  console.log(`   🔧 Puerto: ${productionConfig.port}`);
  console.log(`   📁 Sirviendo: ${productionConfig.staticPath}`);
  console.log(`   🔐 OAuth callback: ${productionConfig.urls.oauth.callback}`);
  console.log(`   ⭐ Premium callback: ${productionConfig.urls.oauth.premium}`);
});

// Manejo graceful de cierre
process.on('SIGTERM', () => {
  console.log('📴 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

export default app;
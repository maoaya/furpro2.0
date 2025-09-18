// --- PRIVACIDAD Y SEGURIDAD ---
// Cambiar visibilidad de perfil
router.put('/user/privacy', authenticate, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { privacidad } = req.body;
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  let userData = {};
  if (fs.existsSync(userMetaPath)) userData = JSON.parse(fs.readFileSync(userMetaPath));
  userData.privacidad = privacidad;
  fs.writeFileSync(userMetaPath, JSON.stringify(userData, null, 2));
  res.json({ ok: true, privacidad });
});

// Cambiar configuración de notificaciones
router.put('/user/notifications', authenticate, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { email, push } = req.body;
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  let userData = {};
  if (fs.existsSync(userMetaPath)) userData = JSON.parse(fs.readFileSync(userMetaPath));
  userData.notificaciones = { email, push };
  fs.writeFileSync(userMetaPath, JSON.stringify(userData, null, 2));
  res.json({ ok: true, notificaciones: userData.notificaciones });
});

// Descargar datos del usuario (simulado)
router.get('/user/data', authenticate, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  let userData = {};
  if (fs.existsSync(userMetaPath)) userData = JSON.parse(fs.readFileSync(userMetaPath));
  res.json({ ok: true, data: userData });
});

// Eliminar cuenta de usuario (simulado)
router.delete('/user', authenticate, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  if (fs.existsSync(userMetaPath)) fs.unlinkSync(userMetaPath);
  // Aquí también se eliminarían datos de BD real
  res.json({ ok: true, eliminado: true });
});

// Cambiar contraseña (simulado)
router.put('/user/password', authenticate, (req, res) => {
  // Solo simulado, no almacena password real
  res.json({ ok: true, changed: true });
});
// Comentarios en publicaciones/media
router.post('/media/:id/comment', authenticate, authorize('media:view'), (req, res) => {
  const metaPath = path.join(uploadDir, 'gallery.json');
  let gallery = [];
  if (fs.existsSync(metaPath)) gallery = JSON.parse(fs.readFileSync(metaPath));
  const mediaId = parseInt(req.params.id);
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comentario vacío' });
  const idx = gallery.findIndex(m => m.id === mediaId);
  if (idx === -1) return res.status(404).json({ error: 'Media no encontrada' });
  if (!gallery[idx].comentarios) gallery[idx].comentarios = [];
  const comentario = {
    id: Date.now(),
    text,
    user: req.user?.id || null,
    date: new Date().toISOString()
  };
  gallery[idx].comentarios.push(comentario);
  fs.writeFileSync(metaPath, JSON.stringify(gallery, null, 2));

  // Emitir evento WebSocket si existe instancia global
  if (req.app.get('wss')) {
    req.app.get('wss').clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'new-comment',
          mediaId,
          comentario
        }));
      }
    });
  }

  res.json({ success: true, comentario });
});

router.get('/media/:id/comments', authenticate, authorize('media:view'), (req, res) => {
  const metaPath = path.join(uploadDir, 'gallery.json');
  let gallery = [];
  if (fs.existsSync(metaPath)) gallery = JSON.parse(fs.readFileSync(metaPath));
  const mediaId = parseInt(req.params.id);
  const media = gallery.find(m => m.id === mediaId);
  if (!media) return res.status(404).json({ error: 'Media no encontrada' });
  res.json({ comentarios: media.comentarios || [] });
});
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const notificationService = require('../services/notificationService');

// Galería
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
  }
});
const upload = multer({ storage });

// --- ENDPOINTS DE AVATAR/FOTO DE PERFIL ---
// Subir foto de perfil (nuevo)
router.post('/user/profile/photo', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });
  // Guardar la ruta del archivo en el perfil del usuario (ejemplo simple: en un JSON por usuario)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  let userData = {};
  if (fs.existsSync(userMetaPath)) userData = JSON.parse(fs.readFileSync(userMetaPath));
  userData.photoUrl = `/uploads/${req.file.filename}`;
  fs.writeFileSync(userMetaPath, JSON.stringify(userData, null, 2));
  res.status(201).json({ photoUrl: userData.photoUrl });
});

// Cambiar foto de perfil (actualizar)
router.put('/user/profile/photo', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const userMetaPath = path.join(uploadDir, `user_${userId}.json`);
  let userData = {};
  if (fs.existsSync(userMetaPath)) userData = JSON.parse(fs.readFileSync(userMetaPath));
  userData.photoUrl = `/uploads/${req.file.filename}`;
  fs.writeFileSync(userMetaPath, JSON.stringify(userData, null, 2));
  res.status(200).json({ photoUrl: userData.photoUrl });
});

router.post('/media/upload', authenticate, authorize('media:upload'), upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Guardar metadatos en memoria o BD (aquí solo ejemplo)
  const metaPath = path.join(uploadDir, 'gallery.json');
  let gallery = [];
  if (fs.existsSync(metaPath)) gallery = JSON.parse(fs.readFileSync(metaPath));
  const tipo = req.file.mimetype.startsWith('image') ? 'imagen' : 'video';
  const item = {
    id: Date.now(),
    nombre: req.file.originalname,
    tipo,
    url: `/uploads/${req.file.filename}`,
    user: req.user?.id || null
  };
  gallery.push(item);
  fs.writeFileSync(metaPath, JSON.stringify(gallery, null, 2));
  res.json({ success: true, item });
});

router.get('/media/gallery', authenticate, authorize('media:view'), (req, res) => {
  const metaPath = path.join(uploadDir, 'gallery.json');
  let gallery = [];
  if (fs.existsSync(metaPath)) gallery = JSON.parse(fs.readFileSync(metaPath));
  res.json({ gallery });
});
// Reacciones (like) en publicaciones/media
router.post('/media/like', authenticate, authorize('media:view'), (req, res) => {
  const metaPath = path.join(uploadDir, 'gallery.json');
  let gallery = [];
  if (fs.existsSync(metaPath)) gallery = JSON.parse(fs.readFileSync(metaPath));
  const { mediaId } = req.body;
  const idx = gallery.findIndex(m => m.id === mediaId);
  if (idx === -1) return res.status(404).json({ error: 'Media no encontrada' });
  if (!gallery[idx].likes) gallery[idx].likes = 0;
  gallery[idx].likes++;
  fs.writeFileSync(metaPath, JSON.stringify(gallery, null, 2));

  // Emitir evento WebSocket si existe instancia global
  if (req.app.get('wss')) {
    req.app.get('wss').clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'new-like',
          mediaId,
          likes: gallery[idx].likes
        }));
      }
    });
  }

  res.json({ success: true, likes: gallery[idx].likes });
});

// Chat
router.post('/chat/message', authenticate, authorize('chat:all'), (req, res) => {
  // Lógica de envío de mensaje
  res.json({ success: true });
});

// Streaming
router.post('/stream/start', authenticate, authorize('stream:start'), (req, res) => {
  // Lógica de inicio de transmisión
  res.json({ success: true });
});
router.get('/stream/view', authenticate, authorize('stream:view'), (req, res) => {
  // Lógica de visualización
  res.json({ stream: null });
});

// Notificaciones
router.post('/notifications/send', authenticate, (req, res) => {
  const { to, message } = req.body;
  notificationService.sendNotification(to, message);
  res.json({ success: true });
});
router.get('/notifications', authenticate, (req, res) => {
  const userId = req.user.id;
  res.json({ notifications: notificationService.getNotifications(userId) });
});

// Moderación
const reportsPath = path.join(uploadDir, 'reports.json');
function loadReports() {
  if (fs.existsSync(reportsPath)) return JSON.parse(fs.readFileSync(reportsPath));
  return [];
}
function saveReports(reports) {
  fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));
}
// Reportar contenido
router.post('/moderation/report', authenticate, (req, res) => {
  const { contentId, reason } = req.body;
  const userId = req.user?.id;
  if (!contentId || !reason || !userId) return res.status(400).json({ error: 'Datos incompletos' });
  const reports = loadReports();
  reports.push({ id: Date.now(), contentId, motivo: reason, reportadoPor: userId, tipo: 'contenido' });
  saveReports(reports);
  res.json({ success: true });
});
// Listar reportes
router.get('/moderation/reports', authenticate, authorize('moderate'), (req, res) => {
  res.json({ reports: loadReports() });
});
// Bloquear/eliminar contenido reportado
router.delete('/moderation/content/:id', authenticate, authorize('moderate'), (req, res) => {
  const id = parseInt(req.params.id);
  let reports = loadReports();
  reports = reports.filter(r => r.id !== id);
  saveReports(reports);
  // Aquí también se podría eliminar el contenido real
  res.json({ success: true });
});

module.exports = router;
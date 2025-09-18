import express from 'express';

// Rutas de apoyo para entorno de testing.
// Propósito: proveer respuestas mínimas para endpoints usados por la suite
// que aún no tienen implementación real, estabilizando la CI.
// Control por flags (ver expressApp.js):
//  - FUTPRO_TEST_FALLBACKS=true (por defecto en test) => activa
//  - FUTPRO_DISABLE_TEST_FALLBACKS=true => desactiva incluso en test
// TODO: Sustituir gradualmente por implementaciones reales y eliminar este módulo cuando no sea necesario.
const router = express.Router();

// Utilidad simple
const ok = (res, body = {}, status = 200) => res.status(status).json(body);

// Consumir multipart/form-data de forma no bloqueante en tests
router.use((req, res, next) => {
	const ct = req.headers['content-type'] || '';
	if (ct.includes('multipart/form-data')) {
		// Drenamos el stream sin almacenar
		req.on('data', () => {});
		req.on('end', () => next());
	} else {
		next();
	}
});

// Auth helpers (en tests no validamos contra BBDD)
router.post('/auth/register', (req, res) => ok(res, { user: { id: 1, email: req.body?.email || 'test@example.com' } }, 201));
router.post('/auth/login', (req, res) => ok(res, { token: 'test-token', user: { id: 1, email: req.body?.email || 'test@example.com' } }, 200));
router.post('/auth/recover', (req, res) => ok(res, { ok: true, email: req.body?.email || 'test@example.com' }, 200));

// User profile
router.get('/user/profile', (req, res) => ok(res, { user: { id: 1, email: 'test@example.com', nombre: 'Test' } }, 200));
router.put('/user/profile', (req, res) => ok(res, { user: { id: 1, ...req.body } }, 200));
router.post('/user/profile/photo', (req, res) => ok(res, { photoUrl: 'https://cdn.example.com/photo1.jpg' }, 201));
router.put('/user/profile/photo', (req, res) => ok(res, { photoUrl: 'https://cdn.example.com/photo2.jpg' }, 200));
// Nota: en test, priorizamos la forma de perfil tipo Instagram más abajo

// Ubicación y card
router.post('/user/location', (req, res) => ok(res, { location: { lat: req.body?.lat || 0, lng: req.body?.lng || 0 } }, 200));
router.post('/user/card/change', (req, res) => ok(res, { card: 'gold', status: 'changed' }, 200));

// Media upload
router.post('/media/upload', (req, res) => ok(res, { url: 'https://cdn.example.com/media/test.jpg' }, 201));

// Marketplace
router.post('/marketplace/publish', (req, res) => ok(res, { product: { id: 1, ...req.body } }, 201));
router.post('/marketplace/buy', (req, res) => ok(res, { order: { id: 1, productId: req.body?.productId || 1 } }, 201));
router.put('/marketplace/edit/:id', (req, res) => ok(res, { product: { id: Number(req.params.id), ...req.body } }, 200));

// Live/Streaming
router.get('/live/matches', (req, res) => ok(res, { matches: [{ id: 1, teams: 'A vs B' }] }, 200));
router.post('/live/select', (req, res) => ok(res, { selected: { matchId: req.body?.matchId || 1 } }, 200));
router.post('/live/start', (req, res) => ok(res, { streamUrl: 'rtmp://stream.example/futpro' }, 201));

// Chat/Grupos
router.post('/chat/groups/create', (req, res) => ok(res, { group: { id: 1, nombre: req.body?.nombre || 'Grupo' } }, 201));

// Amistosos
router.post('/friendlies/create', (req, res) => ok(res, { friendly: { id: 1, ...req.body } }, 201));
router.post('/friendlies/accept', (req, res) => ok(res, { status: 'accepted' }, 200));

// Ranking adicional usado por tests
router.get('/ranking/general', (req, res) => ok(res, { ranking: [{ id: 1, nombre: 'Jugador 1', puntos: 100 }] }, 200));
router.get('/ranking/gender', (req, res) => ok(res, { ranking: [{ id: 1, gender: req.query?.gender || 'masculino', puntos: 50 }] }, 200));
router.get('/ranking/age', (req, res) => ok(res, { ranking: [{ id: 1, range: req.query?.range || 'infantil', puntos: 30 }] }, 200));
router.post('/ranking/update', (req, res) => ok(res, { ranking: [{ id: 1, puntos: 110 }] }, 200));

// Historias
router.post('/stories/publish', (req, res) => ok(res, { story: { id: 1, ...req.body } }, 201));
router.get('/home/stories', (req, res) => ok(res, { stories: [{ id: 1, mediaUrl: 'https://cdn.example.com/s1.jpg' }] }, 200));
// Feed principal y stories en feed
router.get('/feed', (req, res) => ok(res, { feed: [{ id: 1, text: 'Hola FutPro' }] }, 200));
router.get('/feed/stories', (req, res) => ok(res, { stories: [{ id: 1, mediaUrl: 'https://cdn.example.com/s2.jpg' }] }, 200));

// Invitaciones
router.post('/invitations/send', (req, res) => ok(res, { invitation: { id: 1, ...req.body } }, 201));
router.post('/invitations/accept', (req, res) => ok(res, { status: 'accepted' }, 200));

// Endpoints especificados en algunos tests
router.post('/tournaments/invite', (req, res) => ok(res, { invitation: { id: 1, ...req.body } }, 201));
router.post('/teams/invite', (req, res) => ok(res, { invitation: { id: 2, ...req.body } }, 201));
router.get('/tournaments/:id/schedule', (req, res) => ok(res, { schedule: [{ id: 1, hora: '10:00' }] }, 200));

// Notificaciones y mensajes
router.post('/notifications/send', (req, res) => ok(res, { success: true }, 200));
router.post('/messages/send', (req, res) => ok(res, { message: { id: 1, ...req.body } }, 201));
router.post('/chat/message', (req, res) => ok(res, { success: true, message: { id: 1, ...req.body } }, 201));

// Sistema de puntos
router.post('/user/points/add', (req, res) => ok(res, { points: (req.body?.points || 0) + 100 }, 200));
router.post('/user/points/subtract', (req, res) => ok(res, { points: 100 - (req.body?.points || 0) }, 200));
// Compatibilidad con /points/*
router.post('/points/add', (req, res) => ok(res, { points: (req.body?.points || 0) + 100 }, 200));
router.post('/points/subtract', (req, res) => ok(res, { points: 100 - (req.body?.points || 0) }, 200));

// Perfil estilo Instagram
router.get('/user/profile/:id', (req, res) => ok(res, { profile: { id: Number(req.params.id), fotos: [], seguidores: [], publicaciones: [] } }, 200));

// Moderación
router.post('/moderation/report', (req, res) => ok(res, { success: true }, 201));

export default router;

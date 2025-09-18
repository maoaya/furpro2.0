import express from 'express';
import { register, login, verifyToken } from './authController.js';
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/recover', require('./authController.js').recover);
router.get('/verify', verifyToken, (req, res) => res.json({ user: req.user }));

export default router;

// import 'openai/shims/node';
// import { enviarSMS } from '../services/twilioService.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// import OpenAI from 'openai';
// import appRoutes from '../routes/appRoutes.js';
// import { enviarNotificacionPush } from '../services/notificationsService.js';

// Configuración del transporter SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Configuración de OpenAI
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     dangerouslyAllowBrowser: process.env.NODE_ENV === 'test'
// });

// 1. Registro de usuario con validación de edad y email de bienvenida
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { enviarSMS } from '../services/twilioService.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Registro real de usuario en Supabase y envío de email/SMS
export async function registrarUsuario(req, res) {
    const { email, password, nombre, telefono } = req.body;
    if (!email || !password || !nombre) return res.status(400).json({ error: 'Faltan datos' });
    // Registro en Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    // Guardar datos extra en tabla usuarios
    await supabase.from('usuarios').insert([{ id: data.user.id, email, nombre, telefono }]);
    // Enviar email de bienvenida
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Bienvenido a FutPro',
        text: `Hola ${nombre}, tu registro fue exitoso.`
    });
    // Enviar SMS si hay teléfono
    if (telefono) await enviarSMS(telefono, '¡Bienvenido a FutPro!');
    res.status(201).json({ mensaje: 'Usuario registrado y notificaciones enviadas', user: { id: data.user.id, email, nombre } });
}

// 2. Moderación automática de contenido en mensajes
// function contienePalabrasProhibidas(texto) {
//     const palabrasProhibidas = ['mala', 'ofensiva', 'prohibida']; // Personaliza tu lista
//     return palabrasProhibidas.some(palabra => texto.toLowerCase().includes(palabra));
// }

// Publicar mensaje real con moderación IA
export async function publicarMensaje(req, res) {
    const { userId, texto } = req.body;
    if (!userId || !texto) return res.status(400).json({ error: 'Faltan datos' });
    // Moderación con OpenAI
    const moderation = await openai.moderations.create({ input: texto });
    if (moderation.results[0].flagged) return res.status(403).json({ error: 'Mensaje no permitido por IA' });
    // Guardar mensaje en Supabase
    const { data, error } = await supabase.from('mensajes').insert([{ user_id: userId, texto }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ mensaje: 'Mensaje publicado correctamente', data });
}

// 3. Chat inteligente con OpenAI
// Chat inteligente real con OpenAI
export async function chatInteligente(req, res) {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido' });
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });
        res.status(200).json({ respuesta: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Envío de SMS para verificación de cuenta
            // Envío real de SMS para verificación
            export async function enviarCodigoVerificacion(req, res) {
                const { telefono, codigo } = req.body;
                if (!telefono || !codigo) return res.status(400).json({ error: 'Faltan datos' });
                try {
                    await enviarSMS(telefono, `Tu código de verificación es: ${codigo}`);
                    res.status(200).json({ mensaje: 'SMS de verificación enviado' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
}

// Envío de SMS en recuperación de contraseña
// Envío real de SMS en recuperación de contraseña
export async function recuperarContrasena(req, res) {
    const { telefono, codigo } = req.body;
    if (!telefono || !codigo) return res.status(400).json({ error: 'Faltan datos' });
    try {
        await enviarSMS(telefono, `Tu código de recuperación es: ${codigo}`);
        res.status(200).json({ mensaje: 'SMS enviado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Envío de email en recuperación de contraseña
// Envío real de email en recuperación de contraseña
export async function enviarEmailRecuperacion(req, res) {
    const { email, codigo } = req.body;
    if (!email || !codigo) return res.status(400).json({ error: 'Faltan datos' });
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Recuperación de contraseña FutPro',
            text: `Tu código de recuperación es: ${codigo}`
        });
        res.status(200).json({ mensaje: 'Email de recuperación enviado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Crear JWT
export function crearJWT(usuario) {
    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        roles: usuario.roles,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });
}

// Verificar JWT (middleware)
export function verificarJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// Ejemplo de uso en una ruta protegida (debe ir en el router, no aquí)
// Para probar, agrega en tu router:
// router.get('/ruta-protegida', verificarJWT, (req, res) => {
//   res.json({ mensaje: 'Acceso permitido', usuario: req.usuario });
// });
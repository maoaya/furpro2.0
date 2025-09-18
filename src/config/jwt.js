import jwt_decode from "jwt-decode";

export const JWT_SECRET = process.env.JWT_SECRET || 'TU_JWT_SECRET';

// Generar JWT (solo para pruebas frontend, en backend usar una lib segura)
export function generateJWT(payload) {
	// Solo para desarrollo, no usar en producción
	return btoa(JSON.stringify(payload));
}

// Verificar JWT (solo para pruebas frontend)
export function verifyJWT(token) {
	try {
		const decoded = jwt_decode(token);
		// Aquí podrías validar expiración, usuario, etc.
		return decoded;
	} catch (e) {
		return null;
	}
}

// Decodificar JWT
export function decodeJWT(token) {
	try {
		return jwt_decode(token);
	} catch (e) {
		return null;
	}
}
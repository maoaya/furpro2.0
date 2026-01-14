import { supabase } from '../config/supabase';

/**
 * SecurityService - Manejo de seguridad, validaciones y detección de contenido
 */

export class SecurityService {
  /**
   * Verificar si usuario está bloqueado
   */
  static async esUsuarioBloqueado(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios_bloqueados')
        .select('*')
        .eq('usuario_id', userId)
        .eq('estado', 'activo')
        .gt('fecha_desbloqueo', new Date().toISOString())
        .single();

      if (error && error.code === 'PGRST116') return false; // No existe
      return !!data;
    } catch (err) {
      console.error('Error verificando bloqueo:', err);
      return false;
    }
  }

  /**
   * Verificar intentos fallidos de login
   */
  static async verificarIntentosLogin(email, ipAddress) {
    try {
      const { data, error } = await supabase
        .from('intentos_login')
        .select('*')
        .eq('email', email)
        .eq('ip_address', ipAddress)
        .single();

      if (error && error.code === 'PGRST116') {
        return { bloqueado: false, intentos: 0, bloqueado_hasta: null };
      }

      // Si está bloqueado y el tiempo aún no pasó
      if (data?.bloqueado_hasta && new Date(data.bloqueado_hasta) > new Date()) {
        return { bloqueado: true, intentos: 5, bloqueado_hasta: data.bloqueado_hasta };
      }

      return { bloqueado: false, intentos: data?.intentos || 0, bloqueado_hasta: null };
    } catch (err) {
      console.error('Error verificando intentos:', err);
      return { bloqueado: false, intentos: 0, bloqueado_hasta: null };
    }
  }

  /**
   * Registrar intento fallido de login
   */
  static async registrarIntentoFallido(email, ipAddress) {
    try {
      const { data, error } = await supabase
        .from('intentos_login')
        .select('intentos')
        .eq('email', email)
        .eq('ip_address', ipAddress)
        .single();

      const intentos = (data?.intentos || 0) + 1;
      const bloqueado_hasta = intentos >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null;

      await supabase
        .from('intentos_login')
        .upsert(
          {
            email,
            ip_address: ipAddress,
            intentos,
            bloqueado_hasta,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'email,ip_address' }
        );

      return { intentos, bloqueado: intentos >= 5 };
    } catch (err) {
      console.error('Error registrando intento fallido:', err);
      return { intentos: 1, bloqueado: false };
    }
  }

  /**
   * Limpiar intentos fallidos tras login exitoso
   */
  static async limpiarIntentosLogin(email, ipAddress) {
    try {
      await supabase
        .from('intentos_login')
        .delete()
        .eq('email', email)
        .eq('ip_address', ipAddress);
    } catch (err) {
      console.error('Error limpiando intentos:', err);
    }
  }

  /**
   * Validar que no exista correo duplicado
   */
  static async validarCorreoUnico(email) {
    try {
      const { data, error } = await supabase
        .from('carfutpro')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') return true; // No existe = es único
      return !data; // Si existe, retorna false
    } catch (err) {
      console.error('Error validando correo:', err);
      return false;
    }
  }

  /**
   * Generar hash MD5 de imagen usando Web Crypto API
   */
  static async generarHashFoto(base64) {
    try {
      // Convertir base64 a ArrayBuffer
      const binaryString = atob(base64.split(',')[1] || base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Generar hash SHA-256 (más moderno que MD5)
      const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.error('Error generando hash:', err);
      return null;
    }
  }

  /**
   * Verificar si foto ya existe (duplicada)
   */
  static async verificarFotoDuplicada(hash) {
    try {
      const { data, error } = await supabase
        .from('fotos_fingerprint')
        .select('user_id')
        .eq('hash_md5', hash);

      return data && data.length > 0;
    } catch (err) {
      console.error('Error verificando foto duplicada:', err);
      return false;
    }
  }

  /**
   * Registrar fingerprint de foto
   */
  static async registrarFotoFingerprint(userId, fotoUrl, hashMd5) {
    try {
      await supabase
        .from('fotos_fingerprint')
        .insert({
          user_id: userId,
          foto_url: fotoUrl,
          hash_md5: hashMd5,
          hash_perceptual: hashMd5 // Aquí podrías usar librería de hash perceptual
        });
    } catch (err) {
      console.error('Error registrando fingerprint:', err);
    }
  }

  /**
   * Escanear texto por palabras prohibidas
   */
  static async escanearTexto(texto) {
    try {
      const { data, error } = await supabase
        .rpc('escanear_palabras_prohibidas', { p_texto: texto });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error escaneando texto:', err);
      return [];
    }
  }

  /**
   * Validar contenido de comentario/mensaje
   */
  static async validarContenido(texto, tipo = 'comentario') {
    const palabras = await this.escanearTexto(texto);
    
    if (palabras.length > 0) {
      return {
        valido: false,
        razon: `Contiene lenguaje prohibido: ${palabras[0].palabra}`,
        severidad: palabras[0].severidad
      };
    }

    return { valido: true, razon: null, severidad: 0 };
  }

  /**
   * Registrar contenido inapropiado
   */
  static async registrarContenidoInapropiado(userId, tipoContenido, contenidoId, clasificacion, confianza) {
    try {
      await supabase
        .from('contenido_inapropiado')
        .insert({
          user_id: userId,
          tipo_contenido: tipoContenido,
          contenido_id: contenidoId,
          clasificacion,
          confianza,
          flagged_at: new Date().toISOString()
        });
    } catch (err) {
      console.error('Error registrando contenido inapropiado:', err);
    }
  }

  /**
   * Crear reporte de usuario
   */
  static async crearReporte(usuarioReportadoId, usuarioReportanteId, razon, descripcion) {
    try {
      const { data, error } = await supabase
        .from('reportes_usuarios')
        .insert({
          usuario_reportado_id: usuarioReportadoId,
          usuario_reportante_id: usuarioReportanteId,
          razon,
          descripcion,
          estado: 'pendiente',
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return { exito: true, reporte: data[0] };
    } catch (err) {
      console.error('Error creando reporte:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Generar token de recuperación de contraseña
   */
  static async generarTokenRecuperacion(userId, email) {
    try {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const tokenExpira = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      const { data, error } = await supabase
        .from('recuperacion_contrasena')
        .insert({
          user_id: userId,
          email,
          token,
          token_expira: tokenExpira.toISOString()
        })
        .select();

      if (error) throw error;
      return { exito: true, token };
    } catch (err) {
      console.error('Error generando token:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Verificar token de recuperación
   */
  static async verificarTokenRecuperacion(token) {
    try {
      const { data, error } = await supabase
        .from('recuperacion_contrasena')
        .select('*')
        .eq('token', token)
        .eq('utilizado', false)
        .gt('token_expira', new Date().toISOString())
        .single();

      if (error && error.code === 'PGRST116') {
        return { valido: false, error: 'Token inválido o expirado' };
      }

      if (error) throw error;
      return { valido: true, usuario: data };
    } catch (err) {
      console.error('Error verificando token:', err);
      return { valido: false, error: err.message };
    }
  }

  /**
   * Marcar token como utilizado
   */
  static async marcarTokenUtilizado(token) {
    try {
      await supabase
        .from('recuperacion_contrasena')
        .update({ utilizado: true })
        .eq('token', token);
    } catch (err) {
      console.error('Error marcando token:', err);
    }
  }

  /**
   * Obtener IP del cliente
   */
  static async obtenerIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (err) {
      console.error('Error obteniendo IP:', err);
      return 'desconocida';
    }
  }

  /**
   * Bloquear usuario
   */
  static async bloquearUsuario(usuarioId, razon, descripcion) {
    try {
      await supabase
        .from('usuarios_bloqueados')
        .insert({
          usuario_id: usuarioId,
          razon,
          descripcion,
          bloqueado_por: 'SISTEMA',
          estado: 'activo'
        });

      return { exito: true };
    } catch (err) {
      console.error('Error bloqueando usuario:', err);
      return { exito: false, error: err.message };
    }
  }
}

export default SecurityService;

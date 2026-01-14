import { supabase } from '../config/supabase';
import SecurityService from './SecurityService';

/**
 * ContentModerationService - Moderación automática de contenido
 * Detecta: pornografía, violencia, spam, amenazas, contenido racista/sexual
 */

export class ContentModerationService {
  // Configuración de sanciones
  static SANCION_CONFIG = {
    warning: { dias: 0, permanente: false },
    suspension_24h: { dias: 1, permanente: false },
    suspension_7d: { dias: 7, permanente: false },
    cancelacion: { dias: null, permanente: true }
  };

  // Mapeo de severidad a sanción
  static SEVERIDAD_A_SANCION = {
    1: 'warning',           // Leve
    2: 'warning',           // Leve
    3: 'suspension_24h',    // Moderado
    4: 'suspension_7d',     // Grave
    5: 'cancelacion'        // Crítico
  };

  /**
   * Validar foto antes de subir
   */
  static async validarFoto(file, userId) {
    const errores = [];

    // Validar tamaño (10 MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      errores.push('Foto demasiado grande (máximo 10 MB)');
    }

    // Validar formato
    if (!file.type.startsWith('image/')) {
      errores.push('Formato de archivo no válido');
    }

    // Validar que no sea foto duplicada
    if (!errores.length) {
      const esduplicada = await this.verificarFotoDuplicada(file, userId);
      if (esduplicada) {
        errores.push('Esta foto ya existe en tu perfil');
      }
    }

    // Validar contenido inapropiado (mock - usar API real como Google Vision)
    if (!errores.length) {
      const validacion = await this.validarContenidoFoto(file);
      if (!validacion.valido) {
        errores.push(`Foto rechazada: ${validacion.razon}`);
      }
    }

    return {
      valido: errores.length === 0,
      errores,
      warnings: []
    };
  }

  /**
   * Validar video antes de subir
   */
  static async validarVideo(file, userId) {
    const errores = [];

    // Validar tamaño (50 MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      errores.push('Video demasiado grande (máximo 50 MB)');
    }

    // Validar formato
    if (!['video/mp4', 'video/webm', 'video/mpeg'].includes(file.type)) {
      errores.push('Formato de video no válido. Usa MP4, WebM o MPEG');
    }

    // Obtener duración del video
    const duracion = await this.obtenerDuracionVideo(file);
    if (duracion > 60) { // 1 minuto máximo
      errores.push(`Video demasiado largo (máximo 60 segundos, tú: ${duracion}s)`);
    }

    return {
      valido: errores.length === 0,
      errores,
      warnings: []
    };
  }

  /**
   * Obtener duración de video
   */
  static obtenerDuracionVideo(file) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Verificar foto duplicada
   */
  static async verificarFotoDuplicada(file, userId) {
    try {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = async () => {
          const hash = await SecurityService.generarHashFoto(reader.result);
          const duplicada = await SecurityService.verificarFotoDuplicada(hash);
          resolve(duplicada);
        };
        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error('Error verificando duplicada:', err);
      return false;
    }
  }

  /**
   * Validar contenido de foto (mock - usar Google Vision API real)
   */
  static async validarContenidoFoto(file) {
    // AQUÍ: Integrar Google Vision API o similar
    // Para ahora, simulamos detección básica
    return { valido: true, razon: null };
  }

  /**
   * Validar caption/pie de foto
   */
  static async validarCaption(texto, userId) {
    const validacion = await SecurityService.validarContenido(texto, 'caption');
    return validacion;
  }

  /**
   * Aplicar sanción progresiva
   */
  static async aplicarSancion(usuarioId, tipoSancion, razon, descripcion, severidad, contenidoId, tipoContenido) {
    try {
      const { data, error } = await supabase.rpc('aplicar_sancion', {
        p_usuario_id: usuarioId,
        p_tipo_sancion: tipoSancion,
        p_razon: razon,
        p_descripcion: descripcion,
        p_severidad: severidad,
        p_contenido_id: contenidoId,
        p_tipo_contenido: tipoContenido
      });

      if (error) throw error;
      return { exito: true, sancion: data?.[0] };
    } catch (err) {
      console.error('Error aplicando sanción:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Marcar contenido para revisión manual
   */
  static async marcarParaRevision(usuarioId, tipoContenido, contenidoId, razonMarcado, confianza) {
    try {
      const { error } = await supabase
        .from('contenido_revisar')
        .insert({
          usuario_id: usuarioId,
          tipo_contenido: tipoContenido,
          contenido_id: contenidoId,
          razon_marcado: razonMarcado,
          confianza,
          estado: 'pendiente',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { exito: true };
    } catch (err) {
      console.error('Error marcando para revisión:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Verificar si usuario puede postear
   */
  static async puedeUsuarioPostear(usuarioId) {
    try {
      const { data, error } = await supabase.rpc('puede_usuario_postear', {
        user_id: usuarioId
      });

      if (error) throw error;
      return data?.[0] || { puede: true, razon: null };
    } catch (err) {
      console.error('Error verificando si puede postear:', err);
      return { puede: true, razon: null };
    }
  }

  /**
   * Obtener sanciones activas
   */
  static async obtenerSancionesActivas(usuarioId) {
    try {
      const { data, error } = await supabase.rpc('obtener_sanciones_activas', {
        user_id: usuarioId
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error obteniendo sanciones:', err);
      return [];
    }
  }

  /**
   * Crear reporte de contenido
   */
  static async reportarContenido(usuarioCreadorId, usuarioReportanteId, tipoContenido, contenidoId, razon, descripcion) {
    try {
      const { data, error } = await supabase
        .from('reportes_contenido')
        .insert({
          usuario_creador_id: usuarioCreadorId,
          usuario_reportante_id: usuarioReportanteId,
          tipo_contenido: tipoContenido,
          contenido_id: contenidoId,
          razon,
          descripcion,
          estado: 'pendiente',
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return { exito: true, reporte: data?.[0] };
    } catch (err) {
      console.error('Error reportando:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Apelar sanción
   */
  static async apelarSancion(sancionId, motivoApelacion, evidencia) {
    try {
      const { data: usuario } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('apelaciones_sancion')
        .insert({
          sancion_id: sancionId,
          usuario_id: usuario.user.id,
          motivo: motivoApelacion,
          evidencia: evidencia || {},
          estado: 'pendiente',
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return { exito: true, apelacion: data?.[0] };
    } catch (err) {
      console.error('Error apelando sanción:', err);
      return { exito: false, error: err.message };
    }
  }

  /**
   * Detectar tipo de contenido inapropiado
   */
  static async detectarTipoInapropiado(texto, archivo = null) {
    const palabras = await SecurityService.escanearTexto(texto || '');

    if (palabras.length > 0) {
      const palabra = palabras[0];
      return {
        detectado: true,
        tipo: palabra.tipo, // 'ofensiva', 'ilegal', 'amenaza'
        severidad: palabra.severidad,
        palabra: palabra.palabra
      };
    }

    return { detectado: false };
  }

  /**
   * Determinar sanción basada en severidad y tipo
   */
  static determinarSancion(severidad, tipoContenido) {
    // Pornografía, violencia, amenazas, racismo, contenido sexual: CANCELACIÓN
    if (['pornografia', 'violencia', 'amenaza', 'racismo', 'contenido_sexual'].includes(tipoContenido)) {
      return 'cancelacion';
    }

    // Spam: suspensión progresiva
    if (tipoContenido === 'spam') {
      if (severidad <= 2) return 'suspension_24h';
      if (severidad <= 4) return 'suspension_7d';
      return 'cancelacion';
    }

    // Fallback
    return this.SEVERIDAD_A_SANCION[Math.min(5, Math.max(1, severidad))];
  }

  /**
   * Registrar foto en fingerprint
   */
  static async registrarFotoFingerprint(userId, fotoUrl, file) {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const hash = await SecurityService.generarHashFoto(reader.result);
        await SecurityService.registrarFotoFingerprint(userId, fotoUrl, hash);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error registrando fingerprint:', err);
    }
  }

  /**
   * Obtener configuración de moderación
   */
  static async obtenerConfiguracion() {
    try {
      const { data, error } = await supabase
        .from('config_moderacion')
        .select('*');

      if (error) throw error;

      const config = {};
      data.forEach(item => {
        if (item.tipo === 'numero') {
          config[item.clave] = parseInt(item.valor);
        } else if (item.tipo === 'json') {
          config[item.clave] = JSON.parse(item.valor);
        } else {
          config[item.clave] = item.valor;
        }
      });

      return config;
    } catch (err) {
      console.error('Error obteniendo configuración:', err);
      return {};
    }
  }
}

export default ContentModerationService;

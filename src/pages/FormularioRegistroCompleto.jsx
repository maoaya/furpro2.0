import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment';
import { signUpWithAutoConfirm } from '../utils/autoConfirmSignup';
import { signupBypass } from '../api/signupBypass';

const gold = '#FFD700';

export default function FormularioRegistroCompleto() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pasoActual, setPasoActual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoApplied, setGeoApplied] = useState(false);
  const [lang, setLang] = useState('es');

  // Diccionario mínimo de traducciones (ES por defecto)
  const I18N = {
    es: {
      step1Title: 'Paso 1: Credenciales',
      step2Title: 'Paso 2: Datos Personales',
      step3Title: 'Paso 3: Info Futbolística',
      step4Title: 'Paso 4: Disponibilidad',
      step5Title: 'Paso 5: Foto de Perfil',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      categoria: 'Categoría',
      nombre: 'Nombre',
      apellido: 'Apellido',
      edad: 'Edad',
      telefono: 'Teléfono (opcional)',
      pais: 'País',
      ciudad: 'Ciudad',
      equipoFavorito: 'Equipo favorito',
      peso: 'Peso (kg)',
      altura: 'Altura (cm)',
      pieHabil_Derecho: 'Pie Derecho',
      pieHabil_Izquierdo: 'Pie Izquierdo',
      pieHabil_Ambidiestro: 'Ambidiestro',
      frecuencia_ocasional: 'Ocasional (1-2 veces/mes)',
      frecuencia_regular: 'Regular (1 vez/semana)',
      frecuencia_frecuente: 'Frecuente (2-3 veces/semana)',
      frecuencia_intensivo: 'Intensivo (4+ veces/semana)',
      horario_madrugadas: 'Madrugadas',
      horario_mañanas: 'Mañanas',
      horario_mediodia: 'Mediodía',
      horario_tardes: 'Tardes',
      horario_tardes_noche: 'Tardes – Noche',
      horario_noches: 'Noches',
      horario_fines_semana: 'Fines de semana',
      objetivos: '¿Qué buscas en FutPro? (opcional)',
      infantil_femenina: 'Infantil Femenina',
      infantil_masculina: 'Infantil Masculina',
      femenina: 'Femenina',
      masculina: 'Masculina',
      pos_Portero: '🥅 Portero',
      pos_DefensaCentral: '🛡️ Defensa Central',
      pos_LateralDerecho: '➡️ Lateral Derecho',
      pos_LateralIzquierdo: '⬅️ Lateral Izquierdo',
      pos_CarrileroDerecho: '➡️ Carrilero Derecho',
      pos_CarrileroIzquierdo: '⬅️ Carrilero Izquierdo',
      pos_MediocampistaDefensivo: '🔒 Mediocampista Defensivo',
      pos_MediocampistaCentral: '⚖️ Mediocampista Central',
      pos_MediocampistaOfensivo: '🎯 Mediocampista Ofensivo',
      pos_Pivote: '🧭 Pivote',
      pos_InteriorDerecho: '➡️ Interior Derecho',
      pos_InteriorIzquierdo: '⬅️ Interior Izquierdo',
      pos_Enganche: '🎩 Enganche / Media Punta',
      pos_ExtremoDerecho: '🏃‍♂️ Extremo Derecho',
      pos_ExtremoIzquierdo: '🏃‍♂️ Extremo Izquierdo',
      pos_DelanteroCentro: '⚽ Delantero Centro',
      pos_SegundoDelantero: '🎯 Segundo Delantero',
      pos_Flexible: '🔄 Flexible',
      anterior: '← Anterior',
      siguiente: 'Siguiente →',
      completar: '✓ Completar',
      creando: 'Creando cuenta...',
      continuarGoogle: 'Continuar con Google',
      errEmailPassReq: 'Email y contraseña son requeridos',
      errPasswordMismatch: 'Las contraseñas no coinciden',
      errPasswordShort: 'La contraseña debe tener al menos 6 caracteres',
      errNombreApellidoEdadReq: 'Nombre, apellido y edad son requeridos',
      errSeleccionaPosicion: 'Selecciona una posición'
    },
    en: {
      step1Title: 'Step 1: Credentials',
      step2Title: 'Step 2: Personal Info',
      step3Title: 'Step 3: Football Info',
      step4Title: 'Step 4: Availability',
      step5Title: 'Step 5: Profile Photo',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      categoria: 'Category',
      nombre: 'First name',
      apellido: 'Last name',
      edad: 'Age',
      telefono: 'Phone (optional)',
      pais: 'Country',
      ciudad: 'City',
      equipoFavorito: 'Favorite team',
      peso: 'Weight (kg)',
      altura: 'Height (cm)',
      pieHabil_Derecho: 'Right foot',
      pieHabil_Izquierdo: 'Left foot',
      pieHabil_Ambidiestro: 'Both feet',
      frecuencia_ocasional: 'Occasional (1-2/month)',
      frecuencia_regular: 'Regular (1/week)',
      frecuencia_frecuente: 'Frequent (2-3/week)',
      frecuencia_intensivo: 'Intensive (4+/week)',
      horario_madrugadas: 'Early morning',
      horario_mañanas: 'Mornings',
      horario_mediodia: 'Midday',
      horario_tardes: 'Afternoons',
      horario_tardes_noche: 'Evening',
      horario_noches: 'Nights',
      horario_fines_semana: 'Weekends',
      objetivos: 'What are your goals in FutPro? (optional)',
      infantil_femenina: 'Girls U',
      infantil_masculina: 'Boys U',
      femenina: 'Women',
      masculina: 'Men',
      pos_Portero: '🥅 Goalkeeper',
      pos_DefensaCentral: '🛡️ Center Back',
      pos_LateralDerecho: '➡️ Right Back',
      pos_LateralIzquierdo: '⬅️ Left Back',
      pos_CarrileroDerecho: '➡️ Right Wing-back',
      pos_CarrileroIzquierdo: '⬅️ Left Wing-back',
      pos_MediocampistaDefensivo: '🔒 Defensive Midfielder',
      pos_MediocampistaCentral: '⚖️ Central Midfielder',
      pos_MediocampistaOfensivo: '🎯 Attacking Midfielder',
      pos_Pivote: '🧭 Pivot',
      pos_InteriorDerecho: '➡️ Right Interior',
      pos_InteriorIzquierdo: '⬅️ Left Interior',
      pos_Enganche: '🎩 Playmaker / AM',
      pos_ExtremoDerecho: '🏃‍♂️ Right Winger',
      pos_ExtremoIzquierdo: '🏃‍♂️ Left Winger',
      pos_DelanteroCentro: '⚽ Striker',
      pos_SegundoDelantero: '🎯 Second Striker',
      pos_Flexible: '🔄 Versatile',
      anterior: '← Back',
      siguiente: 'Next →',
      completar: '✓ Finish',
      creando: 'Creating account...',
      continuarGoogle: 'Continue with Google',
      errEmailPassReq: 'Email and password are required',
      errPasswordMismatch: 'Passwords do not match',
      errPasswordShort: 'Password must be at least 6 characters',
      errNombreApellidoEdadReq: 'First name, last name and age are required',
      errSeleccionaPosicion: 'Select a position'
    },
    pt: {
      step1Title: 'Passo 1: Credenciais',
      step2Title: 'Passo 2: Dados Pessoais',
      step3Title: 'Passo 3: Info de Futebol',
      step4Title: 'Passo 4: Disponibilidade',
      step5Title: 'Passo 5: Foto de Perfil',
      email: 'E-mail',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      categoria: 'Categoria',
      nombre: 'Nome',
      apellido: 'Sobrenome',
      edad: 'Idade',
      telefono: 'Telefone (opcional)',
      pais: 'País',
      ciudad: 'Cidade',
      equipoFavorito: 'Time favorito',
      peso: 'Peso (kg)',
      altura: 'Altura (cm)',
      pieHabil_Derecho: 'Destro',
      pieHabil_Izquierdo: 'Canhoto',
      pieHabil_Ambidiestro: 'Ambidestro',
      frecuencia_ocasional: 'Ocasional (1-2/mês)',
      frecuencia_regular: 'Regular (1/semana)',
      frecuencia_frecuente: 'Frequente (2-3/semana)',
      frecuencia_intensivo: 'Intensivo (4+/semana)',
      horario_madrugadas: 'Madrugada',
      horario_mañanas: 'Manhãs',
      horario_mediodia: 'Meio-dia',
      horario_tardes: 'Tardes',
      horario_tardes_noche: 'Fim de tarde',
      horario_noches: 'Noites',
      horario_fines_semana: 'Fins de semana',
      objetivos: 'Quais seus objetivos no FutPro? (opcional)',
      infantil_femenina: 'Infantil Feminino',
      infantil_masculina: 'Infantil Masculino',
      femenina: 'Feminino',
      masculina: 'Masculino',
      pos_Portero: '🥅 Goleiro',
      pos_DefensaCentral: '🛡️ Zagueiro',
      pos_LateralDerecho: '➡️ Lateral Direito',
      pos_LateralIzquierdo: '⬅️ Lateral Esquerdo',
      pos_CarrileroDerecho: '➡️ Ala Direito',
      pos_CarrileroIzquierdo: '⬅️ Ala Esquerdo',
      pos_MediocampistaDefensivo: '🔒 Volante',
      pos_MediocampistaCentral: '⚖️ Meio-campista Central',
      pos_MediocampistaOfensivo: '🎯 Meia Ofensivo',
      pos_Pivote: '🧭 Pivô',
      pos_InteriorDerecho: '➡️ Interior Direito',
      pos_InteriorIzquierdo: '⬅️ Interior Esquerdo',
      pos_Enganche: '🎩 Armador / Meia',
      pos_ExtremoDerecho: '🏃‍♂️ Ponta Direita',
      pos_ExtremoIzquierdo: '🏃‍♂️ Ponta Esquerda',
      pos_DelanteroCentro: '⚽ Centroavante',
      pos_SegundoDelantero: '🎯 Segundo Atacante',
      pos_Flexible: '🔄 Versátil',
      anterior: '← Voltar',
      siguiente: 'Avançar →',
      completar: '✓ Concluir',
      creando: 'Criando conta...',
      continuarGoogle: 'Continuar com Google',
      errEmailPassReq: 'E-mail e senha são obrigatórios',
      errPasswordMismatch: 'As senhas não coincidem',
      errPasswordShort: 'A senha deve ter pelo menos 6 caracteres',
      errNombreApellidoEdadReq: 'Nome, sobrenome e idade são obrigatórios',
      errSeleccionaPosicion: 'Selecione uma posição'
    }
  };

  const UI_MISC = {
    es: {
      regTitle: 'Registro Completo',
      photoOptionalNote: 'Foto opcional. Puedes agregarla después desde tu perfil.',
      stepWord: 'Paso',
      ofWord: 'de',
      autosaveActive: 'Autoguardado activo',
      niveles: { principiante: 'Principiante', intermedio: 'Intermedio', avanzado: 'Avanzado', elite: 'Élite' },
      errGoogleSignIn: 'No se pudo iniciar sesión con Google',
      errCompleteRegistration: 'Error al completar registro'
    },
    en: {
      regTitle: 'Complete Registration',
      photoOptionalNote: 'Optional photo. You can add it later from your profile.',
      stepWord: 'Step',
      ofWord: 'of',
      autosaveActive: 'Auto-save enabled',
      niveles: { principiante: 'Beginner', intermedio: 'Intermediate', avanzado: 'Advanced', elite: 'Elite' },
      errGoogleSignIn: 'Could not sign in with Google',
      errCompleteRegistration: 'Error completing registration'
    },
    pt: {
      regTitle: 'Cadastro Completo',
      photoOptionalNote: 'Foto opcional. Você pode adicioná-la depois no seu perfil.',
      stepWord: 'Passo',
      ofWord: 'de',
      autosaveActive: 'Salvamento automático ativo',
      niveles: { principiante: 'Iniciante', intermedio: 'Intermediário', avanzado: 'Avançado', elite: 'Elite' },
      errGoogleSignIn: 'Não foi possível entrar com o Google',
      errCompleteRegistration: 'Erro ao concluir o cadastro'
    }
  };

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;

  // Auto-detectar idioma por navegador (fallback EN/ES)
  useEffect(() => {
    try {
      const nav = (navigator.language || 'es').toLowerCase();
      if (nav.startsWith('es')) setLang('es');
      else if (nav.startsWith('pt')) setLang('pt');
      else setLang('en');
    } catch (_) {
      setLang('es');
    }
  }, []);
  
  // Estado del formulario completo
  const [formData, setFormData] = useState({
    // Paso 1: Credenciales
    email: '',
    password: '',
    confirmPassword: '',
    categoria: 'infantil_femenina',
    
    // Paso 2: Datos Personales
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
  pais: 'Colombia',
  ciudad: 'Bogotá',
    
    // Paso 3: Info Futbolística
    posicion: 'Flexible',
    nivelHabilidad: 'Principiante',
    equipoFavorito: '',
    peso: '',
    altura: '',
    pieHabil: 'Derecho',
    
    // Paso 4: Disponibilidad
    frecuenciaJuego: 'ocasional',
  horarioPreferido: 'tardes',
    objetivos: '',
    
    // Paso 5: Foto
    imagenPerfil: null,
    previewUrl: null
  });

  // Mapa dinámico de países y ciudades comunes (extensible)
  const PAISES_CIUDADES = {
    Colombia: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'],
    México: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
    Argentina: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
    Chile: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'],
    Perú: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Piura'],
    Ecuador: ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato'],
    España: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
    USA: ['Miami', 'New York', 'Los Angeles', 'Houston', 'Chicago'],
    Otro: ['Otra ciudad']
  };

  // Alias para normalizar países que devuelven APIs de geolocalización
  const COUNTRY_ALIASES = {
    'United States': 'USA',
    'United States of America': 'USA',
    'US': 'USA',
    'Mexico': 'México',
    'Spain': 'España',
    'Peru': 'Perú',
    'Colombia': 'Colombia',
    'Argentina': 'Argentina',
    'Chile': 'Chile',
    'Ecuador': 'Ecuador'
  };

  // Prefijos telefónicos por país (para autocompletar teléfono)
  const DIAL_CODES = {
    Colombia: '+57',
    México: '+52',
    Argentina: '+54',
    Chile: '+56',
    Perú: '+51',
    Ecuador: '+593',
    España: '+34',
    USA: '+1',
    Otro: ''
  };

  // Si cambia el país, asegurar que la ciudad sea válida
  useEffect(() => {
    const ciudades = PAISES_CIUDADES[formData.pais] || [];
    if (ciudades.length && !ciudades.includes(formData.ciudad)) {
      setFormData(prev => ({ ...prev, ciudad: ciudades[0] }));
    }
  }, [formData.pais]);

  // Leer categoría desde navegación
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qs = params.get('categoria');
      const fromState = location.state?.categoria;
      const draftRaw = localStorage.getItem('draft_carfutpro');
      const draft = draftRaw ? JSON.parse(draftRaw) : null;
      const initial = fromState || qs || draft?.categoria;
      if (initial) setFormData(prev => ({ ...prev, categoria: initial }));
    } catch (e) {
      console.warn('No se pudo inicializar categoría:', e);
    }
  }, [location.state]);

  // Autoguardado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const draft = { ...formData, ultimoGuardado: new Date().toISOString() };
        localStorage.setItem('draft_registro_completo', JSON.stringify(draft));
        console.log('📝 Autoguardado realizado');
      } catch (e) {
        console.warn('Error en autoguardado:', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  // Configurar horario sugerido automático (sin APIs externas bloqueadas por CSP)
  useEffect(() => {
    if (geoApplied) return;
    
    // Solo ajustar horario preferido según hora local del navegador
    const h = new Date().getHours();
    let horarioPreferido = 'mañanas';
    if (h < 5) horarioPreferido = 'madrugadas';
    else if (h < 12) horarioPreferido = 'mañanas';
    else if (h < 14) horarioPreferido = 'mediodia';
    else if (h < 19) horarioPreferido = 'tardes';
    else if (h < 21) horarioPreferido = 'tardes_noche';
    else horarioPreferido = 'noches';
    
    setFormData(prev => ({
      ...prev,
      horarioPreferido
    }));
    
    setGeoApplied(true);
  }, [geoApplied]);

  // REMOVIDO: APIs de geolocalización (ipapi.co, ipwho.is) bloqueadas por CSP
  // Usuario selecciona país/ciudad manualmente del dropdown

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagenPerfil: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const validarPaso = (paso) => {
    setError(null);
    switch (paso) {
      case 1:
        if (!formData.email || !formData.password) {
          setError(t('errEmailPassReq'));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t('errPasswordMismatch'));
          return false;
        }
        if (formData.password.length < 6) {
          setError(t('errPasswordShort'));
          return false;
        }
        return true;
      case 2:
        if (!formData.nombre || !formData.apellido || !formData.edad) {
          setError(t('errNombreApellidoEdadReq'));
          return false;
        }
        return true;
      case 3:
        if (!formData.posicion) {
          setError(t('errSeleccionaPosicion'));
          return false;
        }
        return true;
      case 4:
        return true; // Opcional
      case 5:
        return true; // Foto es opcional
      default:
        return true;
    }
  };

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual(prev => Math.min(prev + 1, 5));
    }
  };

  const pasoAnterior = () => {
    setPasoActual(prev => Math.max(prev - 1, 1));
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 [REGISTRO] Iniciando OAuth con Google...');
      console.log('📍 Paso actual:', pasoActual);
      console.log('📍 Formulario completado:', formData);
      console.log('📍 Redirect URL:', `${window.location.origin}/auth/callback`);

      // Verificar que estemos en el paso correcto
      if (pasoActual !== 5) {
        console.error('❌ Error: Botón de Google clickeado fuera del paso 5');
        setError('Completa todos los pasos del formulario primero');
        return;
      }

      // Guardar contexto del formulario para recuperarlo después del OAuth
      try {
        localStorage.setItem('oauth_origin', 'formulario_registro');
        localStorage.setItem('post_auth_target', '/registro-perfil');

        // Calcular puntaje inicial
        const puntaje = calcularPuntajeInicial({
          nivelHabilidad: formData.nivelHabilidad,
          edad: Number(formData.edad) || 0,
          frecuenciaJuego: formData.frecuenciaJuego
        });

        // Preparar datos preliminares para la card
        const cardData = {
          id: `temp-${Date.now()}`,
          categoria: formData.categoria || 'masculina',
          nombre: `${formData.nombre || 'Jugador'} ${formData.apellido || ''}`.trim(),
          ciudad: formData.ciudad || '',
          pais: formData.pais || '',
          posicion_favorita: formData.posicion || 'Flexible',
          nivel_habilidad: formData.nivelHabilidad || 'Principiante',
          puntaje: puntaje,
          equipo: formData.equipoFavorito || '—',
          fecha_registro: new Date().toISOString(),
          esPrimeraCard: true,
          avatar_url: formData.previewUrl || ''
        };

        localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData));
        localStorage.setItem('show_first_card', 'true');

        // Guardar borrador completo del formulario
        const draft = { ...formData, ultimoGuardado: new Date().toISOString() };
        localStorage.setItem('futpro_registro_draft', JSON.stringify(draft));

        console.log('💾 Datos de formulario guardados en localStorage');
      } catch (e) {
        console.warn('⚠️ No se pudo preparar el estado previo a OAuth:', e);
      }

      console.log('🚀 Llamando a supabase.auth.signInWithOAuth...');

      // Usar el método correcto de Supabase para OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });

      console.log('📊 Respuesta OAuth:', { data, error });

      if (error) {
        console.error('❌ Error OAuth:', error);
        throw error;
      }

      console.log('✅ OAuth iniciado exitosamente, esperando redirección...');

    } catch (error) {
      console.error('❌ Error completo en handleGoogleSignup:', error);
      setError(`Error al iniciar sesión con Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular puntaje inicial basado en datos del usuario
  const calcularPuntajeInicial = (datos) => {
    let puntaje = 50; // Base para todos
    
    // Bonus por nivel de habilidad
    const bonusNivel = {
      'Principiante': 0,
      'Intermedio': 10,
      'Avanzado': 20,
      'Élite': 30
    };
    puntaje += bonusNivel[datos.nivelHabilidad] || 0;
    
    // Bonus por edad (menores de 18 años)
    if (datos.edad < 18) {
      puntaje += 5;
    }
    
    // Bonus por frecuencia de juego
    const bonusFrecuencia = {
      'ocasional': 0,
      'regular': 5,
      'frecuente': 10,
      'intensivo': 15
    };
    puntaje += bonusFrecuencia[datos.frecuenciaJuego] || 0;
    
    return puntaje;
  };

  const completarRegistro = async () => {
    if (!validarPaso(pasoActual)) return;
    
    try {
      setLoading(true);
      setError(null);
      let currentUser = null;

      // 1. Crear cuenta en Supabase Auth usando helper con auto-confirm y bypass de captcha token
      const signUpResult = await signUpWithAutoConfirm({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nombre} ${formData.apellido}`,
            display_name: formData.nombre
          }
        }
      });

      if (signUpResult.success) {
        currentUser = signUpResult.user || null;
      } else {
        const msg = String(signUpResult.error?.message || '').toLowerCase();
        // 1.b Fallback: si falla por CAPTCHA, usar Netlify Function con Service Role
        if (msg.includes('captcha') || msg.includes('verification process failed')) {
          console.warn('🛡️ CAPTCHA bloqueó el registro. Intentando bypass seguro...');
          const bypass = await signupBypass({
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            nombre: `${formData.nombre} ${formData.apellido}`.trim()
          });
          if (!bypass.ok) {
            const errorDetail = bypass.error || '';
            const isConfigError = errorDetail.includes('500') || errorDetail.includes('service role');
            
            if (isConfigError) {
              setError(
                `⚠️ Error de configuración del servidor (CAPTCHA bloqueado).\n\n` +
                `Para resolverlo:\n` +
                `1. Accede al dashboard de Netlify\n` +
                `2. Configura la variable SUPABASE_SERVICE_ROLE_KEY\n` +
                `3. Desactiva CAPTCHA temporalmente en Supabase Auth\n\n` +
                `Alternativa: Usa "Continuar con Google" (funciona sin problemas).\n\n` +
                `Detalle técnico: ${errorDetail}`
              );
            } else {
              setError('No se pudo crear la cuenta (CAPTCHA). Intenta más tarde o usa Google. Detalle: ' + errorDetail);
            }
            setLoading(false);
            return;
          }
          // Intentar iniciar sesión ahora que el usuario existe
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: formData.email.toLowerCase().trim(),
            password: formData.password
          });
          if (signInErr) {
            console.warn('Cuenta creada por bypass pero no se pudo iniciar sesión automáticamente:', signInErr.message);
            if (bypass.redirectLink) {
              window.location.assign(bypass.redirectLink);
              return;
            }
            setError('Cuenta creada. Ve al login para iniciar sesión.');
            setLoading(false);
            return;
          }
          currentUser = signInData?.user || null;
        } else {
          setError(signUpResult.error?.message || 'No se pudo crear la cuenta.');
          setLoading(false);
          return;
        }
      }

      // 2. Subir foto si existe
      let fotoUrl = null;
      if (formData.imagenPerfil && currentUser) {
        const fileName = `${currentUser.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.imagenPerfil);
        
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(uploadData.path);
          fotoUrl = urlData.publicUrl;
        }
      }

      // 2.5. Calcular puntaje inicial basado en datos del usuario
      const puntajeInicial = calcularPuntajeInicial({
        edad: parseInt(formData.edad),
        nivelHabilidad: formData.nivelHabilidad,
        frecuenciaJuego: formData.frecuenciaJuego
      });

      // 3. Crear registro en tabla carfutpro
      if (currentUser) {
        const cardData = {
          user_id: currentUser.id,
          categoria: formData.categoria,
          nombre: `${formData.nombre} ${formData.apellido}`,
          ciudad: formData.ciudad,
          pais: formData.pais,
          posicion_favorita: formData.posicion,
          nivel_habilidad: formData.nivelHabilidad,
          puntaje: puntajeInicial, // Puntaje calculado basado en datos del usuario
          equipo: formData.equipoFavorito,
          avatar_url: fotoUrl,
          creada_en: new Date().toISOString(),
          estado: 'activa',
          // Datos adicionales
          edad: parseInt(formData.edad),
          telefono: formData.telefono,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          altura: formData.altura ? parseFloat(formData.altura) : null,
          pie_habil: formData.pieHabil,
          frecuencia_juego: formData.frecuenciaJuego,
          horario_preferido: formData.horarioPreferido,
          objetivos: formData.objetivos
        };

        const { data, error: insertError } = await supabase
          .from('carfutpro')
          .insert([cardData])
          .select()
          .single();

        if (insertError) throw insertError;

        // 4. Guardar datos para la card
        const cardDisplay = {
          id: data.id,
          categoria: data.categoria,
          nombre: data.nombre,
          ciudad: data.ciudad,
          pais: data.pais,
          posicion_favorita: data.posicion_favorita,
          nivel_habilidad: data.nivel_habilidad,
          puntaje: data.puntaje,
          equipo: data.equipo,
          fecha_registro: data.creada_en,
          esPrimeraCard: true,
          avatar_url: data.avatar_url,
          partidos_jugados: 0,
          goles: 0,
          asistencias: 0
        };

        localStorage.setItem('futpro_user_card_data', JSON.stringify(cardDisplay));
        localStorage.setItem('show_first_card', 'true');
        localStorage.removeItem('draft_registro_completo');

        // 5. Guardar en Firebase Realtime
        try {
          const { database } = await import('../config/firebase.js');
          const { ref, set } = await import('firebase/database');
          await set(ref(database, `carfutpro/${authData.user.id}`), data);
        } catch (e) {
          console.warn('Firebase sync opcional falló:', e);
        }

        // 6. Navegar a la card
        navigate('/perfil-card', { state: { cardData: cardDisplay } });
      }
    } catch (e) {
      setError(e.message || UI_MISC[lang].errCompleteRegistration);
      console.error('Error en registro:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderPaso = () => {
    switch (pasoActual) {
      case 1:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>{t('step1Title')}</h2>
            <input type="email" name="email" required placeholder={t('email')} value={formData.email} onChange={handleChange} style={inputStyle} />
            <input type="password" name="password" required placeholder={t('password')} value={formData.password} onChange={handleChange} style={inputStyle} />
            <input type="password" name="confirmPassword" required placeholder={t('confirmPassword')} value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
            <select name="categoria" value={formData.categoria} onChange={handleChange} required style={inputStyle}>
              <option value="infantil_femenina">{t('infantil_femenina')}</option>
              <option value="infantil_masculina">{t('infantil_masculina')}</option>
              <option value="femenina">{t('femenina')}</option>
              <option value="masculina">{t('masculina')}</option>
            </select>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>{t('step2Title')}</h2>
            <input type="text" name="nombre" required placeholder={t('nombre')} value={formData.nombre} onChange={handleChange} style={inputStyle} />
            <input type="text" name="apellido" required placeholder={t('apellido')} value={formData.apellido} onChange={handleChange} style={inputStyle} />
            <input type="number" name="edad" required placeholder={t('edad')} value={formData.edad} onChange={handleChange} style={inputStyle} min="5" max="99" />
            <input type="tel" name="telefono" placeholder={t('telefono')} value={formData.telefono} onChange={handleChange} style={inputStyle} />
            <select name="pais" value={formData.pais} onChange={handleChange} style={inputStyle}>
              {Object.keys(PAISES_CIUDADES).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select name="ciudad" value={formData.ciudad} onChange={handleChange} style={inputStyle}>
              {(PAISES_CIUDADES[formData.pais] || []).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>{t('step3Title')}</h2>
            <select name="posicion" value={formData.posicion} onChange={handleChange} required style={inputStyle}>
              <option value="Portero">{t('pos_Portero')}</option>
              <option value="Defensa Central">{t('pos_DefensaCentral')}</option>
              <option value="Lateral Derecho">{t('pos_LateralDerecho')}</option>
              <option value="Lateral Izquierdo">{t('pos_LateralIzquierdo')}</option>
              <option value="Carrilero Derecho">{t('pos_CarrileroDerecho')}</option>
              <option value="Carrilero Izquierdo">{t('pos_CarrileroIzquierdo')}</option>
              <option value="Mediocampista Defensivo">{t('pos_MediocampistaDefensivo')}</option>
              <option value="Mediocampista Central">{t('pos_MediocampistaCentral')}</option>
              <option value="Mediocampista Ofensivo">{t('pos_MediocampistaOfensivo')}</option>
              <option value="Pivote">{t('pos_Pivote')}</option>
              <option value="Interior Derecho">{t('pos_InteriorDerecho')}</option>
              <option value="Interior Izquierdo">{t('pos_InteriorIzquierdo')}</option>
              <option value="Enganche / Media Punta">{t('pos_Enganche')}</option>
              <option value="Extremo Derecho">{t('pos_ExtremoDerecho')}</option>
              <option value="Extremo Izquierdo">{t('pos_ExtremoIzquierdo')}</option>
              <option value="Delantero Centro">{t('pos_DelanteroCentro')}</option>
              <option value="Segundo Delantero">{t('pos_SegundoDelantero')}</option>
              <option value="Flexible">{t('pos_Flexible')}</option>
            </select>
            <select name="nivelHabilidad" value={formData.nivelHabilidad} onChange={handleChange} style={inputStyle}>
              <option value="Principiante">{UI_MISC[lang].niveles.principiante}</option>
              <option value="Intermedio">{UI_MISC[lang].niveles.intermedio}</option>
              <option value="Avanzado">{UI_MISC[lang].niveles.avanzado}</option>
              <option value="Élite">{UI_MISC[lang].niveles.elite}</option>
            </select>
            <input type="text" name="equipoFavorito" placeholder={t('equipoFavorito')} value={formData.equipoFavorito} onChange={handleChange} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input type="number" name="peso" placeholder={t('peso')} value={formData.peso} onChange={handleChange} style={inputStyle} />
              <input type="number" name="altura" placeholder={t('altura')} value={formData.altura} onChange={handleChange} style={inputStyle} />
            </div>
            <select name="pieHabil" value={formData.pieHabil} onChange={handleChange} style={inputStyle}>
              <option value="Derecho">{t('pieHabil_Derecho')}</option>
              <option value="Izquierdo">{t('pieHabil_Izquierdo')}</option>
              <option value="Ambidiestro">{t('pieHabil_Ambidiestro')}</option>
            </select>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>{t('step4Title')}</h2>
            <select name="frecuenciaJuego" value={formData.frecuenciaJuego} onChange={handleChange} style={inputStyle}>
              <option value="ocasional">{t('frecuencia_ocasional')}</option>
              <option value="regular">{t('frecuencia_regular')}</option>
              <option value="frecuente">{t('frecuencia_frecuente')}</option>
              <option value="intensivo">{t('frecuencia_intensivo')}</option>
            </select>
            <select name="horarioPreferido" value={formData.horarioPreferido} onChange={handleChange} style={inputStyle}>
              <option value="madrugadas">{t('horario_madrugadas')}</option>
              <option value="mañanas">{t('horario_mañanas')}</option>
              <option value="mediodia">{t('horario_mediodia')}</option>
              <option value="tardes">{t('horario_tardes')}</option>
              <option value="tardes_noche">{t('horario_tardes_noche')}</option>
              <option value="noches">{t('horario_noches')}</option>
              <option value="fines_semana">{t('horario_fines_semana')}</option>
            </select>
            <textarea name="objetivos" placeholder={t('objetivos')} value={formData.objetivos} onChange={handleChange} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
          </>
        );
      
      case 5:
        return (
          <>
            <h2 style={{ color: gold, marginBottom: 16 }}>{t('step5Title')}</h2>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {formData.previewUrl ? (
                <img src={formData.previewUrl} alt="Preview" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}` }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ ...inputStyle, padding: 8 }} />
            <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>{UI_MISC[lang].photoOptionalNote}</p>
          </>
        );
      
      default:
        return null;
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 12,
    background: '#1c1c1c',
    color: '#eee',
    border: '1px solid #333',
    borderRadius: 10,
    marginBottom: 10
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>{UI_MISC[lang].regTitle}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map(num => (
            <div
              key={num}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: pasoActual >= num ? gold : '#333',
                color: pasoActual >= num ? '#000' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {renderPaso()}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {pasoActual > 1 && (
              <button type="button" onClick={pasoAnterior} disabled={loading} style={{ flex: 1, padding: 12, background: '#333', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                {t('anterior')}
              </button>
            )}
            {pasoActual < 5 ? (
              <button type="button" onClick={siguientePaso} disabled={loading} style={{ flex: 1, padding: 12, background: `linear-gradient(135deg, ${gold}, #ff8c00)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                {t('siguiente')}
              </button>
            ) : (
              <button type="button" onClick={completarRegistro} disabled={loading} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? t('creando') : t('completar')}
              </button>
            )}
          </div>

          {pasoActual === 5 && (
            <>
              <div style={{ textAlign: 'center', color: '#aaa', margin: '10px 0' }}>— o —</div>
              <button type="button" onClick={handleGoogleSignup} disabled={loading} style={{ width: '100%', padding: 12, background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🔵</span>
                {t('continuarGoogle')}
              </button>
            </>
          )}
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#999' }}>
          {`${UI_MISC[lang].stepWord} ${pasoActual} ${UI_MISC[lang].ofWord} 5 • ${UI_MISC[lang].autosaveActive}`}
        </div>
      </div>
    </div>
  );
}

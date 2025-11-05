/**
 * Utilidad de internacionalización compartida
 * Auto-detecta el idioma del navegador y provee traducciones
 */

/**
 * Detecta el idioma del navegador
 * @returns {'es'|'en'|'pt'} Código de idioma
 */
export function detectLanguage() {
  try {
    const nav = (navigator.language || 'es').toLowerCase();
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('pt')) return 'pt';
    return 'en';
  } catch (_) {
    return 'es';
  }
}

/**
 * Crea una función de traducción basada en un diccionario
 * @param {Object} dictionary Diccionario de traducciones {es: {...}, en: {...}, pt: {...}}
 * @param {string} lang Código de idioma actual
 * @returns {Function} Función t(key) que retorna la traducción
 */
export function createTranslator(dictionary, lang = 'es') {
  return (key) => {
    if (dictionary[lang] && dictionary[lang][key]) {
      return dictionary[lang][key];
    }
    if (dictionary.es && dictionary.es[key]) {
      return dictionary.es[key];
    }
    return key;
  };
}

/**
 * Hook personalizado para internacionalización (uso con React hooks)
 * @param {Object} dictionary Diccionario de traducciones
 * @returns {Object} {lang, setLang, t} Idioma actual, setter y función de traducción
 */
export function useI18n(dictionary) {
  const [lang, setLang] = React.useState('es');
  
  React.useEffect(() => {
    setLang(detectLanguage());
  }, []);
  
  const t = React.useCallback(
    (key) => createTranslator(dictionary, lang)(key),
    [lang, dictionary]
  );
  
  return { lang, setLang, t };
}

// Traducciones comunes compartidas entre componentes
export const COMMON_TRANSLATIONS = {
  es: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No'
  },
  en: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  },
  pt: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não'
  }
};

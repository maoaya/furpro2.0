import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      'Gestión de Usuarios': 'Gestión de Usuarios',
      'Gestión de Pagos': 'Gestión de Pagos',
      'Gestión de Reportes': 'Gestión de Reportes',
      'Gestión de Notificaciones': 'Gestión de Notificaciones',
      'Auditoría y Logs': 'Auditoría y Logs',
      'Estadísticas y Métricas': 'Estadísticas y Métricas',
      'Configuración Global': 'Configuración Global',
      'Enviar': 'Enviar',
      'Guardar': 'Guardar',
      'Anterior': 'Anterior',
      'Siguiente': 'Siguiente',
      'Buscar usuario...': 'Buscar usuario...'
    }
  },
  en: {
    translation: {
      'Gestión de Usuarios': 'User Management',
      'Gestión de Pagos': 'Payments Management',
      'Gestión de Reportes': 'Reports Management',
      'Gestión de Notificaciones': 'Notifications Management',
      'Auditoría y Logs': 'Audit & Logs',
      'Estadísticas y Métricas': 'Statistics & Metrics',
      'Configuración Global': 'Global Settings',
      'Enviar': 'Send',
      'Guardar': 'Save',
      'Anterior': 'Previous',
      'Siguiente': 'Next',
      'Buscar usuario...': 'Search user...'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;

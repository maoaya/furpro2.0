// Utilitario de CAPTCHA para Supabase Auth
// Soporta Cloudflare Turnstile (recomendado) y hCaptcha

const PROVIDER = import.meta.env.VITE_CAPTCHA_PROVIDER?.toLowerCase(); // 'turnstile' | 'hcaptcha'
const SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY;
const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// En desarrollo, usar un token mock válido
const DEVELOPMENT_TOKEN = 'dev-mode-captcha-token-' + Date.now();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`No se pudo cargar el script: ${src}`));
    document.head.appendChild(s);
  });
}

async function getTurnstileToken() {
  await loadScript('https://challenges.cloudflare.com/turnstile/v0/api.js');
  if (!window.turnstile) throw new Error('Turnstile no disponible');
  if (!SITE_KEY) throw new Error('Falta VITE_CAPTCHA_SITE_KEY para Turnstile');

  const container = document.createElement('div');
  document.body.appendChild(container);

  return new Promise((resolve, reject) => {
    let widgetId = null;
    try {
      widgetId = window.turnstile.render(container, {
        sitekey: SITE_KEY,
        size: 'invisible',
        callback: (token) => {
          resolve(token);
          setTimeout(() => container.remove(), 0);
        },
        'error-callback': (err) => {
          reject(new Error(typeof err === 'string' ? err : 'Turnstile error'));
          setTimeout(() => container.remove(), 0);
        },
        'timeout-callback': () => {
          reject(new Error('Turnstile timeout'));
          setTimeout(() => container.remove(), 0);
        },
      });
      window.turnstile.execute(widgetId);
      // Fallback timeout por si no se ejecuta el callback
      setTimeout(() => {
        reject(new Error('Timeout obteniendo token de Turnstile'));
        try { if (widgetId) window.turnstile.reset(widgetId); } catch {}
        container.remove();
      }, 10000);
    } catch (e) {
      reject(e);
      container.remove();
    }
  });
}

async function getHCaptchaToken() {
  await loadScript('https://hcaptcha.com/1/api.js?render=explicit');
  if (!window.hcaptcha) throw new Error('hCaptcha no disponible');
  if (!SITE_KEY) throw new Error('Falta VITE_CAPTCHA_SITE_KEY para hCaptcha');

  const container = document.createElement('div');
  document.body.appendChild(container);
  const widgetId = window.hcaptcha.render(container, {
    sitekey: SITE_KEY,
    size: 'invisible',
    callback: () => {},
  });
  return new Promise((resolve, reject) => {
    window.hcaptcha.execute(widgetId, { async: true })
      .then((token) => {
        resolve(token);
        container.remove();
      })
      .catch((err) => {
        reject(err);
        container.remove();
      });
  });
}

export async function getCaptchaTokenSafe() {
  try {
    // En desarrollo, devolver token mock
    if (IS_DEVELOPMENT) {
      console.info('[CAPTCHA] Modo desarrollo - usando token mock');
      return DEVELOPMENT_TOKEN;
    }
    
    // Si el proveedor está definido, usarlo
    if (PROVIDER === 'turnstile') return await getTurnstileToken();
    if (PROVIDER === 'hcaptcha') return await getHCaptchaToken();

    // Si no está definido, intentamos Turnstile y luego hCaptcha como fallback
    // Esto cubre instalaciones de Supabase que usen cualquiera de los dos.
    try {
      console.info('[CAPTCHA] Intentando Turnstile (fallback)');
      return await getTurnstileToken();
    } catch (e1) {
      console.info('[CAPTCHA] Turnstile no disponible o falló, intentando hCaptcha');
      return await getHCaptchaToken();
    }
  } catch (e) {
    console.warn('No se pudo obtener captchaToken:', e.message);
    // En caso de error, devolver token mock si es desarrollo
    if (IS_DEVELOPMENT) {
      console.info('[CAPTCHA] Error en desarrollo - fallback a token mock');
      return DEVELOPMENT_TOKEN;
    }
    return null;
  }
}

export function getCaptchaProviderInfo() {
  return { provider: PROVIDER, siteKey: SITE_KEY ? 'configured' : 'missing' };
}

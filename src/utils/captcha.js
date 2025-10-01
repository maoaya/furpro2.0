// Utilitario de CAPTCHA para Supabase Auth
// En producción usa Turnstile/hCaptcha si se configuran las envs; en dev usa bypass

const IS_DEVELOPMENT = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('localhost:');
const PROVIDER = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env?.VITE_CAPTCHA_PROVIDER) || '';
const SITE_KEY = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env?.VITE_CAPTCHA_SITE_KEY) || '';

// Token mock para desarrollo y fallback
const MOCK_TOKEN = 'mock-captcha-token-' + Date.now();

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
    // Si estamos en producción y hay proveedor configurado, obtener token real
    const isProd = !IS_DEVELOPMENT;
    if (isProd && PROVIDER && SITE_KEY) {
      console.info(`[CAPTCHA] Intentando obtener token real con ${PROVIDER}`);
      if (PROVIDER.toLowerCase() === 'turnstile') {
        return await getTurnstileToken();
      }
      if (PROVIDER.toLowerCase() === 'hcaptcha') {
        return await getHCaptchaToken();
      }
      console.warn('[CAPTCHA] Proveedor no reconocido, usando bypass');
    } else {
      console.info('[CAPTCHA] Modo dev o sin configuración: usando bypass');
    }
    return MOCK_TOKEN;
  } catch (e) {
    console.warn('Error en CAPTCHA, usando bypass:', e.message);
    return MOCK_TOKEN;
  }
}

export function getCaptchaProviderInfo() {
  const isProd = !IS_DEVELOPMENT;
  return {
    provider: PROVIDER || 'mock',
    siteKey: SITE_KEY || 'disabled',
    isDevelopment: IS_DEVELOPMENT,
    status: (isProd && PROVIDER && SITE_KEY) ? 'active' : 'bypassed'
  };
}

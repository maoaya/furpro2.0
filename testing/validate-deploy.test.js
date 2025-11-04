/**
 * 🤖 VALIDACIÓN AUTOMATIZADA DE DEPLOY
 * Verifica flujo completo: Login → Homepage → Badges en menú
 */

const puppeteer = require('puppeteer');

describe('🚀 Validación Deploy - Badges en Menú Homepage', () => {
  let browser;
  let page;
  const PROD_URL = 'https://futpro.vip';
  const TIMEOUT = 30000;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test('1️⃣ Login page carga correctamente', async () => {
    await page.goto(PROD_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });
    
    // Verificar que estamos en la página de login
    const title = await page.title();
    expect(title).toContain('FutPro');
    
    console.log('✅ Página de login cargada');
  }, TIMEOUT);

  test('2️⃣ Redirección a homepage-instagram.html después de login', async () => {
    // Simular login guardando usuario en localStorage
    await page.evaluate(() => {
      localStorage.setItem('futpro_user', JSON.stringify({
        id: 'test_user_' + Date.now(),
        nombre: 'Usuario Test',
        email: 'test@futpro.vip',
        avatar: '👤'
      }));
      
      // Simular sesión de Supabase
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'test_token',
        refresh_token: 'test_refresh'
      }));
    });

    // Navegar a /home (debe redirigir a homepage-instagram.html)
    await page.goto(`${PROD_URL}/home`, { waitUntil: 'networkidle2', timeout: TIMEOUT });
    
    // Esperar redirección
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('homepage-instagram.html');
    
    console.log('✅ Redirección a homepage-instagram.html exitosa');
  }, TIMEOUT);

  test('3️⃣ Menú hamburguesa se despliega correctamente', async () => {
    // Buscar y hacer click en botón hamburguesa
    const menuButton = await page.$('.hamburger-btn');
    expect(menuButton).toBeTruthy();
    
    await menuButton.click();
    
    // Esperar que el menú se despliegue
    await page.waitForSelector('#dropdownMenu', { visible: true, timeout: 5000 });
    
    const menuVisible = await page.$eval('#dropdownMenu', el => 
      el.style.display !== 'none'
    );
    
    expect(menuVisible).toBe(true);
    console.log('✅ Menú hamburguesa desplegado');
  }, TIMEOUT);

  test('4️⃣ Badge "Nuevo" aparece en opción "Mis Tarjetas"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const tarjetasItem = items.find(item => item.textContent.includes('Mis Tarjetas'));
      if (!tarjetasItem) return false;
      
      const badge = tarjetasItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Mis Tarjetas');
  }, TIMEOUT);

  test('5️⃣ Badge "Nuevo" aparece en opción "Crear Amistoso"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const amistosoItem = items.find(item => item.textContent.includes('Crear Amistoso'));
      if (!amistosoItem) return false;
      
      const badge = amistosoItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Crear Amistoso');
  }, TIMEOUT);

  test('6️⃣ Badge "Nuevo" aparece en opción "Videos"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const videosItem = items.find(item => item.textContent.includes('Videos') && !item.textContent.includes('Transmitir'));
      if (!videosItem) return false;
      
      const badge = videosItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Videos');
  }, TIMEOUT);

  test('7️⃣ Badge "Nuevo" aparece en opción "Estados"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const estadosItem = items.find(item => item.textContent.includes('Estados'));
      if (!estadosItem) return false;
      
      const badge = estadosItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Estados');
  }, TIMEOUT);

  test('8️⃣ Badge "Nuevo" aparece en opción "Amigos"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const amigosItem = items.find(item => item.textContent.includes('Amigos'));
      if (!amigosItem) return false;
      
      const badge = amigosItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Amigos');
  }, TIMEOUT);

  test('9️⃣ Badge "Nuevo" aparece en opción "Soporte"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const soporteItem = items.find(item => item.textContent.includes('Soporte'));
      if (!soporteItem) return false;
      
      const badge = soporteItem.querySelector('.badge-new');
      return badge && badge.textContent.trim() === 'Nuevo';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "Nuevo" en Soporte');
  }, TIMEOUT);

  test('🔟 Badge "React" aparece en opción "Configuración"', async () => {
    const hasBadge = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dropdown-item'));
      const configItem = items.find(item => 
        item.textContent.includes('Configuración') && 
        item.getAttribute('onclick')?.includes('abrirConfiguracion')
      );
      if (!configItem) return false;
      
      const badge = configItem.querySelector('.badge-react');
      return badge && badge.textContent.trim() === 'React';
    });
    
    expect(hasBadge).toBe(true);
    console.log('✅ Badge "React" en Configuración');
  }, TIMEOUT);

  test('1️⃣1️⃣ Sección "Atajos React (SPA)" existe', async () => {
    const hasSection = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.menu-section-title'));
      return titles.some(title => title.textContent.includes('Atajos React'));
    });
    
    expect(hasSection).toBe(true);
    console.log('✅ Sección "Atajos React (SPA)" encontrada');
  }, TIMEOUT);

  test('1️⃣2️⃣ Link directo "/configuracion" existe en menú', async () => {
    const hasLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.dropdown-item'));
      const configLink = links.find(link => 
        link.getAttribute('href') === '/configuracion' &&
        link.textContent.includes('Ir a Configuración')
      );
      return !!configLink;
    });
    
    expect(hasLink).toBe(true);
    console.log('✅ Link directo /configuracion encontrado');
  }, TIMEOUT);

  test('1️⃣3️⃣ Estilos de badge "Nuevo" son correctos', async () => {
    const styles = await page.evaluate(() => {
      const badge = document.querySelector('.badge-new');
      if (!badge) return null;
      
      const computed = window.getComputedStyle(badge);
      return {
        background: computed.backgroundColor,
        color: computed.color,
        borderRadius: computed.borderRadius
      };
    });
    
    expect(styles).toBeTruthy();
    expect(styles.background).toContain('0, 200, 83'); // #00C853
    expect(styles.color).toContain('255, 255, 255'); // white
    expect(styles.borderRadius).toBe('10px');
    
    console.log('✅ Estilos de badge "Nuevo" correctos');
  }, TIMEOUT);

  test('1️⃣4️⃣ Estilos de badge "React" son correctos', async () => {
    const styles = await page.evaluate(() => {
      const badge = document.querySelector('.badge-react');
      if (!badge) return null;
      
      const computed = window.getComputedStyle(badge);
      return {
        background: computed.backgroundColor,
        color: computed.color,
        borderRadius: computed.borderRadius
      };
    });
    
    expect(styles).toBeTruthy();
    expect(styles.background).toContain('97, 218, 251'); // #61dafb
    expect(styles.color).toContain('17, 17, 17'); // #111
    expect(styles.borderRadius).toBe('10px');
    
    console.log('✅ Estilos de badge "React" correctos');
  }, TIMEOUT);

  test('1️⃣5️⃣ Total de opciones del menú = 31', async () => {
    const totalItems = await page.evaluate(() => {
      return document.querySelectorAll('.dropdown-item').length;
    });
    
    expect(totalItems).toBeGreaterThanOrEqual(31);
    console.log(`✅ Total opciones de menú: ${totalItems}`);
  }, TIMEOUT);

  test('1️⃣6️⃣ Función abrirConfiguracion() redirige a /configuracion', async () => {
    const redirectUrl = await page.evaluate(() => {
      // Extraer el código de la función desde el HTML
      const script = Array.from(document.querySelectorAll('script'))
        .find(s => s.textContent.includes('function abrirConfiguracion'));
      
      if (!script) return null;
      
      const match = script.textContent.match(/function abrirConfiguracion\(\)\s*{[^}]*window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
      return match ? match[1] : null;
    });
    
    expect(redirectUrl).toBe('/configuracion');
    console.log('✅ abrirConfiguracion() apunta a /configuracion');
  }, TIMEOUT);
});

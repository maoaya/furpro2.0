const puppeteer = require('puppeteer');

describe('Navegación y autoguardado FutPro', () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });

  test('Navegación entre páginas principales', async () => {
    await page.goto('file://' + __dirname + '/../homepage-instagram.html');
    await page.waitForSelector('.bottom-nav');
    // Home
    await page.click('#navHome');
    await page.waitForSelector('h1');
    expect(await page.$eval('h1', el => el.textContent)).toMatch(/Inicio|Home/);
    // Marketplace
    await page.goto('file://' + __dirname + '/../homepage-instagram.html');
    await page.click('#navMarket');
    await page.waitForSelector('h1');
    expect(await page.$eval('h1', el => el.textContent)).toMatch(/Market/);
    // Videos
    await page.goto('file://' + __dirname + '/../homepage-instagram.html');
    await page.click('#navVideos');
    await page.waitForSelector('h1, .logo');
    expect(await page.content()).toMatch(/Videos|FutPro/);
    // Alertas
    await page.goto('file://' + __dirname + '/../homepage-instagram.html');
    await page.click('#navAlertas');
    await page.waitForSelector('h1');
    expect(await page.$eval('h1', el => el.textContent)).toMatch(/Notificaciones|Alertas/);
    // Chat
    await page.goto('file://' + __dirname + '/../homepage-instagram.html');
    await page.click('#navChat');
    await page.waitForSelector('h1');
    expect(await page.$eval('h1', el => el.textContent)).toMatch(/Chat/);
  });

  test('Autoguardado en equipos.html', async () => {
    await page.goto('file://' + __dirname + '/../equipos.html');
    await page.waitForSelector('#equipoForm');
    await page.type('#equipoNombre', 'Test FC');
    await page.type('#equipoCiudad', 'Ciudad Test');
    await page.select('#equipoCategoria', 'Libre Masculino');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    const equipos = await page.evaluate(() => JSON.parse(localStorage.getItem('futpro_equipos') || '[]'));
    expect(equipos.some(eq => eq.nombre === 'Test FC')).toBe(true);
  });
});

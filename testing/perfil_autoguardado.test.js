const puppeteer = require('puppeteer');

describe('Autoguardado de perfil FutPro', () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });

  test('Autoguarda nombre, posición, equipo y foto de perfil', async () => {
    await page.goto('file://' + __dirname + '/../editar-perfil.html');
    await page.waitForSelector('#perfilForm');
    await page.type('#nombre', 'Test User');
    await page.select('#posicion', 'Delantero');
    await page.type('#equipo', 'Test FC');
    await page.type('#bio', 'Jugador de pruebas');
    // Simular subida de foto de perfil
    const input = await page.$('#avatarInput');
    await input.uploadFile(__dirname + '/fixtures/profile.jpg');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    // Verificar autoguardado en localStorage
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('futpro_user')));
    expect(user.nombre).toBe('Test User');
    expect(user.posicion).toBe('Delantero');
    expect(user.equipo).toBe('Test FC');
    expect(user.bio).toBe('Jugador de pruebas');
    expect(user.avatar).toMatch(/^data:image/);
    // Verificar registro de autoguardado
    const cambios = await page.evaluate(() => JSON.parse(localStorage.getItem('futpro_cambios_perfil')));
    expect(Array.isArray(cambios)).toBe(true);
    expect(cambios.some(c => c.campo === 'nombre' && c.valorNuevo === 'Test User')).toBe(true);
    expect(cambios.some(c => c.campo === 'posicion' && c.valorNuevo === 'Delantero')).toBe(true);
    expect(cambios.some(c => c.campo === 'equipo' && c.valorNuevo === 'Test FC')).toBe(true);
    expect(cambios.some(c => c.campo === 'avatar')).toBe(true);
  });
});

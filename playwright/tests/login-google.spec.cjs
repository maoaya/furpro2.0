const { test, expect } = require('@playwright/test');

test('Login Google FutPro', async ({ page, context }) => {

  await page.goto('https://futpro.vip');

  // Click en el botón y espera navegación/redirección en la misma ventana
  await Promise.all([
    page.waitForNavigation({ timeout: 30000 }),
    page.getByText('Continue with Google').click()
  ]);
  // Verifica que el usuario está logueado (ajusta el texto si es necesario)
  await expect(page.getByText('Bienvenido')).toBeVisible();
});

const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './playwright/tests',
  ignore: ['C:/Users/lenovo/AppData/Local/ElevatedDiagnostics'],
  reporter: 'html'
});

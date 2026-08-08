import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testingDir = path.join(__dirname, 'testing');

// Función para actualizar imports en archivos de test
function updateTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Si ya tiene el helper, no lo actualices
    if (content.includes('server.helper.mjs')) {
      console.log(`✓ ${path.basename(filePath)} ya está actualizado`);
      return;
    }
    
    // Si tiene importación dinámica de server.js, actualizarlo
    if (content.includes("await import('../server.js')")) {
      // Agregar import del helper
      if (!content.includes("import { getServerAndApp }")) {
        content = content.replace(
          /import supertest from 'supertest';/,
          "import supertest from 'supertest';\nimport { getServerAndApp } from './server.helper.mjs';"
        );
      }
      
      // Reemplazar la importación dinámica
      content = content.replace(
        /\(\{ server \}\s*=\s*await import\('\.\.\/server\.js'\)\);?/g,
        '({ server } = await getServerAndApp());'
      );
      
      content = content.replace(
        /\(\{ app \}\s*=\s*await import\('\.\.\/server\.js'\)\);?/g,
        '({ app } = await getServerAndApp());'
      );
      
      // Para casos con desestructuración múltiple
      content = content.replace(
        /\(\{ server, app \}\s*=\s*await import\('\.\.\/server\.js'\)\);?/g,
        '({ server, app } = await getServerAndApp());'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Actualizado: ${path.basename(filePath)}`);
    } else {
      console.log(`- ${path.basename(filePath)} no necesita actualización`);
    }
  } catch (error) {
    console.error(`✗ Error actualizando ${filePath}:`, error.message);
  }
}

// Buscar todos los archivos .test.mjs
function updateAllTestFiles() {
  try {
    const files = fs.readdirSync(testingDir);
    const testFiles = files.filter(file => file.endsWith('.test.mjs'));
    
    console.log(`Encontrados ${testFiles.length} archivos de test:`);
    
    testFiles.forEach(file => {
      const filePath = path.join(testingDir, file);
      updateTestFile(filePath);
    });
    
    console.log('\n✓ Actualización completada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateAllTestFiles();
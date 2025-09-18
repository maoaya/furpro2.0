// Script para crear tablas necesarias en la base de datos
const db = require('./src/config/db');

async function crearTablas() {
  // Tabla dominios
  await db.schema.hasTable('dominios').then(exists => {
    if (!exists) {
      return db.schema.createTable('dominios', table => {
        table.increments('id').primary();
        table.string('dominio').unique().notNullable();
        table.string('email').notNullable();
        table.string('telefono');
        table.string('direccion');
        table.timestamps(true, true);
      });
    }
  });

  // Tabla usuarios
  await db.schema.hasTable('usuarios').then(exists => {
    if (!exists) {
      return db.schema.createTable('usuarios', table => {
        table.increments('id').primary();
        table.string('usuario').unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('telefono');
        table.string('direccion');
        table.timestamps(true, true);
      });
    }
  });

  // Tabla formularios
  await db.schema.hasTable('formularios').then(exists => {
    if (!exists) {
      return db.schema.createTable('formularios', table => {
        table.increments('id').primary();
        table.text('datos').notNullable();
        table.timestamps(true, true);
      });
    }
  });

  console.log('Tablas creadas o ya existen.');
  process.exit(0);
}

crearTablas();

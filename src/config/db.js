// Configuración de Knex para múltiples motores
import knex from 'knex';

const db = knex({
  client: process.env.DB_CLIENT || 'sqlite3', // 'mysql2', 'pg', 'sqlite3'
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'futpro',
    filename: process.env.DB_FILENAME || './futpro.sqlite'
  },
  useNullAsDefault: true // Solo para SQLite
});

export default db;

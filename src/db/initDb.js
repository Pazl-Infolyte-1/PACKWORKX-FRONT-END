import { loadFromIndexedDB, saveToIndexedDB } from './indexedDb';
import initSqlJs from 'sql.js';

let db = null; // Ensure singleton

export const getDbInstance = async () => {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: () => 'https://sql.js.org/dist/sql-wasm.wasm',
  });

  // Attempt to load from IndexedDB
  const savedDb = await loadFromIndexedDB();
  db = savedDb ? new SQL.Database(new Uint8Array(savedDb)) : new SQL.Database();

  // Ensure tables exist
  db.run(`
    CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY, accessToken TEXT);
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS auth (id INTEGER PRIMARY KEY, state TEXT);
  `);

  console.log('✅ Database initialized.');
  return db;
};

// db/authService.js
import { saveToIndexedDB } from './indexedDb';
import { getDbInstance } from './initDb';

// Save auth state to SQL.js and IndexedDB
export const saveAuthState = async (authState) => {
  const db = await getDbInstance();
  db.run('DELETE FROM auth;');
  db.run('INSERT INTO auth (state) VALUES (?);', [JSON.stringify(authState)]);
  await saveToIndexedDB(db);
  console.log('🔒 Auth state saved.');
};

// Get Token
export const getToken = async () => {
  const db = await getDbInstance();
  const result = db.exec('SELECT accessToken FROM tokens;');
  return result.length > 0 ? result[0].values[0][0] : null;
};

// Load auth state from SQL.js
export const loadAuthState = async () => {
  const db = await getDbInstance();
  const result = db.exec('SELECT state FROM auth;');
  return result.length ? JSON.parse(result[0].values[0][0]) : null;
};

// Clear auth state
export const clearAuthState = async () => {
  const db = await getDbInstance();
  db.run('DELETE FROM auth;');
  await saveToIndexedDB(db);
  console.log('❌ Auth state cleared.');
};

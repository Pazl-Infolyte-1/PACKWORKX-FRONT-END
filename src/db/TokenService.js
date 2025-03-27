import { saveToIndexedDB } from './indexedDb';
import { getDbInstance } from './initDb';

// Save token to SQL.js and IndexedDB
export const saveToken = async (token) => {
  const db = await getDbInstance();
  db.run('DELETE FROM tokens;'); // Ensure one token
  db.run('INSERT INTO tokens (accessToken) VALUES (?);', [token]);
  await saveToIndexedDB(db);
  console.log('🔐 Token saved.');
};

// Get token from SQL.js
export const getToken = async () => {
  const db = await getDbInstance();
  const result = db.exec('SELECT accessToken FROM tokens;');
  return result.length > 0 ? result[0].values[0][0] : null;
};

// Delete token
export const deleteToken = async () => {
  const db = await getDbInstance();
  db.run('DELETE FROM tokens;');
  await saveToIndexedDB(db);
  console.log('❌ Token deleted.');
};

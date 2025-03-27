import { openDB } from 'idb';

const DB_NAME = 'appDatabase';
const STORE_NAME = 'sqlData';

// Open or create IndexedDB
export const openIndexedDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

// Save SQL.js data to IndexedDB
export const saveToIndexedDB = async (db) => {
  const idb = await openIndexedDB(); // Open the IndexedDB
  const data = db.export(); // Export SQL.js database as binary data (Uint8Array)
  await idb.put(STORE_NAME, data, 'dbState'); // Store it in IndexedDB
  console.log('✅ Saved to IndexedDB');
};

// Load SQL.js data from IndexedDB
export const loadFromIndexedDB = async () => {
  console.log("loading.. from index");
  const idb = await openIndexedDB();
  return idb.get(STORE_NAME, 'dbState');
};

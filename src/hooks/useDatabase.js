import { useEffect, useState } from 'react';
import { getDbInstance } from '../db/initDb';
import { saveToIndexedDB } from '../db/indexedDb';

export const useDatabase = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const loadDb = async () => {
      try {
        const database = await getDbInstance();
        setDb(database);
        console.log('✅ Database loaded successfully from IndexedDB.');

        // Ensure data is saved before the page unloads
        const saveOnUnload = async () => {
          await saveToIndexedDB(database);
          console.log('💾 Database saved on unload.');
        };

        window.addEventListener('beforeunload', saveOnUnload);
        return () => window.removeEventListener('beforeunload', saveOnUnload);
      } catch (error) {
        console.error('❌ Error initializing database:', error);
      }
    };

    loadDb();
  }, []);

  return db; // Expose the database instance
};

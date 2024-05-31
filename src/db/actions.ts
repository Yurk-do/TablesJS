import { Articles, dbName, dbVersion } from './db';

export const updateData = <T>(
  storeName: string,
  data: T,
): Promise<T | string | null> =>
  new Promise((resolve) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      if (db.objectStoreNames.contains(storeName)) {
        store.put(data);
      } else {
        store.add(data);
      }
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });

export const getIndexedDbData = <T>(
  storeName: string,
  article: Articles,
): Promise<T[]> =>
  new Promise((resolve) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const res = store.getAll(article);
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });

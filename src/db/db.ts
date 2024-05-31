// interface TableData {
//   [key: string]: string;
// }

export const dbName = 'TestDB';
export const dbVersion = 1;

export enum Stores {
  Tables = 'tables',
}

export enum Articles {
  Chapters = 'chapters',
  TableData = 'tableData',
}

export const initDB = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore(Stores.Tables, { keyPath: 'name' });
    };

    request.onsuccess = () => {
      const db = request.result;
      const { version } = db;
      console.log('db Initialized with version: ', version);
      resolve(true);
    };

    request.onerror = () => {
      reject(new Error('Failed to initialize the database'));
    };
  });

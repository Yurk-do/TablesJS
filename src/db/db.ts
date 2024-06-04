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

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (event.oldVersion === 1) {
        db.deleteObjectStore(Stores.Tables);
      }
      db.createObjectStore(Stores.Tables, { keyPath: 'name' });
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
        alert('База данных устарела, пожалуйста, перезагрузите страницу.');
      };

      const { version } = db;
      console.log('db Initialized with version: ', version);
      resolve(true);
    };

    request.onerror = (event) => {
      if (request.error?.name === 'VersionError') {
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onsuccess = () => {
          console.log('Database deleted successfully');
          return initDB();
        };

        deleteRequest.onerror = () => {
          console.log('Failed to delete database');
          reject();
        };
      }
      reject(new Error('Failed to initialize the database'));
    };
  });

import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dbPath = "db.db";

export async function getDatabase() {
  const file = await FileSystem.getInfoAsync(
    `${FileSystem.documentDirectory}SQLite/${dbPath}`
  );
  const db = SQLite.openDatabase(dbPath);

  if (!file.exists) {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE meters (
            id TEXT PRIMARY KEY NOT NULL,
            location TEXT, 
            unit TEXT,
            synchedAt TEXT
          )`
        );
        tx.executeSql(
          `CREATE TABLE readings (
            id TEXT PRIMARY KEY NOT NULL,
            meterId TEXT, 
            value REAL,
            createdAt TEXT,
            synchedAt TEXT,
            FOREIGN KEY(meterId) REFERENCES meters(id)
          )`
        );
      },
      (e) => console.log(e)
    );
  }

  return db;
}

type Result<T> = {
  rowsAffected: number;
  insertId?: number | undefined;
  rows: T[];
};

export async function dbQuery<T>(
  sql: string,
  args: unknown[] = [],
  readOnly: boolean = true
) {
  const db = await getDatabase();

  return new Promise<Result<T> | null>((resolve, reject) => {
    db.exec([{ sql, args }], readOnly, (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res == null) {
        return resolve(null);
      }
      const row = res[0];

      if ("error" in row) {
        return reject(row.error);
      }

      resolve({
        rowsAffected: row.rowsAffected,
        insertId: row.insertId,
        rows: row.rows as T[],
      });
    });
  });
}

export async function deleteDatabase() {
  const file = await FileSystem.getInfoAsync(
    `${FileSystem.documentDirectory}SQLite/${dbPath}`
  );

  if (!file.exists) return;

  await FileSystem.deleteAsync(
    `${FileSystem.documentDirectory}SQLite/${dbPath}`
  );
  await AsyncStorage.removeItem("last-sync");
}

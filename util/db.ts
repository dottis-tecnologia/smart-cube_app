import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dbPath = "db.db";

export const getDatabase = () => SQLite.openDatabase(dbPath);

export async function createTables() {
  const db = getDatabase();

  db.transaction(
    (tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS meters (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT,
            location TEXT, 
            unit TEXT,
            synchedAt TEXT,
            notes TEXT,
            type TEXT,
            imagePath TEXT
          )`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS readings (
            id TEXT PRIMARY KEY NOT NULL,
            meterId TEXT, 
            value REAL,
            createdAt TEXT,
            synchedAt TEXT,
            imagePath TEXT,
            technicianName TEXT,
            technicianId TEXT,
            FOREIGN KEY(meterId) REFERENCES meters(id)
          )`
      );
    },
    (e) => console.log(e)
  );
}

export type Result<T> = {
  rowsAffected: number;
  insertId?: number | undefined;
  rows: T[];
};

export async function dbQuery<T>(
  sql: string,
  args: unknown[] = [],
  readOnly: boolean = true
) {
  const db = getDatabase();

  return new Promise<Result<T>>((resolve, reject) => {
    db.exec([{ sql, args }], readOnly, (err, res) => {
      if (err) {
        return reject(err);
      }
      if (res == null) {
        return reject(new Error("Null response"));
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
  const databasePath = `${FileSystem.documentDirectory}SQLite/${dbPath}`;

  const databaseFile = await FileSystem.getInfoAsync(databasePath);
  if (databaseFile.exists) {
    await FileSystem.deleteAsync(databasePath);
  }

  const picturesPath = `${FileSystem.documentDirectory}pictures`;

  const picturesDir = await FileSystem.getInfoAsync(databasePath);
  if (picturesDir.exists) {
    await FileSystem.deleteAsync(picturesPath);
  }
  await AsyncStorage.removeItem("last-sync");

  await createTables();
}

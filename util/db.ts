import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dbFileName = "db.db";
export const databasePath = `${FileSystem.documentDirectory}SQLite/${dbFileName}`;

// Singleton para manter a conexão do banco
let dbInstance: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await openDatabaseAsync(dbFileName);
  }
  return dbInstance;
}

export async function createTables() {
  const db = await getDatabase();

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS meters (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        location TEXT, 
        unit TEXT,
        synchedAt TEXT,
        notes TEXT,
        type TEXT,
        imagePath TEXT
      );
      
      CREATE TABLE IF NOT EXISTS readings (
        id TEXT PRIMARY KEY NOT NULL,
        meterId TEXT, 
        value REAL,
        createdAt TEXT,
        synchedAt TEXT,
        imagePath TEXT,
        technicianName TEXT,
        technicianId TEXT,
        FOREIGN KEY(meterId) REFERENCES meters(id)
      );
    `);
  } catch (e) {
    if (__DEV__) console.log('Error creating tables:', e);
  }
}

export type Result<T> = {
  rowsAffected: number;
  insertId?: number;
  rows: T[];
};

export async function dbQuery<T>(
  sql: string,
  args: (string | number | null | Uint8Array | boolean)[] = [],
  readOnly: boolean = true
): Promise<Result<T>> {
  const db = await getDatabase();

  try {
    const result = await db.getAllAsync(sql, args);
    
    // Para queries SELECT, retornamos os resultados
    return {
      rowsAffected: 0,
      rows: result as T[],
    };
  } catch (err) {
    throw err;
  }
}

export async function dbExec(
  sql: string,
  args: (string | number | null | Uint8Array | boolean)[] = []
): Promise<{ rowsAffected: number; insertId?: number }> {
  const db = await getDatabase();

  try {
    const result = await db.runAsync(sql, args);
    
    return {
      rowsAffected: result.changes || 0,
      insertId: typeof result.lastInsertRowId === 'bigint' 
        ? Number(result.lastInsertRowId) 
        : result.lastInsertRowId,
    };
  } catch (err) {
    throw err;
  }
}

export async function deleteDatabase() {
  const databasePath = `${FileSystem.documentDirectory}SQLite/${dbFileName}`;

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

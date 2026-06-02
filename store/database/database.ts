import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  if (db) return;

  db = await SQLite.openDatabaseAsync('fitness.db');

  await db.runAsync('PRAGMA journal_mode = WAL');

  await db.runAsync(`CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    duration INTEGER NOT NULL,
    notes TEXT,
    synced INTEGER NOT NULL DEFAULT 0
  )`);

  await db.runAsync(`CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    workout_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('strength', 'cardio', 'cooldown')),
    name TEXT NOT NULL,
    muscle_group TEXT,
    equipment TEXT,
    synced INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
  )`);

  await db.runAsync(`CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    weight_kg_each REAL,
    weight_kg_total REAL,
    reps INTEGER,
    speed_kmh REAL,
    duration_min REAL,
    note TEXT,
    synced INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
  )`);

  await db.runAsync(`CREATE TABLE IF NOT EXISTS exercise_notes (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('technique', 'pain', 'sensation')),
    priority TEXT NOT NULL CHECK(priority IN ('high', 'medium')),
    text TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
  )`);

  console.log('[DB] Tables initialized');
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Base de données locale SQLite — VolleyTeam
 * Fonctionne hors ligne, sans configuration externe.
 */
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('volleyteam.db');
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL DEFAULT 'Volley Team',
      category TEXT NOT NULL DEFAULT 'Senior',
      coach TEXT NOT NULL DEFAULT '',
      season TEXT NOT NULL DEFAULT '2026 - 2027',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY NOT NULL,
      team_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      number INTEGER NOT NULL DEFAULT 0,
      position TEXT NOT NULL DEFAULT 'Réceptionneur-attaquant',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT,
      birth_date TEXT,
      birth_place TEXT,
      address TEXT,
      status TEXT NOT NULL DEFAULT 'actif',
      avatar TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trainings (
      id TEXT PRIMARY KEY NOT NULL,
      team_id TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS presences (
      id TEXT PRIMARY KEY NOT NULL,
      training_id TEXT NOT NULL,
      member_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'absent',
      time TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(training_id, member_id),
      FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      icon TEXT,
      color TEXT,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Ensure at least one team exists
  const team = await database.getFirstAsync<{ id: string }>('SELECT id FROM teams LIMIT 1');
  if (!team) {
    const now = new Date().toISOString();
    const id = generateId();
    await database.runAsync(
      `INSERT INTO teams (id, name, category, coach, season, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, 'Volley Team', 'Senior', '', '2026 - 2027', now, now]
    );
  }
}

export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function nowIso(): string {
  return new Date().toISOString();
}

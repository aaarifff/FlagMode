import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data.db');

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initDb(dbInstance);
  }
  return dbInstance;
}

function initDb(db: DatabaseSync) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS round_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      battle_id TEXT NOT NULL,
      round INTEGER NOT NULL,
      winner_code TEXT NOT NULL,
      played_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin if missing
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || '123';

  const userQuery = db.prepare('SELECT id FROM users WHERE username = ?');
  const existing = userQuery.get(adminUser);

  if (!existing) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPass, salt);
    const insert = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    insert.run(adminUser, hash);
  }

  // Seed default settings if empty
  const defaultSettings: Record<string, string> = {
    title: '100-Country Flags Battle',
    durationMin: '30',
    flagCount: '100',
    qualifierTarget: '5',
    gapDegrees: '45',
    ringSpeed: '0.015',
    sound: 'true',
    music: 'true',
    promoEnabled: 'true',
    promoName: 'EpicSann',
    promoHandle: '@FlagsBattleOfficial'
  };

  const getSetting = db.prepare('SELECT value FROM settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

  for (const [k, v] of Object.entries(defaultSettings)) {
    const row = getSetting.get(k);
    if (!row) {
      insertSetting.run(k, v);
    }
  }
}

export function getUserByUsername(username: string) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as { id: number; username: string; password_hash: string } | undefined;
}

export function getAllSettings(): Record<string, string> {
  const db = getDb();
  const stmt = db.prepare('SELECT key, value FROM settings');
  const rows = stmt.all() as { key: string; value: string }[];
  const res: Record<string, string> = {};
  for (const r of rows) {
    res[r.key] = r.value;
  }
  return res;
}

export function updateSettingValue(key: string, value: string) {
  const db = getDb();
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(key, value);
}

export function recordRoundWinner(battleId: string, round: number, winnerCode: string) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO round_results (battle_id, round, winner_code) VALUES (?, ?, ?)');
  stmt.run(battleId, round, winnerCode);
}

export function getRoundWinners(battleId?: string) {
  const db = getDb();
  if (battleId) {
    const stmt = db.prepare('SELECT * FROM round_results WHERE battle_id = ? ORDER BY round ASC');
    return stmt.all(battleId);
  }
  const stmt = db.prepare('SELECT * FROM round_results ORDER BY id DESC LIMIT 50');
  return stmt.all();
}


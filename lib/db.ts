import { createClient, type Client } from '@libsql/client';
import bcrypt from 'bcryptjs';
// Local development keeps using data.db. Vercel must use a remote database.
let dbPromise: Promise<Client> | null = null;

export function getDb(): Promise<Client> {
  if (!dbPromise) {
    dbPromise = openDb().catch((error) => {
      dbPromise = null; // Allow a later request to retry after a transient failure.
      throw error;
    });
  }
  return dbPromise;
}

async function openDb(): Promise<Client> {
  const url = process.env.TURSO_DATABASE_URL || 'file:data.db';
  if (process.env.VERCEL && (!process.env.TURSO_DATABASE_URL || url.startsWith('file:'))) {
    throw new Error('Configure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel, then redeploy.');
  }
  if (process.env.VERCEL && !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Configure TURSO_AUTH_TOKEN in Vercel, then redeploy.');
  }
  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  try {
    await initDb(db);
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

async function initDb(db: Client) {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS round_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      battle_id TEXT NOT NULL,
      round INTEGER NOT NULL,
      winner_code TEXT NOT NULL,
      played_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ], 'write');

  // Seed default admin if missing
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || '123';

  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE username = ?', args: [adminUser],
  });
  if (!existing.rows.length) {
    if (process.env.VERCEL && !process.env.ADMIN_PASS) {
      throw new Error('Configure ADMIN_PASS in Vercel to create the initial admin account.');
    }
    const hash = await bcrypt.hash(adminPass, 10);
    // Concurrent cold starts may both try to seed the same account.
    await db.execute({
      sql: 'INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)',
      args: [adminUser, hash],
    });
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

  await db.batch(Object.entries(defaultSettings).map(([key, value]) => ({
    sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
    args: [key, value],
  })), 'write');
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
  const row = result.rows[0];
  return row ? { id: Number(row.id), username: String(row.username), password_hash: String(row.password_hash) } : undefined;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const db = await getDb();
  const result = await db.execute('SELECT key, value FROM settings');
  return Object.fromEntries(result.rows.map(row => [String(row.key), String(row.value)]));
}

export async function updateSettingValue(key: string, value: string) {
  const db = await getDb();
  await db.execute({ sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', args: [key, value] });
}

export async function recordRoundWinner(battleId: string, round: number, winnerCode: string) {
  const db = await getDb();
  await db.execute({
    sql: 'INSERT INTO round_results (battle_id, round, winner_code) VALUES (?, ?, ?)',
    args: [battleId, round, winnerCode],
  });
}

export async function getRoundWinners(battleId?: string) {
  const db = await getDb();
  const result = await db.execute(battleId
    ? { sql: 'SELECT * FROM round_results WHERE battle_id = ? ORDER BY round ASC', args: [battleId] }
    : 'SELECT * FROM round_results ORDER BY id DESC LIMIT 50');
  return result.rows;
}

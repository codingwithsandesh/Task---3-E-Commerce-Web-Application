import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;
let isConnected = false;

export async function initMySQL(): Promise<boolean> {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE || 'shopsphere_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  if (!host || !user) {
    console.log('[MySQL] No MySQL credentials configured in environment. Using embedded relational engine.');
    return false;
  }

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    console.log(`[MySQL] Successfully connected to MySQL 8.0 at ${host}:${port}/${database}`);
    return true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[MySQL] Could not connect to MySQL server (${errorMsg}). Defaulting to embedded relational store.`);
    pool = null;
    isConnected = false;
    return false;
  }
}

export function getMySQLPool(): Pool | null {
  return pool;
}

export function isMySQLConnected(): boolean {
  return isConnected;
}

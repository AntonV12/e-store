import mysql from "mysql2/promise";

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_DATABASE;

declare global {
  var _pool: mysql.Pool | undefined;
}

export const pool =
  globalThis._pool ||
  (globalThis._pool = mysql.createPool({
    host,
    user,
    password: pass,
    database: db,
    connectionLimit: 50,
    waitForConnections: true,
    queueLimit: 0,
  }));

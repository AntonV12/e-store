import mysql from "mysql2/promise";

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_DATABASE;

export const pool = mysql.createPool({
  host: host,
  user: user,
  password: pass,
  database: db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

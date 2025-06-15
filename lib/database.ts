import mysql from "mysql2/promise";

const pass = process.env.DB_PASS;

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: pass,
  database: "e-store",
});

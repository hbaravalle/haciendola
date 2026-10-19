require("dotenv").config();
const mysql2 = require("mysql2/promise");

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`
    );
    await connection.end();

    console.log("[Database] Database created or already exists");
  } catch (error) {
    console.error("[Database] Error creating database:", error);
    throw error;
  }
}

createDatabaseIfNotExists();

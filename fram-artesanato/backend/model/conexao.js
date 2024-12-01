require("dotenv").config({ path: __dirname + "/.env" });
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
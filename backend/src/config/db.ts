import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.connect()
  .then((client) => {
    console.log("✓ Database connected successfully");
    console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`  Database: ${process.env.DB_NAME}`);
    console.log(`  User: ${process.env.DB_USER}`);
    client.release();
  })
  .catch((err) => {
    console.error("✗ Database connection failed");
    console.error(`  Error: ${err.message}`);
  });

export default pool;

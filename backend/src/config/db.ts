import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

// Test database connection
pool.connect()
  .then((client) => {
    console.log("✓ Neon Database connected successfully");
    client.release();
  })
  .catch((err) => {
    console.error("✗ Database connection failed");
    console.error(`Error: ${err.message}`);
  });

export default pool;
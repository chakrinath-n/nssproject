import "dotenv/config";
import app from "./app";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n========================================");
  console.log("        SERVER STARTED");
  console.log("========================================");
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log("========================================\n");
});

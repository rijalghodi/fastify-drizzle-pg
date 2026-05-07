import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL ?? "";

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set");
}
export default defineConfig({
  schema: "./src/db/models/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});

import "dotenv/config";
import { defineConfig } from "prisma/config";

// Fallback for builds where DB is not configured (e.g. Vercel); app uses mock data at runtime when DATABASE_URL is unset
const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});

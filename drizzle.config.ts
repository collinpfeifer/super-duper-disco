import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations/",
  // driver: "better-sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});

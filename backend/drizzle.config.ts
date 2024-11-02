import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connection =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_DATABASE_URL
    : process.env.DEV_DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connection!,
  },
});

import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const connectionUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_DATABASE_URL
    : process.env.DEV_DATABASE_URL;

if (!connectionUrl) {
  throw new Error("No DB url string found");
}

const sql = neon(connectionUrl);
const db = drizzle(sql, { schema });

export default db;

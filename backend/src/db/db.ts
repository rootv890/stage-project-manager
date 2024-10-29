import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connection = process.env.DATABASE_URL!;

if (!connection) {
  throw new Error("No DB url string found");
}

const sql = neon(connection);
const db = drizzle(sql, { schema });

export default db;

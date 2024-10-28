import 'dotenv/config.js'
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";


const dbConnection =  import.meta.env.DATABASE_URL;
console.log(dbConnection)

const sql = neon(process.env.);

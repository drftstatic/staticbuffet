import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

// This driver is @neondatabase/serverless, which speaks Postgres over a
// WebSocket. Only a postgres:// URL is usable; anything else (e.g. the
// sqlite:./local.db placeholder that used to ship in .env) would make the
// driver try to open wss://<garbage-host> and throw ENOTFOUND. Treat those
// as "no database" and fall back to the in-memory caches.
const dbUrl = process.env.DATABASE_URL;
const isPostgresUrl = !!dbUrl && /^postgres(ql)?:\/\//.test(dbUrl);
const hasRealDatabase = isPostgresUrl && !dbUrl!.includes('temp:temp@localhost');

if (!dbUrl) {
  console.warn('⚠️ No DATABASE_URL provided - running without database features');
} else if (!hasRealDatabase) {
  console.warn('⚠️ DATABASE_URL is not a postgres:// URL - running without database features');
}

// Only create database connection if we have a real database
export const pool = hasRealDatabase ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
export const db = hasRealDatabase ? drizzle({ client: pool!, schema }) : null;

// Export a flag to check if database is available
export const isDatabaseAvailable = hasRealDatabase;

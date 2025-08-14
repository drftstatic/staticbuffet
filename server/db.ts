import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check if we have a real database URL (not the temporary one)
const hasRealDatabase = process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('temp:temp@localhost');

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ No DATABASE_URL provided - running without database features');
}

// Only create database connection if we have a real database
export const pool = hasRealDatabase ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
export const db = hasRealDatabase ? drizzle({ client: pool!, schema }) : null;

// Export a flag to check if database is available
export const isDatabaseAvailable = hasRealDatabase;
